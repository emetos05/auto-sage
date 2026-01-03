"use client";

import { useState, useEffect } from "react";
import { RepairShop } from "@/types/diagnostic";

interface ShopFinderProps {
  onBack: () => void;
}

export default function ShopFinder({ onBack }: ShopFinderProps) {
  const [shops, setShops] = useState<RepairShop[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationGranted, setLocationGranted] = useState<boolean | null>(null);

  useEffect(() => {
    requestLocation();
  }, []);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLocationGranted(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setLocationGranted(true);
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch("/api/shops", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              latitude,
              longitude,
              radius: 16093, // 10 miles
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to fetch shops");
          }

          const data = await response.json();
          setShops(data.shops || []);
        } catch (err) {
          setError("Failed to find nearby shops. Please try again.");
          console.error("Shop search error:", err);
        } finally {
          setIsLoading(false);
        }
      },
      (err) => {
        setLocationGranted(false);
        setIsLoading(false);
        setError(
          "Location access denied. Please enable location services to find nearby repair shops."
        );
        console.error("Geolocation error:", err);
      }
    );
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Find Nearby Repair Shops
        </h2>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
        >
          ← Back to Chat
        </button>
      </div>

      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-sm text-blue-800">
          🔒 <strong>Privacy:</strong> Your location is only used to search for
          nearby shops and is NOT stored anywhere.
        </p>
      </div>

      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Searching for nearby shops...</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md mb-4">
          <p className="text-red-800">{error}</p>
          {!locationGranted && (
            <button
              onClick={requestLocation}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              Try Again
            </button>
          )}
        </div>
      )}

      {!isLoading && shops.length === 0 && !error && locationGranted && (
        <div className="text-center py-8 text-gray-600">
          <p>No repair shops found nearby.</p>
          <p className="text-sm mt-2">Try expanding your search radius.</p>
        </div>
      )}

      {shops.length > 0 && (
        <div className="space-y-4">
          {shops.map((shop) => (
            <div
              key={shop.id}
              className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  {shop.name}
                </h3>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500">★</span>
                  <span className="font-medium">{shop.rating}</span>
                  <span className="text-gray-500 text-sm">
                    ({shop.reviewCount})
                  </span>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-2">{shop.address}</p>

              <div className="flex gap-3 items-center text-sm">
                {shop.phone && shop.phone !== "N/A" && (
                  <a
                    href={`tel:${shop.phone}`}
                    className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                  >
                    📞 Call
                  </a>
                )}
                {shop.website && (
                  <a
                    href={shop.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    🌐 View on Google Maps
                  </a>
                )}
                {shop.distance && (
                  <span className="text-gray-500">{shop.distance} mi away</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
