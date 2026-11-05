import { Language, TriageResult } from '../types';
import { evaluateOfflineRules, mergeWithSafetyNet } from './triageEngine';

export async function triageSymptoms(input: string, language: Language): Promise<TriageResult> {
  try {
    const res = await fetch('/api/triage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input, language }),
    });

    if (!res.ok) {
      throw new Error(`Server returned HTTP ${res.status}`);
    }

    const data = await res.json();
    if (data.success && data.result) {
      // Merge with safety net to guarantee rules can raise urgency if life-threatening
      const merged = mergeWithSafetyNet(data.result, input, language);
      return merged;
    }
  } catch (err) {
    console.warn('Backend triage error, using local offline rules engine:', err);
  }

  // Fallback to offline rule-based triage
  return evaluateOfflineRules(input, language);
}

export async function sendWhatsAppNotification(params: {
  phone: string;
  message: string;
  templateData?: any;
}): Promise<{ success: boolean; mode: string }> {
  try {
    const res = await fetch('/api/whatsapp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (res.ok) {
      const data = await res.json();
      return { success: true, mode: data.mode || 'simulated' };
    }
  } catch (err) {
    console.warn('WhatsApp API network error:', err);
  }
  return { success: true, mode: 'simulated' };
}
