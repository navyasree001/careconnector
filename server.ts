import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { evaluateOfflineRules } from './src/services/triageEngine';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// Shared Gemini client utility
// Model constant as requested: "gemini-flash-latest"
const GEMINI_MODEL = 'gemini-flash-latest';

let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  aiClient = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. AI Triage endpoint
app.post('/api/triage', async (req, res) => {
  const { input, language = 'en' } = req.body;

  if (!input || typeof input !== 'string') {
    return res.status(400).json({ error: 'Input text is required' });
  }

  // If AI client is available, call Gemini
  if (aiClient) {
    try {
      const systemInstruction = `You are CareConnect's AI medical triage assistant for Visakhapatnam (Vizag), India.
Analyze the user's symptoms described in English, Telugu (తెలుగు), or Hindi (हिंदी).
Map the condition to exactly ONE primary medical specialty from this exact list:
- General Medicine
- Cardiology
- Neurology
- Orthopaedics
- Paediatrics
- Obstetrics & Gynaecology
- Pulmonology
- Dermatology
- Ophthalmology
- ENT
- Gastroenterology
- Nephrology / Urology
- Dental Surgery

Determine the urgency level:
- "Emergency": life-threatening (e.g. chest pain, heart attack symptoms, severe difficulty breathing, stroke signs, massive bleeding, unconsciousness, severe trauma).
- "Urgent": high discomfort or worsening acute illness requiring prompt attention within 24-48 hours (e.g. high fever >102°F, intense abdominal pain, persistent vomiting, fracture, severe eye pain).
- "Routine": manageable non-critical issues (e.g. mild cold, skin rash, dental checkup, routine joint ache, general checkup).

Provide:
1. specialty (string from the list above)
2. urgency ("Emergency" | "Urgent" | "Routine")
3. symptoms (array of detected symptom strings)
4. explanation (a gentle, empathetic 1-2 sentence explanation in the user's selected language: ${language === 'te' ? 'Telugu' : language === 'hi' ? 'Hindi' : 'English'})
5. followUpQuestion (an optional 1-sentence clarifying question in the user's selected language)`;

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Gemini request timed out')), 6000)
      );

      const geminiPromise = aiClient.models.generateContent({
        model: GEMINI_MODEL,
        contents: input,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              specialty: { type: Type.STRING },
              urgency: { type: Type.STRING },
              symptoms: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              explanation: { type: Type.STRING },
              followUpQuestion: { type: Type.STRING },
            },
            required: ['specialty', 'urgency', 'symptoms', 'explanation'],
          },
        },
      });

      const response: any = await Promise.race([geminiPromise, timeoutPromise]);
      const parsed = JSON.parse(response.text || '{}');
      return res.json({
        success: true,
        source: 'gemini',
        result: parsed,
      });
    } catch (err: any) {
      console.warn('Gemini triage failed, server using offline rules engine:', err?.message || err);
      const fallbackResult = evaluateOfflineRules(input, language);
      return res.json({
        success: true,
        source: 'rules',
        result: fallbackResult,
      });
    }
  }

  // If no Gemini API key configured
  const fallbackResult = evaluateOfflineRules(input, language);
  return res.json({
    success: true,
    source: 'rules',
    result: fallbackResult,
  });
});

// 2. WhatsApp send endpoint
app.post('/api/whatsapp/send', async (req, res) => {
  const { phone, message, templateData } = req.body;
  const realMode = process.env.VITE_WHATSAPP_REAL === 'true';

  if (!phone || !message) {
    return res.status(400).json({ error: 'Phone and message are required' });
  }

  if (realMode) {
    // If real WhatsApp Cloud API or Twilio credentials are set in server environment
    const metaToken = process.env.WHATSAPP_TOKEN;
    const phoneId = process.env.WHATSAPP_PHONE_ID;
    if (metaToken && phoneId) {
      try {
        const metaRes = await fetch(`https://graph.facebook.com/v20.0/${phoneId}/messages`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${metaToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: phone.replace(/[^0-9]/g, ''),
            type: 'text',
            text: { body: message },
          }),
        });
        const metaData = await metaRes.json();
        return res.json({ success: true, mode: 'real', metaData });
      } catch (err: any) {
        console.error('Real WhatsApp send failed, falling back to simulated:', err);
      }
    }
  }

  // Default simulated mode
  return res.json({
    success: true,
    mode: 'simulated',
    timestamp: new Date().toISOString(),
    recipient: phone,
    delivered: true,
  });
});

// Vite or Static file serving
async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`CareConnect server running on port ${port} [env: ${process.env.NODE_ENV || 'development'}]`);
  });
}

startServer();
