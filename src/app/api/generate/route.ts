import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import formidable from 'formidable';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { aiService } from '@/services/ai';
import { slideRenderer } from '@/services/marp';
import { fileRepository } from '@/services/storage';
import { getMimeType } from '@/utils/fileHelper';

// Disable body parsing, we'll handle it manually with formidable
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse form data
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const visualStyle = formData.get('visualStyle') as string || 'default';
    const contentDensity = formData.get('contentDensity') as string || 'balanced';
    const targetAudience = formData.get('targetAudience') as string || 'casual';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Check file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are supported' }, { status: 400 });
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Transform the document into slide content with AI
    const markdown = await aiService.createSlidesFromDocument(
      buffer,
      file.name,
      { 
        contentDensity: contentDensity as 'concise' | 'balanced' | 'comprehensive', 
        targetAudience: targetAudience as 'casual' | 'educational' | 'specialized' | 'business', 
        visualStyle 
      },
      // Status updates can't easily be sent through HTTP, so this is a no-op
      () => Promise.resolve()
    );

    // Generate PDF and HTML with slide renderer
    const { pdfContent, htmlContent } = await slideRenderer.renderPresentations(markdown, visualStyle);

    // Store files in repository
    const pdfUrl = await fileRepository.storeFile(pdfContent, `${file.name.replace('.pdf', '')}_slides.pdf`, 'presentations');
    const htmlUrl = await fileRepository.storeFile(htmlContent, `${file.name.replace('.pdf', '')}_slides.html`, 'presentations');

    // Return the URLs
    return NextResponse.json({
      success: true,
      urls: {
        pdf: pdfUrl,
        html: htmlUrl
      },
      markdown
    });
  } catch (error) {
    console.error('Error generating presentation:', error);
    return NextResponse.json(
      { error: 'Failed to generate slides.' },
      { status: 500 }
    );
  }
} 