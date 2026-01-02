/**
 * Yelp API utility for finding nearby repair shops
 * Server-side only - API key not exposed to client
 */

import { RepairShop } from "@/types/diagnostic";

interface YelpBusiness {
  id: string;
  name: string;
  rating: number;
  review_count: number;
  phone: string;
  location: {
    address1: string;
    city: string;
    state: string;
    zip_code: string;
  };
  url: string;
  distance?: number;
}

interface YelpSearchParams {
  latitude: number;
  longitude: number;
  radius?: number; // meters, max 40000 (25 miles)
  limit?: number; // max 50
}

export async function searchRepairShops(
  params: YelpSearchParams
): Promise<RepairShop[]> {
  const apiKey = process.env.YELP_API_KEY;

  if (!apiKey) {
    console.error("YELP_API_KEY not configured");
    return [];
  }

  const {
    latitude,
    longitude,
    radius = 16093, // 10 miles in meters
    limit = 20,
  } = params;

  try {
    const url = new URL("https://api.yelp.com/v3/businesses/search");
    url.searchParams.set("latitude", latitude.toString());
    url.searchParams.set("longitude", longitude.toString());
    url.searchParams.set("radius", radius.toString());
    url.searchParams.set("limit", limit.toString());
    url.searchParams.set("categories", "autorepair,autobodyshops");
    url.searchParams.set("sort_by", "rating");

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("Yelp API error:", await response.text());
      return [];
    }

    const data = await response.json();
    const businesses: YelpBusiness[] = data.businesses || [];

    return businesses.map((business) => ({
      id: business.id,
      name: business.name,
      rating: business.rating,
      reviewCount: business.review_count,
      phone: business.phone || "N/A",
      address: `${business.location.address1}, ${business.location.city}, ${business.location.state} ${business.location.zip_code}`,
      website: business.url,
      distance: business.distance
        ? Math.round(business.distance * 0.000621371 * 10) / 10 // meters to miles, 1 decimal
        : undefined,
    }));
  } catch (error) {
    console.error("Yelp search error:", error);
    return [];
  }
}
