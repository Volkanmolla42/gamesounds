import { ElevenLabsClient } from "elevenlabs";
import { isAuthenticated } from "@/lib/auth";

export async function POST(request) {
  try {
    // Check if user is authenticated
    if (!isAuthenticated(request)) {
      return new Response(JSON.stringify({ error: 'Unauthorized. Please login to use this feature.' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    
    const { text, duration } = await request.json();
    
    const client = new ElevenLabsClient({ 
      apiKey: process.env.ELEVENLABS_API_KEY 
    });

    const audio = await client.textToSoundEffects.convert({
      text,
      duration_seconds: duration
    });

    return new Response(audio, {
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate sound' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}