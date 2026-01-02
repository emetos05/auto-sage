/**
 * Safety Guardrails for Auto-Sage
 * Non-Negotiable: Prevents unsafe DIY advice for critical systems
 */

// Topics that should NEVER receive DIY advice
const UNSAFE_TOPICS = [
  "brake",
  "airbag",
  "srs",
  "fuel",
  "petrol",
  "diesel",
  "steering",
  "high voltage",
  "hv battery",
  "electric battery",
  "ev battery",
  "hybrid battery",
  "power steering",
  "abs",
  "seat belt",
  "safety system",
];

// Topics that require professional escalation
const ESCALATION_KEYWORDS = [
  "airbag",
  "brake fluid",
  "brake system",
  "fuel system",
  "fuel pump",
  "fuel filter",
  "transmission",
  "engine",
  "crankshaft",
  "camshaft",
  "timing chain",
  "timing belt",
  "head gasket",
  "water pump",
  "radiator",
  "coolant system",
  "high voltage",
  "ev battery",
  "hybrid battery",
  "electric motor",
  "suspension",
  "alignment",
  "driveshaft",
  "differential",
];

export function isSafeDiagnosis(description: string): {
  safe: boolean;
  reason?: string;
} {
  const lowerDesc = description.toLowerCase();

  // Check for unsafe topics
  for (const unsafe of UNSAFE_TOPICS) {
    if (lowerDesc.includes(unsafe)) {
      return {
        safe: false,
        reason: `The issue involves ${unsafe} systems, which require professional inspection.`,
      };
    }
  }

  return { safe: true };
}

export function shouldEscalateToShop(description: string): boolean {
  const lowerDesc = description.toLowerCase();
  return ESCALATION_KEYWORDS.some((keyword) => lowerDesc.includes(keyword));
}

export function getSafetyWarning(): string {
  return `⚠️ This app is for informational purposes only. For safety-critical systems (brakes, airbags, steering, fuel, high-voltage batteries), always consult a professional mechanic. Never attempt repairs if unsure.`;
}

export function isValidDIYTask(category: string): boolean {
  const validDIYCategories = [
    "battery",
    "wiper blade",
    "air filter",
    "cabin filter",
    "light bulb",
    "fuse",
    "fluid level check",
    "tire pressure",
    "tire rotation",
    "windshield",
    "washer fluid",
    "battery terminal",
  ];

  const lowerCategory = category.toLowerCase();
  return validDIYCategories.some((cat) => lowerCategory.includes(cat));
}
