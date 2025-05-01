import { NextRequest, NextResponse } from 'next/server';
import { generatePresentation } from '@/services/ai';
import { processFile } from '@/utils/fileHelper';

// Define route segment config using the new syntax
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    // Check if API keys are properly configured
    const googleApiKey = process.env.GOOGLE_API_KEY || '';
    const firebaseApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '';
    
    // Debug: Log environment variables (will show up in terminal)
    console.log('Environment Variables Check:');
    console.log('- GOOGLE_API_KEY:', googleApiKey ? `Set (${googleApiKey.substring(0, 5)}...)` : 'Not set');
    console.log('- FIREBASE_API_KEY:', firebaseApiKey ? `Set (${firebaseApiKey.substring(0, 5)}...)` : 'Not set');
    
    // Validate API keys
    const missingKeys = [];
    if (!googleApiKey || googleApiKey.includes('your_') || googleApiKey === '') {
      missingKeys.push('GOOGLE_API_KEY');
    }
    if (!firebaseApiKey || firebaseApiKey.includes('your_') || firebaseApiKey === '') {
      missingKeys.push('NEXT_PUBLIC_FIREBASE_API_KEY');
    }
    
    const formData = await request.formData();
    const pdfFile = formData.get('file') as File;
    
    if (!pdfFile) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }
    
    // Check file type
    if (!pdfFile.type.includes('pdf')) {
      return NextResponse.json({ error: 'Only PDF files are supported' }, { status: 400 });
    }
    
    const options = {
      contentDensity: formData.get('contentDensity') as string || 'concise',
      targetAudience: formData.get('targetAudience') as string || 'casual',
      visualStyle: formData.get('visualStyle') as string || 'default'
    };
    
    console.log('Processing file:', pdfFile.name, 'with options:', options);
    
    // Process the file (extract text, etc.)
    const processedText = await processFile(pdfFile);
    
    // If keys are missing, still return "success" but with a warning
    // This allows the demo to work without real API keys
    if (missingKeys.length > 0) {
      console.warn(`Missing API keys: ${missingKeys.join(', ')}. Running in demo mode.`);
      
      // Generate a mock presentation with the generatePresentation function
      const presentation = await generatePresentation(processedText, options);
      
      return NextResponse.json({
        success: true,
        presentation,
        demoMode: true,
        missingKeys,
        message: `Demo mode: Processed ${pdfFile.name} successfully, but no real presentation was generated because API keys are missing.`
      });
    }
    
    // In a real implementation with valid API keys, this would call the actual AI service
    try {
      console.log('Using real API mode with Google API key and Firebase');
      const presentation = await generatePresentation(processedText, options);
      
      // Check if the real API was used by examining if there was an API error
      // If there's a demoMode flag on the response, we'll pass it through
      const demoMode = (presentation as any).demoMode === true;
      
      return NextResponse.json({ 
        success: true, 
        presentation,
        demoMode,
        message: demoMode 
          ? `Demo mode: Processed ${pdfFile.name} successfully, but no real presentation was generated.`
          : `Successfully generated presentation from ${pdfFile.name}`
      });
    } catch (aiError) {
      console.error('AI Service Error:', aiError);
      return NextResponse.json({ 
        error: 'Error in AI processing', 
        details: (aiError as Error).message,
        demoMode: false
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error generating presentation:', error);
    return NextResponse.json(
      { error: 'Failed to generate presentation', details: (error as Error).message }, 
      { status: 500 }
    );
  }
} 