import { isSafeDiagnosis, shouldEscalateToShop } from "./safety";

export const systemPrompt = `You are Auto Sage, an AI diagnostic assistant for car maintenance. Your role is to help users understand basic car issues safely.

CRITICAL RULES:
1. You ONLY return valid JSON responses. Never use markdown, explanations, or plain text.
2. You MUST flag unsafe topics for professional escalation (brakes, airbags, fuel, steering, HV/EV systems).
3. For safe DIY tasks (wipers, air filters, battery, lights, fluids), provide clear steps.
4. Always encourage professional consultation for complex issues.
5. Never provide medical advice or non-automotive guidance.

Return JSON ONLY in this exact format:
{
  "severity": "safe|caution|urgent|escalate",
  "diagnosis": "What the issue likely is",
  "recommendation": "What to do about it",
  "diySteps": ["Step 1", "Step 2"] or null,
  "repairShopNeeded": true|false,
  "reason": "Why escalation if needed"
}

severity levels:
- safe: DIY-friendly, low risk
- caution: Monitor situation, preventive maintenance
- urgent: Fix soon, but not emergency
- escalate: Professional help required immediately

If the issue is unsafe or unknown, use escalate.`;

export function buildDiagnosticPrompt(
  vehicleInfo: string,
  userDescription: string,
  imageContext?: string
): string {
  const safetyCheck = isSafeDiagnosis(userDescription);

  if (!safetyCheck.safe) {
    return `Vehicle: ${vehicleInfo}
User Issue: ${userDescription}

SAFETY ALERT: This issue requires professional inspection. Do not attempt DIY repairs.
Respond with ONLY this JSON:
{
  "severity": "escalate",
  "diagnosis": "${safetyCheck.reason}",
  "recommendation": "Please visit a certified mechanic immediately. Do not attempt repairs.",
  "diySteps": null,
  "repairShopNeeded": true,
  "reason": "Safety-critical system requiring professional expertise"
}`;
  }

  const shouldEscalate = shouldEscalateToShop(userDescription);
  const prompt = `Vehicle: ${vehicleInfo}
User Description: ${userDescription}
${imageContext ? `\nImage Context: ${imageContext}` : ""}

Provide a structured JSON diagnosis. ${
    shouldEscalate
      ? "This issue likely requires a professional repair shop."
      : "If safe, provide DIY steps."
  }

Respond with ONLY valid JSON, no additional text.`;

  return prompt;
}

export function validateJSONResponse(response: string): {
  valid: boolean;
  data?: Record<string, unknown>;
  error?: string;
} {
  try {
    const data = JSON.parse(response);

    // Validate required fields
    const required = [
      "severity",
      "diagnosis",
      "recommendation",
      "repairShopNeeded",
    ];
    const missing = required.filter((field) => !(field in data));

    if (missing.length > 0) {
      return {
        valid: false,
        error: `Missing required fields: ${missing.join(", ")}`,
      };
    }

    // Validate severity enum
    if (!["safe", "caution", "urgent", "escalate"].includes(data.severity)) {
      return {
        valid: false,
        error: `Invalid severity: ${data.severity}`,
      };
    }

    return { valid: true, data };
  } catch (error) {
    return {
      valid: false,
      error: `Invalid JSON: ${(error as Error).message}`,
    };
  }
}

export function sanitizeAIResponse(response: string): string {
  // Remove markdown code blocks if present
  let cleaned = response.replace(/```json\n?/g, "").replace(/```\n?/g, "");

  // Extract JSON if wrapped in text
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    cleaned = jsonMatch[0];
  }

  return cleaned.trim();
}
