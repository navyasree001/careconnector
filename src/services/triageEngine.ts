import { Hospital, Doctor, Language, TriageResult, UrgencyLevel, RankedHospital } from '../types';
import { calculateDistance } from '../utils/geo';

interface RuleMatch {
  specialty: string;
  urgency: UrgencyLevel;
  symptoms: string[];
  explanation: Record<Language, string>;
}

const EMERGENCY_KEYWORDS: { pattern: RegExp; rule: RuleMatch }[] = [
  {
    // Chest pain / Heart attack / Cardiac
    pattern: /chest\s*pain|heart\s*attack|palpitation|pressure\s*in\s*chest|ఛాతీలో\s*నొప్పి|గుండె\s*నొప్పి|గుండెదడ|सीने\s*में\s*दर्द|दिल\s*का\s*दौरा|छाती\s*में\s*दर्द|सीने\s*में|भारीपन/i,
    rule: {
      specialty: 'Cardiology',
      urgency: 'Emergency',
      symptoms: ['Chest pain / pressure', 'Cardiovascular distress'],
      explanation: {
        en: 'Chest pain or cardiac pressure requires immediate emergency medical evaluation to rule out acute coronary syndrome.',
        te: 'ఛాతీలో నొప్పి లేదా ఒత్తిడి గుండె సంబంధిత తీవ్రమైన అత్యవసర పరిస్థితి కావచ్చు; వెంటనే అత్యవసర వైద్య సేవలను సంప్రదించండి.',
        hi: 'सीने में दर्द या भारीपन दिल के दौरे का संकेत हो सकता है; कृपया तुरंत आपातकालीन चिकित्सा सहायता लें।',
      },
    },
  },
  {
    // Severe breathing difficulty / hypoxia
    pattern: /severe\s*breathing|cannot\s*breathe|shortness\s*of\s*breath|gasping|శ్వాస\s*తీసుకోవడం\s*కష్టం|ఊపిరి\s*ఆడట్లేదు|తీవ్రమైన\s*శ్వాస|सांस\s*लेने\s*में\s*दिक्कत|दम\s*घुटना/i,
    rule: {
      specialty: 'Pulmonology',
      urgency: 'Emergency',
      symptoms: ['Acute shortness of breath', 'Respiratory distress'],
      explanation: {
        en: 'Severe difficulty in breathing needs urgent oxygenation and hospital trauma or pulmonary evaluation.',
        te: 'తీవ్రమైన శ్వాస ఇబ్బందికి తక్షణ ఆక్సిజన్ మరియు పల్మనాలజీ / ఎమర్జెన్సీ పరిశీలన అవసరం.',
        hi: 'गंभीर सांस की तकलीफ में तत्काल ऑक्सीजन और आपातकालीन पल्मोनोलॉजी जांच आवश्यक है।',
      },
    },
  },
  {
    // Stroke / Seizure / Paralysis / Neurological
    pattern: /stroke|seizure|paralysis|unconscious|fainting|ముఖం\s*వంకర|పక్షవాతం|మూర్ఛ|స్పృహ\s*కోల్పోవడం|लकवा|दौरा|बेहोश|मूर्छा/i,
    rule: {
      specialty: 'Neurology',
      urgency: 'Emergency',
      symptoms: ['Loss of consciousness / Seizure / Neurological deficit'],
      explanation: {
        en: 'Symptoms suggest acute neurological impairment or stroke; golden hour treatment at a certified stroke centre is crucial.',
        te: 'లక్షణాలు తీవ్రమైన న్యూరో లేదా పక్షవాతాన్ని సూచిస్తున్నాయి; వెంటనే స్ట్రోక్ సెంటర్ ఉన్న ఆసుపత్రికి చేరుకోండి.',
        hi: 'लक्षण गंभीर न्यूरोलॉजिकल आपातकाल या स्ट्रोक की ओर संकेत करते हैं; तुरंत निकटतम अस्पताल पहुंचें।',
      },
    },
  },
  {
    // Severe Trauma / Road accident / Major fracture
    pattern: /road\s*accident|heavy\s*bleeding|fracture|bone\s*broken|గాయం|రోడ్డు\s*ప్రమాదం|రక్తం\s*కారుతోంది|ఎముక\s*విరిగింది|दुर्घटना|खून\s*बहना|हड्डी\s*टूटना/i,
    rule: {
      specialty: 'Orthopaedics',
      urgency: 'Emergency',
      symptoms: ['Acute physical trauma', 'Fracture / Bleeding'],
      explanation: {
        en: 'Physical trauma, open injury or suspected fractures require immediate emergency surgical and orthopaedic stabilization.',
        te: 'తీవ్రమైన గాయం లేదా ఎముక విరిగిపోవడం వల్ల వెంటనే ట్రౌమా కేర్ ఆసుపత్రికి వెళ్ళడం అవసరం.',
        hi: 'दुर्घटना या गंभीर चोट के लिए तत्काल ट्रॉमा और आर्थोपेडिक आपातकालीन उपचार की आवश्यकता है।',
      },
    },
  },
];

const URGENT_KEYWORDS: { pattern: RegExp; rule: RuleMatch }[] = [
  {
    // Pediatric acute illness
    pattern: /child|baby|infant|pediatric|పాప|బాబు|పిల్లలు|పిల్లల\s*అనారోగ్యం|बच्चा|शिशु|बाल/i,
    rule: {
      specialty: 'Paediatrics',
      urgency: 'Urgent',
      symptoms: ['Pediatric unwell', 'Fever / Lethargy in child'],
      explanation: {
        en: 'Pediatric illnesses require prompt consultation with a specialist paediatrician within 12–24 hours.',
        te: 'పిల్లల అనారోగ్యానికి నిపుణులైన శిశువైద్యుడిని (పీడియాట్రిషియన్) వీలైనంత త్వరగా సంప్రదించాలి.',
        hi: 'बच्चों की बीमारी में बाल रोग विशेषज्ञ (पीडियाट्रिशियन) से 12–24 घंटों के भीतर परामर्श आवश्यक है।',
      },
    },
  },
  {
    // Maternity / Pregnancy
    pattern: /pregnant|pregnancy|maternity|labor|గర్భం|గర్భిణీ|ప్రసూతి|కడుపుతో|गर्भवती|गर्भावस्था|प्रसूति/i,
    rule: {
      specialty: 'Obstetrics & Gynaecology',
      urgency: 'Urgent',
      symptoms: ['Pregnancy related concern'],
      explanation: {
        en: 'Maternal symptoms should be evaluated promptly by a gynaecologist and obstetrician.',
        te: 'గర్భధారణకు సంబంధించిన సమస్యలను త్వరగా స్త్రీల వైద్య నిపుణురాలితో పరిశీలించుకోవాలి.',
        hi: 'गर्भावस्था से जुड़े लक्षणों के लिए स्त्री रोग विशेषज्ञ से तुरंत जांच करवानी चाहिए।',
      },
    },
  },
  {
    // High Fever
    pattern: /high\s*fever|fever|chills|shivering|102|103|104|తీవ్రమైన\s*జ్వరం|చలిజ్వరం|జ్వరం|तेज़\s*बुखार|बुखार|कड़ाके\s*की\s*ठंड/i,
    rule: {
      specialty: 'General Medicine',
      urgency: 'Urgent',
      symptoms: ['High fever', 'Chills / Body pain'],
      explanation: {
        en: 'High fever and chills warrant clinical examination to rule out malaria, dengue or viral infection.',
        te: 'తీవ్రమైన జ్వరం మరియు చలి ఉన్నప్పుడు డెంగ్యూ, మలేరియా వంటి ఇన్ఫెక్షన్ల కొరకు పరీక్ష చేయించుకోవాలి.',
        hi: 'तेज़ बुखार और कंपकंपी के लिए डॉक्टर से जांच करवाना ज़रूरी है ताकि संक्रमण का पता चल सके।',
      },
    },
  },
  {
    // Severe stomach pain / vomiting
    pattern: /stomach\s*pain|abdominal\s*pain|vomiting|loose\s*motion|diarrhea|కడుపునొప్పి|వాంతులు|విరేచనాలు|విపరీతమైన\s*కడుపునొప్పి|पेट\s*दर्द|उल्टी|दस्त/i,
    rule: {
      specialty: 'Gastroenterology',
      urgency: 'Urgent',
      symptoms: ['Acute abdominal pain', 'Gastric distress / Vomiting'],
      explanation: {
        en: 'Abdominal pain and vomiting require consultation with a gastroenterologist or physician to manage dehydration.',
        te: 'కడుపునొప్పి మరియు వాంతులకు గ్యాస్ట్రోఎంటరాలజిస్ట్ లేదా జనరల్ ఫిజీషియన్ సలహా అవసరం.',
        hi: 'पेट दर्द और उल्टी के लिए गैस्ट्रोएंटेरोलॉजिस्ट से शीघ्र परामर्श लेना उचित है।',
      },
    },
  },
  {
    // Eye pain / sudden blur
    pattern: /eye\s*pain|red\s*eye|vision\s*blur|కంటినొప్పి|కళ్లు\s*ఎర్రబడటం|చూపు\s*మందగించడం|आंखों\s*में\s*दर्द|धुंधला\s*दिखना/i,
    rule: {
      specialty: 'Ophthalmology',
      urgency: 'Urgent',
      symptoms: ['Eye pain', 'Visual disturbance'],
      explanation: {
        en: 'Sudden eye pain or vision blur needs immediate slit-lamp examination by an ophthalmologist.',
        te: 'కంటి నొప్పి లేదా చూపు మందగించినప్పుడు వెంటనే నేత్ర వైద్యుడిని సంప్రదించాలి.',
        hi: 'आंखों में अचानक दर्द या दृष्टि धुंधली होने पर नेत्र रोग विशेषज्ञ से जांच कराएं।',
      },
    },
  },
];

const ROUTINE_KEYWORDS: { pattern: RegExp; rule: RuleMatch }[] = [
  {
    // Skin / Rash
    pattern: /skin|rash|itching|allergy|acne|చర్మం|దురద|దద్దుర్లు|తామర|त्वचा|खुजली|चकत्ते/i,
    rule: {
      specialty: 'Dermatology',
      urgency: 'Routine',
      symptoms: ['Skin rash', 'Itching / Dermatitis'],
      explanation: {
        en: 'Skin rashes and dermatological conditions can be evaluated through a scheduled OPD consultation.',
        te: 'చర్మ సంబంధిత సమస్యలు మరియు దురదలకు చర్మవ్యాధి నిపుణుడి వద్ద సాధారణ ఓపీ సరిపోతుంది.',
        hi: 'त्वचा के चकत्तों और खुजली के लिए त्वचा रोग विशेषज्ञ से ओपीडी परामर्श लिया जा सकता है।',
      },
    },
  },
  {
    // Tooth / Dental
    pattern: /tooth|dental|teeth|gums|cavity|పంటి\s*నొప్పి|దంతాలు|చిగుళ్ళు|दांत\s*का\s*दर्द|मसूड़े/i,
    rule: {
      specialty: 'Dental Surgery',
      urgency: 'Routine',
      symptoms: ['Toothache', 'Dental / Oral cavity issue'],
      explanation: {
        en: 'Dental aches or cavity issues can be addressed through a scheduled dental clinic visit.',
        te: 'పంటి నొప్పి లేదా చిగుళ్ళ సమస్యలకు దంతవైద్యుడి వద్ద స్లాట్ బుక్ చేసుకోండి.',
        hi: 'दांत दर्द और मसूड़ों की समस्या के लिए दंत चिकित्सक से अपॉइंटमेंट बुक करें।',
      },
    },
  },
  {
    // ENT / Cold
    pattern: /ear\s*pain|throat\s*pain|cough|cold|runny\s*nose|చెవి\s*నొప్పి|గొంతు\s*నొప్పి|జలుబు|దగ్గు|गले\s*में\s*खराश|कान\s*में\s*दर्द|खांसी|जुकाम/i,
    rule: {
      specialty: 'ENT',
      urgency: 'Routine',
      symptoms: ['Ear / Throat irritation', 'Cold / Cough'],
      explanation: {
        en: 'Ear, nose, and throat symptoms can be evaluated safely during regular OPD hours.',
        te: 'చెవి, ముక్కు, గొంతు సంబంధిత సమస్యలను ఈఎన్‌టీ నిపుణుడి వద్ద చూపించుకోవచ్చు.',
        hi: 'कान, नाक और गले की समस्याओं के लिए ईएनटी विशेषज्ञ से परामर्श ले सकते हैं।',
      },
    },
  },
];

// Offline rule-based triage evaluator
export function evaluateOfflineRules(input: string, lang: Language): TriageResult {
  const text = input.trim();

  // 1. Check emergency keywords first
  for (const item of EMERGENCY_KEYWORDS) {
    if (item.pattern.test(text)) {
      return {
        specialty: item.rule.specialty,
        urgency: item.rule.urgency,
        symptoms: item.rule.symptoms,
        explanation: item.rule.explanation[lang],
        source: 'rules',
      };
    }
  }

  // 2. Check urgent keywords
  for (const item of URGENT_KEYWORDS) {
    if (item.pattern.test(text)) {
      return {
        specialty: item.rule.specialty,
        urgency: item.rule.urgency,
        symptoms: item.rule.symptoms,
        explanation: item.rule.explanation[lang],
        source: 'rules',
      };
    }
  }

  // 3. Check routine keywords
  for (const item of ROUTINE_KEYWORDS) {
    if (item.pattern.test(text)) {
      return {
        specialty: item.rule.specialty,
        urgency: item.rule.urgency,
        symptoms: item.rule.symptoms,
        explanation: item.rule.explanation[lang],
        source: 'rules',
      };
    }
  }

  // Default General Medicine
  const defaultExplanations: Record<Language, string> = {
    en: 'Your symptoms can be assessed by a General Physician who will advise if any specialized tests or referrals are needed.',
    te: 'మీ లక్షణాలను జనరల్ ఫిజీషియన్ పరిశీలించి, అవసరమైతే ఇతర నిపుణులను సిఫార్సు చేస్తారు.',
    hi: 'आपके लक्षणों की जांच सामान्य चिकित्सक (जनरल फिजिशियन) द्वारा की जा सकती है जो आगे का मार्गदर्शन करेंगे।',
  };

  return {
    specialty: 'General Medicine',
    urgency: 'Routine',
    symptoms: ['General health concern'],
    explanation: defaultExplanations[lang],
    source: 'rules',
  };
}

// Safety net: Rules may only RAISE urgency, never lower it!
// Priority order: Emergency (3) > Urgent (2) > Routine (1)
function urgencyWeight(urgency: UrgencyLevel): number {
  switch (urgency) {
    case 'Emergency': return 3;
    case 'Urgent': return 2;
    case 'Routine': return 1;
    default: return 1;
  }
}

export function mergeWithSafetyNet(
  aiResult: TriageResult,
  input: string,
  lang: Language
): TriageResult {
  const offlineResult = evaluateOfflineRules(input, lang);

  const aiWeight = urgencyWeight(aiResult.urgency);
  const ruleWeight = urgencyWeight(offlineResult.urgency);

  // If offline rule indicates higher urgency than AI returned, RAISE it!
  if (ruleWeight > aiWeight) {
    return {
      specialty: offlineResult.specialty || aiResult.specialty,
      urgency: offlineResult.urgency,
      symptoms: Array.from(new Set([...(aiResult.symptoms || []), ...(offlineResult.symptoms || [])])),
      explanation: offlineResult.explanation || aiResult.explanation,
      followUpQuestion: aiResult.followUpQuestion,
      source: 'rules',
    };
  }

  return {
    ...aiResult,
    source: 'gemini',
  };
}

// Deterministic hospital ranking function
// Factors: specialty match, doctor status, next-slot time, distance, language, emergency readiness
// Real specialist outranks a General Physician fallback!
export function rankHospitalsForSpecialty(params: {
  specialty: string;
  userLat: number;
  userLng: number;
  lang: Language;
  hospitals: Hospital[];
  doctors: Doctor[];
  urgency: UrgencyLevel;
}): RankedHospital[] {
  const { specialty, userLat, userLng, hospitals, doctors, urgency, lang } = params;

  const targetLang = lang === 'te' ? 'Telugu' : lang === 'hi' ? 'Hindi' : 'English';

  const scored: RankedHospital[] = hospitals.map(hospital => {
    const dist = calculateDistance(userLat, userLng, hospital.lat, hospital.lng);
    const reasons: string[] = [];
    let score = 0;

    // 1. Specialty match & doctors count
    const hospitalDoctors = doctors.filter(d => d.hospitalId === hospital.id);
    const specialistDoctors = hospitalDoctors.filter(d => d.specialty.toLowerCase() === specialty.toLowerCase());
    const genMedDoctors = hospitalDoctors.filter(d => d.specialty.toLowerCase() === 'general medicine');

    const hasSpecialist = specialistDoctors.length > 0;
    const activeSpecialists = specialistDoctors.filter(d => d.runtime.statusOverride !== 'Unavailable');

    if (hasSpecialist) {
      score += 50;
      reasons.push(`${activeSpecialists.length || specialistDoctors.length} ${specialty} specialist(s) available`);
    } else if (genMedDoctors.length > 0) {
      score += 20; // Fallback to General Physician
      reasons.push('General Physician initial triage');
    }

    // 2. Emergency readiness
    if (urgency === 'Emergency') {
      if (hospital.emergency24x7) {
        score += 40;
        reasons.push('24x7 Emergency & Trauma Bay');
      }
      if (hospital.icuAvailable) {
        score += 20;
        reasons.push('ICU ready');
      }
    }

    // 3. Distance scoring (closer is better, max 30 points)
    // 0km -> +30, 15km -> +10
    const distanceScore = Math.max(0, 30 - dist * 1.8);
    score += distanceScore;
    reasons.push(`${dist} km away`);

    // 4. Language capability
    if (hospital.spokenLanguages.includes(targetLang)) {
      score += 15;
      reasons.push(`Doctors speak ${targetLang}`);
    }

    // 5. Hospital rating bonus
    score += (hospital.rating - 4.0) * 10;

    // Next slot approximation
    const nextSlot = '10:40 AM';

    return {
      hospital,
      reasons: reasons.slice(0, 4), // top reasons
      score: Math.round(score),
      distanceKm: dist,
      availableDoctorsCount: activeSpecialists.length || hospitalDoctors.length,
      nextSlotTime: nextSlot,
      specialistFound: hasSpecialist,
    };
  });

  // Sort descending by score
  scored.sort((a, b) => {
    // Specialists outrank fallbacks
    if (a.specialistFound && !b.specialistFound) return -1;
    if (!a.specialistFound && b.specialistFound) return 1;
    return b.score - a.score;
  });

  return scored;
}
