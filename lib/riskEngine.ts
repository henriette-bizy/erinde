export interface SymptomInput {
  symptoms: string[];
  severity: string;
  duration: string;
  age: string;
}

export interface RiskResult {
  level: "low" | "moderate" | "high";
  score: number;
  recommendations: string[];
  factors: string[];
  emergency: boolean;
}

const EMERGENCY_SYMPTOMS = [
  "chest pain",
  "difficulty breathing",
  "severe bleeding",
  "loss of consciousness",
  "severe allergic reaction",
];

const SYMPTOM_WEIGHTS: Record<string, number> = {
  "fever": 2,
  "cough": 1,
  "headache": 1,
  "fatigue": 1,
  "body ache": 1,
  "sore throat": 1,
  "diarrhea": 2,
  "vomiting": 2,
  "rash": 1,
  "dizziness": 2,
  "chest pain": 5,
  "difficulty breathing": 5,
  "severe bleeding": 5,
  "loss of consciousness": 5,
  "severe allergic reaction": 5,
  "abdominal pain": 2,
  "swollen limbs": 2,
  "vision problems": 3,
};

export const analyzeRisk = (input: SymptomInput): RiskResult => {
  let score = 0;
  const factors: string[] = [];

  // Emergency check
  const emergency = input.symptoms.some((s) =>
    EMERGENCY_SYMPTOMS.includes(s.toLowerCase())
  );
  if (emergency) {
    return {
      level: "high",
      score: 100,
      emergency: true,
      factors: ["Emergency symptom detected"],
      recommendations: [
        "⚠️ SEEK EMERGENCY MEDICAL CARE IMMEDIATELY",
        "Call emergency services: 912 (Rwanda)",
        "Do NOT drive yourself — call for help",
        "Stay calm and remain seated until help arrives",
      ],
    };
  }

  // Symptom weight
  input.symptoms.forEach((s) => {
    const w = SYMPTOM_WEIGHTS[s.toLowerCase()] || 1;
    score += w;
    factors.push(`${s} detected`);
  });

  // Severity
  if (input.severity === "severe") { score += 4; factors.push("Severe symptom intensity"); }
  else if (input.severity === "moderate") { score += 2; factors.push("Moderate symptom intensity"); }

  // Duration
  if (input.duration === "more_than_week") { score += 4; factors.push("Symptoms lasting more than a week"); }
  else if (input.duration === "4_7_days") { score += 3; factors.push("Symptoms lasting 4-7 days"); }
  else if (input.duration === "1_3_days") { score += 1; factors.push("Symptoms lasting 1-3 days"); }

  // Age risk
  const age = parseInt(input.age) || 30;
  if (age > 60 || age < 5) { score += 2; factors.push("Age-related risk factor"); }

  // Determine level
  let level: "low" | "moderate" | "high";
  let recommendations: string[];

  if (score >= 10) {
    level = "high";
    recommendations = [
      "Visit a health center or clinic URGENTLY (within 24 hours)",
      "Do not delay seeking professional medical attention",
      "If symptoms worsen rapidly, call emergency services: 912",
      "Keep a record of your symptoms to show the doctor",
      "Avoid strenuous activity until assessed by a healthcare professional",
    ];
  } else if (score >= 5) {
    level = "moderate";
    recommendations = [
      "Schedule a clinic visit within the next 2-3 days",
      "Monitor your symptoms closely for any worsening",
      "Stay hydrated and get adequate rest",
      "Take over-the-counter medication for symptom relief if appropriate",
      "Return for another assessment if symptoms worsen",
    ];
  } else {
    level = "low";
    recommendations = [
      "Rest and stay well hydrated",
      "Monitor your symptoms over the next 24-48 hours",
      "Maintain a balanced diet and avoid stress",
      "Use over-the-counter remedies for mild relief if needed",
      "Reassess if symptoms persist beyond 3 days or worsen",
    ];
  }

  return { level, score, emergency: false, factors, recommendations };
};
