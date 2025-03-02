import { ElevenLabsClient } from "elevenlabs";

export async function POST(request) {
  try {
    const { text, duration } = await request.json();

    const client = new ElevenLabsClient({
      apiKey: process.env.ELEVENLABS_API_KEY,
    });

    const audio = await client.textToSoundEffects.convert({
      text,
      duration_seconds: duration,
    });

    return new Response(audio, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate sound" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
