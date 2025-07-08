import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    // Parse the incoming form data
    const formData = await req.formData();
    const file = formData.get('audio') as File;
    if (!file) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    // Save the file temporarily
    const buffer = Buffer.from(await file.arrayBuffer());
    const tempPath = path.join('/tmp', `audio-${Date.now()}.webm`);
    fs.writeFileSync(tempPath, buffer);

    // Initialize OpenAI client
    const openai = new OpenAI({ 
      apiKey: process.env.OPENAI_API_KEY! 
    });

    // Transcribe with OpenAI Whisper
    const transcription = await openai.audio.transcriptions.create({
      model: "whisper-1",
      file: fs.createReadStream(tempPath) as unknown as File,
    });

    const transcript = transcription.text;
    fs.unlinkSync(tempPath);

    // Generate AI response using GPT-4
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a helpful AI assistant for ClientBridge, a business consultation service. 
          You should be friendly, professional, and helpful. Keep responses concise but informative.
          If someone asks about services, mention that you can help with business consultation, 
          strategy planning, and connecting them with experts. Always be encouraging and supportive.`
        },
        {
          role: "user",
          content: transcript
        }
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content || "I'm sorry, I didn't catch that. Could you please repeat?";

    // TODO: Add ElevenLabs TTS integration once API is properly configured
    // For now, we'll return text-only responses

    return NextResponse.json({ 
      transcript,
      response,
      audio: null // Will be added back with ElevenLabs integration
    });

  } catch (error) {
    console.error('Transcribe API Error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to process audio' 
    }, { status: 500 });
  }
} 