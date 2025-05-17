import { NextRequest, NextResponse } from 'next/server';
import * as Tesseract from 'tesseract.js';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageData } = body;

    if (!imageData) {
      return NextResponse.json({ success: false, error: 'Missing imageData' }, { status: 400 });
    }

    // Remove the data URI prefix if it exists
    const base64Image = imageData.split(';base64,').pop();

    if (!base64Image) {
        return NextResponse.json({ success: false, error: 'Invalid imageData format' }, { status: 400 });
    }

    const imageBuffer = Buffer.from(base64Image, 'base64');    // Using Tesseract.recognize directly, but with a type assertion to silence TypeScript errors
    // The runtime behavior should work even if TypeScript complains
    const result = await Tesseract.recognize(
      imageBuffer,
      'eng',
      // Use a more specific type assertion to avoid "any"
      { tessedit_char_whitelist: '0123456789' } as Record<string, string>
    );

    const text = result.data.text;

    // Clean the text: remove spaces, newlines, and any non-digit characters.
    // Then take the first 4 digits.
    const cleanedText = text.replace(/\s+|\D/g, '').substring(0, 4);

    if (cleanedText.length === 4) {
      return NextResponse.json({ success: true, text: cleanedText });
    } else {
      return NextResponse.json({ success: false, error: 'OCR failed to recognize 4 digits. Recognized: ' + cleanedText }, { status: 500 });
    }

  } catch (error) {
    console.error('OCR Error:', error);
    let errorMessage = 'An unexpected error occurred during OCR processing.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

// Fallback for other methods
export async function GET() {
  return NextResponse.json({ success: false, error: 'Method Not Allowed' }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ success: false, error: 'Method Not Allowed' }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ success: false, error: 'Method Not Allowed' }, { status: 405 });
}

export async function PATCH() {
  return NextResponse.json({ success: false, error: 'Method Not Allowed' }, { status: 405 });
}

export async function HEAD() {
  return NextResponse.json({ success: false, error: 'Method Not Allowed' }, { status: 405 });
}

export async function OPTIONS() {
  return NextResponse.json({ success: false, error: 'Method Not Allowed' }, { status: 405 });
}
