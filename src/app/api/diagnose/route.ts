import { NextRequest, NextResponse } from "next/server";
import {
  systemPrompt,
  buildDiagnosticPrompt,
  sanitizeAIResponse,
  validateJSONResponse,
} from "@/lib/aiPrompt";
import { getSafetyWarning } from "@/lib/safety";
import { DiagnosticRequest } from "@/types/diagnostic";

export async function POST(req: NextRequest) {
  try {
    const body: DiagnosticRequest = await req.json();
    const { description, vehicleId, imageBase64 } = body;

    if (!description || !vehicleId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get API key from environment
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("OPENAI_API_KEY not configured");
      return NextResponse.json(
        {
          error: "AI service not configured",
          diagnostic: {
            id: crypto.randomUUID(),
            severity: "escalate",
            diagnosis: "AI diagnostic service is not available",
            recommendation:
              "Please consult a professional mechanic for diagnosis",
            diySteps: null,
            repairShopNeeded: true,
            timestamp: Date.now(),
          },
        },
        { status: 503 }
      );
    }

    // Build the diagnostic prompt
    const vehicleInfo = `Vehicle ID: ${vehicleId}`;
    const imageContext = imageBase64
      ? "User has provided an image of the issue"
      : undefined;
    const userPrompt = buildDiagnosticPrompt(
      vehicleInfo,
      description,
      imageContext
    );

    // Call OpenAI API
    const messages: any[] = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ];

    // If image is provided, add it to the message
    if (imageBase64) {
      messages.push({
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: {
              url: imageBase64,
            },
          },
        ],
      });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: imageBase64 ? "gpt-4o" : "gpt-4o-mini",
        messages,
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("OpenAI API error:", error);
      throw new Error("AI service unavailable");
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || "";

    // Sanitize and validate the response
    const cleanedResponse = sanitizeAIResponse(aiResponse);
    const validation = validateJSONResponse(cleanedResponse);

    if (!validation.valid) {
      console.error("Invalid AI response:", validation.error);
      return NextResponse.json(
        {
          error: "Invalid AI response",
          diagnostic: {
            id: crypto.randomUUID(),
            severity: "escalate",
            diagnosis: "Unable to process diagnostic request",
            recommendation: "Please consult a professional mechanic",
            diySteps: null,
            repairShopNeeded: true,
            timestamp: Date.now(),
          },
        },
        { status: 500 }
      );
    }

    // Add safety warning to response
    const diagnostic = {
      ...validation.data,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };

    return NextResponse.json({
      diagnostic,
      safetyWarning: getSafetyWarning(),
    });
  } catch (error) {
    console.error("Diagnostic error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        diagnostic: {
          id: crypto.randomUUID(),
          severity: "escalate",
          diagnosis: "An error occurred during diagnosis",
          recommendation: "Please consult a professional mechanic",
          diySteps: null,
          repairShopNeeded: true,
          timestamp: Date.now(),
        },
      },
      { status: 500 }
    );
  }
}
