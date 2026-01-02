"use client";

import { DiagnosticResponse } from "@/types/diagnostic";

interface DiagnosticCardProps {
  diagnostic: DiagnosticResponse;
  onFindShops?: () => void;
}

export default function DiagnosticCard({
  diagnostic,
  onFindShops,
}: DiagnosticCardProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "safe":
        return "bg-green-100 border-green-500 text-green-800";
      case "caution":
        return "bg-yellow-100 border-yellow-500 text-yellow-800";
      case "urgent":
        return "bg-orange-100 border-orange-500 text-orange-800";
      case "escalate":
        return "bg-red-100 border-red-500 text-red-800";
      default:
        return "bg-gray-100 border-gray-500 text-gray-800";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "safe":
        return "✓";
      case "caution":
        return "⚠️";
      case "urgent":
        return "🔧";
      case "escalate":
        return "🚨";
      default:
        return "ℹ️";
    }
  };

  return (
    <div
      className={`p-4 rounded-lg border-l-4 ${getSeverityColor(
        diagnostic.severity
      )}`}
    >
      <div className="flex items-start gap-2 mb-3">
        <span className="text-2xl">{getSeverityIcon(diagnostic.severity)}</span>
        <div className="flex-1">
          <h3 className="font-bold text-lg capitalize">
            {diagnostic.severity}
          </h3>
          <p className="text-sm opacity-75">
            {new Date(diagnostic.timestamp).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <h4 className="font-semibold mb-1">Diagnosis</h4>
          <p className="text-sm">{diagnostic.diagnosis}</p>
        </div>

        <div>
          <h4 className="font-semibold mb-1">Recommendation</h4>
          <p className="text-sm">{diagnostic.recommendation}</p>
        </div>

        {diagnostic.diySteps && diagnostic.diySteps.length > 0 && (
          <div>
            <h4 className="font-semibold mb-1">DIY Steps</h4>
            <ol className="text-sm list-decimal list-inside space-y-1">
              {diagnostic.diySteps.map((step: string, idx: number) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </div>
        )}

        {diagnostic.repairShopNeeded && onFindShops && (
          <button
            onClick={onFindShops}
            className="mt-3 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium"
          >
            Find Nearby Repair Shops
          </button>
        )}
      </div>
    </div>
  );
}
