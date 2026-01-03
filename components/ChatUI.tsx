"use client";

import { useState, useRef, useEffect } from "react";
import { ChatMessage, DiagnosticResponse, Vehicle } from "@/types/diagnostic";
import DiagnosticCard from "./DiagnosticCard";
import PhotoUpload from "./PhotoUpload";
import { v4 as uuidv4 } from "uuid";

interface ChatUIProps {
  vehicle: Vehicle;
  sessionId: string;
  onFindShops: (diagnostic: DiagnosticResponse) => void;
}

export default function ChatUI({
  vehicle,
  sessionId,
  onFindShops,
}: ChatUIProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial greeting
    const greeting: ChatMessage = {
      id: uuidv4(),
      role: "assistant",
      content: `Hi! I'm Auto Sage. I'm here to help you diagnose issues with your ${vehicle.year} ${vehicle.make} ${vehicle.model}. What's going on with your vehicle?`,
      timestamp: Date.now(),
    };
    setMessages([greeting]);
  }, [vehicle]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: "user",
      content: input + (photoBase64 ? " [Photo attached]" : ""),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    const currentPhoto = photoBase64;
    setInput("");
    setPhotoBase64(null);
    setShowPhotoUpload(false);
    setIsLoading(true);

    try {
      // Call the real API
      const response = await fetch("/api/diagnose", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: currentInput,
          vehicleId: vehicle.id,
          imageBase64: currentPhoto,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || "Failed to get diagnosis");
      }

      const assistantMessage: ChatMessage = {
        id: uuidv4(),
        role: "assistant",
        content: "Here is what I found:",
        diagnostic: data.diagnostic,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Diagnosis error:", error);

      // Fallback to mock response if API fails
      const mockDiagnostic = generateMockDiagnostic(currentInput);
      const assistantMessage: ChatMessage = {
        id: uuidv4(),
        role: "assistant",
        content: "AI service unavailable. Here is a basic assessment:",
        diagnostic: mockDiagnostic,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoCapture = (base64: string) => {
    setPhotoBase64(base64);
  };

  const generateMockDiagnostic = (userInput: string): DiagnosticResponse => {
    const lowerInput = userInput.toLowerCase();

    // Check for unsafe topics
    const unsafeKeywords = [
      "brake",
      "airbag",
      "fuel",
      "steering",
      "high voltage",
    ];
    if (unsafeKeywords.some((keyword) => lowerInput.includes(keyword))) {
      return {
        id: uuidv4(),
        severity: "escalate",
        diagnosis:
          "This issue involves a safety-critical system that requires professional inspection.",
        recommendation:
          "Please visit a certified mechanic immediately. Do not attempt repairs on brakes, airbags, fuel systems, steering, or high-voltage systems.",
        diySteps: undefined,
        repairShopNeeded: true,
        timestamp: Date.now(),
      };
    }

    // Check for battery issues
    if (lowerInput.includes("battery") || lowerInput.includes("start")) {
      return {
        id: uuidv4(),
        severity: "caution",
        diagnosis:
          "Your battery may be weak or the terminals may be corroded. A weak battery can prevent your car from starting.",
        recommendation:
          "Check battery terminals for corrosion. If the issue persists, have the battery tested at an auto parts store (usually free).",
        diySteps: [
          "Park on a level surface and turn off the engine",
          "Open the hood and locate the battery",
          "Inspect terminals for white/blue corrosion",
          "If corroded, clean with baking soda and water",
          "Ensure connections are tight",
          "If car still will not start, battery may need replacement",
        ],
        repairShopNeeded: false,
        timestamp: Date.now(),
      };
    }

    // Check for oil-related issues
    if (lowerInput.includes("oil") || lowerInput.includes("leak")) {
      return {
        id: uuidv4(),
        severity: "urgent",
        diagnosis:
          "Oil leaks can lead to engine damage if not addressed. The source needs to be identified.",
        recommendation:
          "Check your oil level immediately. If low, add oil but schedule a professional inspection soon to find the leak source.",
        diySteps: [
          "Park on level ground and wait 5 minutes",
          "Pull out dipstick, wipe clean, reinsert fully",
          "Pull out again and check oil level",
          "If low, add recommended oil type",
          "Monitor for drops under the car",
        ],
        repairShopNeeded: true,
        timestamp: Date.now(),
      };
    }

    // Default generic response
    return {
      id: uuidv4(),
      severity: "caution",
      diagnosis:
        "Based on your description, this may require a professional diagnosis to pinpoint the exact issue.",
      recommendation:
        "I recommend having a mechanic perform a diagnostic scan. They can identify the specific problem and provide an accurate repair estimate.",
      diySteps: undefined,
      repairShopNeeded: true,
      timestamp: Date.now(),
    };
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-white">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 shadow-md">
        <h2 className="text-xl font-bold">
          {vehicle.year} {vehicle.make} {vehicle.model}
        </h2>
        <p className="text-sm opacity-90">Auto Sage Diagnostic Assistant</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] ${
                message.role === "user"
                  ? "bg-blue-600 text-white rounded-lg px-4 py-2"
                  : "w-full"
              }`}
            >
              {message.role === "user" ? (
                <p className="text-sm">{message.content}</p>
              ) : (
                <div className="space-y-3">
                  <p className="text-gray-700 text-sm">{message.content}</p>
                  {message.diagnostic && (
                    <DiagnosticCard
                      diagnostic={message.diagnostic}
                      onFindShops={
                        message.diagnostic.repairShopNeeded
                          ? () => onFindShops(message.diagnostic!)
                          : undefined
                      }
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 rounded-lg px-4 py-2">
              <p className="text-sm text-gray-600">Analyzing...</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSendMessage}
        className="border-t border-gray-200 p-4 bg-gray-50 space-y-3"
      >
        {showPhotoUpload && (
          <PhotoUpload
            onPhotoCapture={handlePhotoCapture}
            disabled={isLoading}
          />
        )}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowPhotoUpload(!showPhotoUpload)}
            className={`px-4 py-2 rounded-md transition font-medium ${
              showPhotoUpload || photoBase64
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            disabled={isLoading}
          >
            {photoBase64 ? "✓ Photo" : "📷"}
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe the issue with your vehicle..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            Send
          </button>
        </div>
        <p className="text-xs text-gray-500">
          ⚠️ For safety-critical systems (brakes, airbags, steering), always
          consult a professional.
        </p>
      </form>
    </div>
  );
}
