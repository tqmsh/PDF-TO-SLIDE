import { NextRequest, NextResponse } from 'next/server';
import { slideRenderer } from '@/services/marp';

// Define route segment config using the new syntax
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { markdown, theme, format } = body;
    
    if (!markdown) {
      return NextResponse.json({ error: 'No markdown content provided' }, { status: 400 });
    }
    
    // Use the Marp renderer to create presentation files
    const { pdfContent, htmlContent } = await slideRenderer.renderPresentations(markdown, theme || 'default');
    
    // Return the appropriate content based on the requested format
    if (format === 'pdf') {
      return new NextResponse(pdfContent, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="presentation.pdf"'
        }
      });
    } else if (format === 'html') {
      return new NextResponse(htmlContent, {
        headers: {
          'Content-Type': 'text/html',
          'Content-Disposition': 'attachment; filename="presentation.html"'
        }
      });
    } else {
      return NextResponse.json({ error: 'Invalid format. Supported formats are pdf and html' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error rendering presentation:', error);
    return NextResponse.json({ 
      error: 'Failed to render presentation',
      details: (error as Error).message 
    }, { status: 500 });
  }
} 