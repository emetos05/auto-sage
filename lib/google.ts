/**
 * Google Places API utility for finding nearby repair shops
 * Server-side only - API key not exposed to client
 */

import { RepairShop } from "@/types/diagnostic";

interface PlacesResult {
  place_id: string;
  name: string;
  rating?: number;
  user_ratings_total?: number;
  formatted_address: string;
  formatted_phone_number?: string;
  website?: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

interface PlacesSearchParams {
  latitude: number;
  longitude: number;
  radius?: number; // meters, default 16093 (10 miles)
  limit?: number; // number of results, default 20
}

export async function searchRepairShops(
  params: PlacesSearchParams
): Promise<RepairShop[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    console.error("GOOGLE_PLACES_API_KEY not configured");
    return [];
  }

  const {
    latitude,
    longitude,
    radius = 16093, // 10 miles in meters
    limit = 20,
  } = params;

  try {
    const url = new URL(
      "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    );
    url.searchParams.set("location", `${latitude},${longitude}`);
    url.searchParams.set("radius", radius.toString());
    url.searchParams.set("type", "car_repair");
    url.searchParams.set("keyword", "auto repair mechanic");
    url.searchParams.set("key", apiKey);

    const response = await fetch(url.toString());

    if (!response.ok) {
      console.error("Google Places API error:", await response.text());
      return [];
    }

    const data = await response.json();

    if (data.status === "ZERO_RESULTS") {
      return [];
    }

    if (data.status !== "OK" && data.status !== "OVER_QUERY_LIMIT") {
      console.error("Google Places API status:", data.status);
      return [];
    }

    const results: PlacesResult[] = data.results || [];

    // Fetch detailed info for each place to get phone and website
    const enrichedShops: RepairShop[] = [];

    for (let i = 0; i < Math.min(results.length, limit); i++) {
      const place = results[i];

      try {
        const detailsUrl = new URL(
          "https://maps.googleapis.com/maps/api/place/details/json"
        );
        detailsUrl.searchParams.set("place_id", place.place_id);
        detailsUrl.searchParams.set(
          "fields",
          "formatted_phone_number,website,url"
        );
        detailsUrl.searchParams.set("key", apiKey);

        const detailsResponse = await fetch(detailsUrl.toString());
        const detailsData = await detailsResponse.json();
        const details = detailsData.result || {};

        // Calculate distance in miles
        const distance = calculateDistance(
          latitude,
          longitude,
          place.geometry.location.lat,
          place.geometry.location.lng
        );

        enrichedShops.push({
          id: place.place_id,
          name: place.name,
          rating: place.rating || 0,
          reviewCount: place.user_ratings_total || 0,
          phone: place.formatted_phone_number || "N/A",
          address: place.formatted_address,
          website: details.website || place.website || undefined,
          distance: Math.round(distance * 10) / 10,
        });
      } catch (error) {
        console.error("Error fetching place details:", error);
        // Add shop without details
        const distance = calculateDistance(
          latitude,
          longitude,
          place.geometry.location.lat,
          place.geometry.location.lng
        );

        enrichedShops.push({
          id: place.place_id,
          name: place.name,
          rating: place.rating || 0,
          reviewCount: place.user_ratings_total || 0,
          phone: place.formatted_phone_number || "N/A",
          address: place.formatted_address,
          distance: Math.round(distance * 10) / 10,
        });
      }
    }

    // Sort by rating
    return enrichedShops.sort((a, b) => b.rating - a.rating);
  } catch (error) {
    console.error("Google Places search error:", error);
    return [];
  }
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in miles
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}
