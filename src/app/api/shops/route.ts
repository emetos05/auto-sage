import { NextRequest, NextResponse } from "next/server";
import { searchRepairShops } from "@/lib/google";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { latitude, longitude, radius } = body;

    if (
      typeof latitude !== "number" ||
      typeof longitude !== "number" ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return NextResponse.json(
        { error: "Invalid coordinates" },
        { status: 400 }
      );
    }

    // PRIVACY NOTE: Location is NOT stored - only used for API call
    const shops = await searchRepairShops({
      latitude,
      longitude,
      radius: radius || 16093, // Default 10 miles
      limit: 20,
    });

    return NextResponse.json({
      shops,
      note: "Location not stored - device-local only",
    });
  } catch (error) {
    console.error("Shop search error:", error);
    return NextResponse.json(
      { error: "Failed to search for shops" },
      { status: 500 }
    );
  }
}
