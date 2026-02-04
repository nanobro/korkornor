import { NextRequest, NextResponse } from 'next/server';
import { extractLocationFromImage, isOpenRouterConfigured } from '@/lib/openrouter';

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    // Check if OpenRouter is configured
    if (!isOpenRouterConfigured()) {
      return NextResponse.json({
        location: null,
        mockMode: true,
        message: 'OpenRouter not configured - using mock mode'
      });
    }

    // Extract location from image
    const result = await extractLocationFromImage(imageUrl);

    return NextResponse.json({
      location: result,
      model: 'z-ai/glm-4.5-air (OpenRouter)',
    });
  } catch (error) {
    console.error('Error extracting location:', error);
    return NextResponse.json(
      { error: 'Failed to extract location' },
      { status: 500 }
    );
  }
}
