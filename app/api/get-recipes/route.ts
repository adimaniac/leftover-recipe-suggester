import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const { vegetables } = await request.json();

    if (!vegetables || !Array.isArray(vegetables) || vegetables.length === 0) {
      return NextResponse.json(
        { error: 'No vegetables provided' },
        { status: 400 }
      );
    }

    // Get the model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Generate recipe suggestions
    const prompt = `Generate 3 creative recipes using these vegetables: ${vegetables.join(', ')}. 
    For each recipe, include:
    - A descriptive title
    - A brief description
    - List of ingredients with quantities
    - Step-by-step instructions with each instruction on a new line
    - Approximate calories per serving (based on standard serving sizes)
    
    Return the response as a JSON array of recipe objects with the following structure:
    {
      "title": "Recipe Title",
      "description": "Brief description",
      "ingredients": ["ingredient 1", "ingredient 2", ...],
      "instructions": "Step 1. ... Step 2. ...",
      "calories": "Approximate calories per serving"
    }
    
    Make sure the recipes are healthy, flavorful, and use the identified vegetables as main ingredients.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      // Clean up the response text to ensure it's valid JSON
      const cleanText = text
        .replace(/```json\n?|\n?```/g, '') // Remove markdown code blocks
        .replace(/^\s*\[/, '[') // Remove leading whitespace before array
        .replace(/\]\s*$/, ']') // Remove trailing whitespace after array
        .replace(/\\n/g, ' ') // Replace newlines with spaces
        .replace(/\n/g, ' ') // Replace literal newlines with spaces
        .trim();
      
      console.log('Cleaned response:', cleanText); // Debug log
      const recipes = JSON.parse(cleanText);
      return NextResponse.json({ recipes });
    } catch (parseError) {
      console.error('Error parsing recipe response:', parseError);
      console.error('Raw response:', text);
      return NextResponse.json(
        { error: 'Failed to parse recipe response' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error getting recipes:', error);
    return NextResponse.json(
      { error: 'Failed to generate recipes' },
      { status: 500 }
    );
  }
} 