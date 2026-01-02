"use client";

import { useState, useEffect } from "react";
import VehicleSelector from "@/components/VehicleSelector";
import ChatUI from "@/components/ChatUI";
import ShopFinder from "@/components/ShopFinder";
import { Vehicle, DiagnosticResponse } from "@/types/diagnostic";
import { createChatSession } from "@/lib/storage";
import { registerServiceWorker } from "@/lib/pwa";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showShops, setShowShops] = useState(false);
  const [currentDiagnostic, setCurrentDiagnostic] =
    useState<DiagnosticResponse | null>(null);

  useEffect(() => {
    // Register service worker for PWA functionality
    registerServiceWorker();
  }, []);

  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const handleNewSession = async () => {
    if (!selectedVehicle) return;
    const session = await createChatSession(selectedVehicle.id);
    setSessionId(session.id);
  };

  const handleBackToGarage = () => {
    setSelectedVehicle(null);
    setSessionId(null);
    setShowShops(false);
    setCurrentDiagnostic(null);
  };

  const handleFindShops = (diagnostic: DiagnosticResponse) => {
    setCurrentDiagnostic(diagnostic);
    setShowShops(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🔧</div>
            <div>
              <h1 className="text-2xl font-bold">Auto-Sage</h1>
              <p className="text-sm opacity-90">AI Car Maintenance Assistant</p>
            </div>
          </div>
          {selectedVehicle && (
            <button
              onClick={handleBackToGarage}
              className="px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-blue-50 transition font-medium"
            >
              ← Back to Garage
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8">
        {!selectedVehicle || !sessionId ? (
          <VehicleSelector
            onVehicleSelect={handleVehicleSelect}
            onNewSession={handleNewSession}
          />
        ) : showShops ? (
          <ShopFinder onBack={() => setShowShops(false)} />
        ) : (
          <ChatUI
            vehicle={selectedVehicle}
            sessionId={sessionId}
            onFindShops={handleFindShops}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 w-full bg-gray-800 text-white text-center py-2 text-sm">
        <p>
          🔒 Privacy-First: No data stored on servers. All data stays on your
          device.
        </p>
      </footer>
    </div>
  );
}
