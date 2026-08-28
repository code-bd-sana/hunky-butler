import { NextResponse } from 'next/server';

const GOOGLE_PLACE_ID = "ChIJ07Q9XEUhe0gRkdnnQwGVZWQ";

export async function GET() {
  // No fallback. The key was previously hard-coded here, in a public
  // repository. If the variable is missing this now fails loudly rather than
  // silently using a committed key.
  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

  if (!GOOGLE_API_KEY) {
    return NextResponse.json(
      { error: "Google API key not configured" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${GOOGLE_PLACE_ID}&fields=name,formatted_address,rating,user_ratings_total,reviews&key=${GOOGLE_API_KEY}`
    );
    
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching Google reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}