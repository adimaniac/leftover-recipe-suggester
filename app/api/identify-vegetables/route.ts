import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    // Remove the data URL prefix if present
    const base64Image = image.replace(/^data:image\/\w+;base64,/, '');
    const imageData = Buffer.from(base64Image, 'base64');

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Identify the vegetables in this image. Return ONLY a JSON array of vegetable names, nothing else. For example: ["carrot", "broccoli", "tomato"]`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: base64Image
        }
      }
    ]);

    const response = await result.response;
    const text = response.text();
    
    // Clean up the response to ensure it's valid JSON
    const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
    let vegetables: string[];
    
    try {
      vegetables = JSON.parse(cleanedText);
    } catch (e) {
      console.error('Failed to parse vegetables:', cleanedText);
      return NextResponse.json(
        { error: 'Failed to parse vegetable identification' },
        { status: 500 }
      );
    }

    return NextResponse.json({ vegetables });
  } catch (error) {
    console.error('Error identifying vegetables:', error);
    return NextResponse.json(
      { error: 'Failed to identify vegetables' },
      { status: 500 }
    );
  }
} 