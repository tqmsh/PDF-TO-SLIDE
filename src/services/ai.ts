import axios from 'axios';

// Types for the AI service
export interface DocumentTransformOptions {
  contentDensity: 'concise' | 'balanced' | 'comprehensive';
  targetAudience: 'casual' | 'educational' | 'specialized' | 'business' | 'leadership';
  visualStyle: string;
}

interface PresentationOptions {
  contentDensity: string;
  targetAudience: string;
  visualStyle: string;
}

export interface Slide {
  title: string;
  content: string[];
  notes?: string;
}

export interface Presentation {
  title: string;
  slides: Slide[];
}

export class AIService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.GOOGLE_API_KEY || '';
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
  }

  /**
   * Transform document content into presentation slides
   */
  async createSlidesFromDocument(
    fileData: Buffer,
    fileName: string,
    options: DocumentTransformOptions,
    onStatusUpdate?: (message: string) => void
  ): Promise<string> {
    try {
      if (onStatusUpdate) {
        onStatusUpdate('Processing document content...');
      }

      // Base64 encode the file for transmission
      const base64File = fileData.toString('base64');
      
      // Create prompt for the Gemini API
      const prompt = this.buildTransformationPrompt(options);

      if (onStatusUpdate) {
        onStatusUpdate('Generating slide content with AI...');
      }

      // Call Gemini API
      const response = await axios.post(
        `${this.baseUrl}?key=${this.apiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  inlineData: {
                    mimeType: 'application/pdf',
                    data: base64File
                  }
                },
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 4096
          }
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Extract markdown content from response
      const responseText = response.data.candidates[0].content.parts[0].text;
      const markdown = this.extractMarkdownFromResponse(responseText);

      if (!markdown) {
        throw new Error('Failed to generate presentation markdown');
      }

      return markdown;
    } catch (error) {
      console.error('Error generating presentation:', error);
      throw new Error('Failed to generate slides.');
    }
  }

  /**
   * Build the AI prompt based on transformation options
   */
  private buildTransformationPrompt(options: DocumentTransformOptions): string {
    // Create content density instruction
    const densityInstruction = this.createDensityInstruction(options.contentDensity);
    
    // Create audience instruction
    const audienceInstruction = this.createAudienceInstruction(options.targetAudience);

    // Construct the full prompt
    return `You are a presentation designer specializing in Marp markdown. Your task is to transform documents into visually engaging slides.
    
I need you to create a Marp markdown presentation with these specifications:

Visual Style: ${options.visualStyle}

${densityInstruction}

${audienceInstruction}

DESIGN GUIDELINES
1. Use a strong opening — Begin with an engaging title slide: include a main heading, a short description, and source attribution if applicable.
2. Prioritize visual clarity — Apply visual hierarchy using headings, bullet points, spacing, and bold text to guide the viewer's attention effectively.
3. Respect content boundaries — Ensure all text and visuals fit neatly within the slide margins; avoid overcrowding.
4. Format code properly — For code snippets longer than a few words, always use dedicated code blocks instead of inline text for better clarity and aesthetics.
5. Avoid empty endings — Do not finish your presentation with a separator (---) or placeholder that would leave an unintended blank slide.
6.Be consistent — Maintain a uniform font style, color palette, and alignment throughout the presentation to create a polished look.
7. Focus on creating a visually balanced design with appropriate spacing and professional aesthetics.

Your response should be formatted within markdown code fences like this:

\`\`\`md
[Your slide content here]
\`\`\``;
  }

  /**
   * Create instruction based on content density
   */
  private createDensityInstruction(density: string): string {
    switch (density) {
      case 'comprehensive':
        return "CONTENT APPROACH: Include thorough coverage of the document's content with supporting details and examples. Incorporate all key sections and subsections while preserving detailed explanations, examples, and contextual information. Create enough slides to properly present all relevant information without overcrowding. For each topic, include both main concepts and their supporting context. Keep slide content balanced with approximately 6-8 bullet points per slide when appropriate. Avoid overloading individual slides with excessive text that might extend beyond visible boundaries.";
      case 'balanced':
        return "CONTENT APPROACH: Focus on the document's key information and essential supporting details. Select content that effectively communicates the core message and critical evidence without including every minor point. Group related concepts into well-organized slides that cover major topics while excluding peripheral information. Emphasize content that directly supports the document's primary arguments or conclusions. Use approximately 4-6 bullet points per slide for optimal readability.";
      case 'concise':
        return "CONTENT APPROACH: Distill the document to its most critical elements - key conclusions, primary arguments, and essential data points only. Transform the content into the most efficient form possible while preserving meaning. Consolidate major sections into a focused, streamlined presentation. Exclude supplementary details, examples and explanations unless they're absolutely necessary for basic comprehension. Prioritize high-level insights over detailed explanations. Use a maximum of 3-4 bullet points per slide for maximum impact.";
      default:
        return "CONTENT APPROACH: Extract important information from each section, focusing on main concepts and key supporting details.";
    }
  }

  /**
   * Create instruction based on audience type
   */
  private createAudienceInstruction(audience: string): string {
    switch (audience) {
      case 'casual':
        return "AUDIENCE ADAPTATION: Design for a casual audience with minimal prior knowledge. Use everyday language and avoid industry jargon. When technical concepts appear, provide simple explanations with relatable examples. Focus on the 'what' and 'why' rather than complex details. Organize information in a story-like structure that's easy to follow. Use generous visuals and minimal text to maintain interest and engagement.";
      case 'educational':
        return "AUDIENCE ADAPTATION: Prepare content for learning environments. Balance theoretical frameworks with practical applications. Include citations, sources, and methodological details where appropriate. Structure content in a logical learning progression that builds understanding from fundamentals to advanced concepts. Include examples, case studies, and key takeaways for effective knowledge transfer. Use clear visual aids to reinforce learning objectives.";
      case 'specialized':
        return "AUDIENCE ADAPTATION: Craft material for domain experts with deep technical knowledge. Maintain field-specific terminology and in-depth technical specifications. Focus on implementation methodologies, technical workflows, and system architecture details. Include data representations, code samples, and technical diagrams with appropriate context. Organize content to highlight technical relationships and dependencies. Maintain precision throughout without oversimplifying complex concepts.";
      case 'business':
        return "AUDIENCE ADAPTATION: Tailor content for professionals focused on practical implementation and market application. Emphasize business value, ROI, and competitive advantages. Highlight actionable insights, real-world applications, and measurable outcomes. Structure information with clear recommendations and implementation pathways. Use concise formats like bullet points and executive summaries. When presenting data, focus on trends and metrics with direct business relevance.";
      case 'leadership':
        return "AUDIENCE ADAPTATION: Format for high-level decision-makers who need strategic insights quickly. Focus exclusively on big-picture implications, strategic directions, and critical decisions points. Present information at a summary level, avoiding operational details unless essential for key decisions. Structure content around opportunities, risks, and resource considerations. Use headline-style statements with clear action orientation. Limit each slide to no more than 3-4 key points for maximum clarity.";
      default:
        return "AUDIENCE ADAPTATION: Create slides suitable for a general audience with varying levels of background knowledge.";
    }
  }

  /**
   * Extract markdown content from AI response
   */
  private extractMarkdownFromResponse(text: string): string {
    const markdownRegex = /```(?:md|markdown)?\s*([\s\S]*?)```/;
    const match = text.match(markdownRegex);
    
    if (match && match[1]) {
      return match[1].trim();
    }
    
    // If no markdown found with backticks, return the whole text
    return text;
  }
}

export const aiService = new AIService();

/**
 * Generate presentation slides based on the content
 * @param content The content to generate slides from
 * @param options Options for presentation generation
 * @returns The generated presentation
 */
export async function generatePresentation(
  content: string,
  options: PresentationOptions
): Promise<Presentation> {
  try {
    // Check if we have API keys
    const googleApiKey = process.env.GOOGLE_API_KEY;
    if (!googleApiKey || googleApiKey.includes('your_') || googleApiKey === '') {
      console.log('No valid Google API key found, using demo mode');
      return createDemoPresentation(content);
    }
    
    console.log('Attempting to use real AI processing with Google API key:', 
                googleApiKey ? `${googleApiKey.substring(0, 5)}...` : 'Not available');
    
    // Use the actual text content for processing instead of trying to treat it as PDF data
    // This approach works directly with the text instead of binary file data
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${googleApiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  text: `Create a presentation outline based on the following content:
                  
${content}

The presentation should have the following characteristics:
- Style: ${options.visualStyle}
- Content density: ${options.contentDensity}
- Target audience: ${options.targetAudience}

Format the presentation as a structured outline with:
1. A title slide
2. 3-5 main content slides
3. A conclusion slide

Each slide should have a clear title and 3-4 bullet points of content.`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 1024
          }
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data && response.data.candidates && response.data.candidates[0]) {
        const generatedText = response.data.candidates[0].content.parts[0].text;
        console.log('Successfully received response from Gemini API');
        
        // Extract the presentation content from the response
        const slides = parseGeneratedTextToSlides(generatedText);
        
        return {
          title: getPresentationTitle(generatedText, content),
          slides: slides
        };
      } else {
        throw new Error('Unexpected API response format');
      }
    } catch (apiError) {
      console.error('Gemini API error details:', apiError);
      throw new Error('Error communicating with Gemini API');
    }
  } catch (error) {
    console.error('Error in AI processing:', error);
    console.log('Falling back to demo mode due to error');
    return createDemoPresentation(content);
  }
}

/**
 * Parse generated text from AI into structured slides
 */
function parseGeneratedTextToSlides(text: string): Slide[] {
  const slides: Slide[] = [];
  
  // Simple parsing that looks for slide titles and bullet points
  const lines = text.split('\n');
  let currentSlide: Slide | null = null;
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Skip empty lines
    if (!trimmedLine) continue;
    
    // Check if this is a slide title (indicated by a heading or "Slide X:")
    if (trimmedLine.startsWith('# ') || 
        trimmedLine.startsWith('## ') || 
        /^Slide\s+\d+:/.test(trimmedLine) ||
        /^Title\s+Slide:/.test(trimmedLine) ||
        /^Conclusion:/.test(trimmedLine)) {
      
      // Save previous slide if exists
      if (currentSlide && currentSlide.content.length > 0) {
        slides.push(currentSlide);
      }
      
      // Extract title, removing any markdown heading symbols or "Slide X:"
      let title = trimmedLine
        .replace(/^#\s+/, '')
        .replace(/^##\s+/, '')
        .replace(/^Slide\s+\d+:\s*/, '')
        .replace(/^Title\s+Slide:\s*/, '')
        .replace(/^Conclusion:\s*/, 'Conclusion');
      
      currentSlide = {
        title,
        content: []
      };
    } 
    // Check for bullet points
    else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
      if (currentSlide) {
        currentSlide.content.push(trimmedLine.substring(2));
      }
    }
    // If not a bullet and not a title, it might be plain text content or a continuation
    else if (currentSlide) {
      // Only add non-bullet content if it's not a divider or format hint
      if (!trimmedLine.startsWith('---') && 
          !trimmedLine.includes('```') &&
          !trimmedLine.startsWith('<!--')) {
        currentSlide.content.push(trimmedLine);
      }
    }
  }
  
  // Don't forget to add the last slide
  if (currentSlide && currentSlide.content.length > 0) {
    slides.push(currentSlide);
  }
  
  // If we couldn't parse any slides, create a default slide
  if (slides.length === 0) {
    return [{
      title: 'Presentation Summary',
      content: ['Could not parse specific slides from the AI-generated content.', 
                'Here is the response as a single slide.', 
                text.substring(0, 100) + '...']
    }];
  }
  
  return slides;
}

/**
 * Extract a title from the generated text or create one from the content
 */
function getPresentationTitle(generatedText: string, originalContent: string): string {
  // Try to find a presentation title in the generated text
  const lines = generatedText.split('\n');
  for (const line of lines) {
    if (line.includes('Presentation Title') || line.includes('Title:')) {
      return line.replace('Presentation Title:', '').replace('Title:', '').trim();
    }
  }
  
  // If no title found, use the first slide title or create from content
  const firstLine = lines.find(line => line.trim().length > 0);
  if (firstLine) {
    return firstLine.replace(/^#\s+/, '').trim();
  }
  
  // Last resort: create a title from the content
  const contentWords = originalContent.split(' ').slice(0, 5).join(' ');
  return `Presentation on ${contentWords}...`;
}

/**
 * Create a demo presentation (when API is not available)
 */
function createDemoPresentation(content: string): Presentation {
  const titleFromContent = content.split(' ').slice(0, 4).join(' ');
  
  return {
    title: `Presentation on ${titleFromContent}`,
    slides: [
      {
        title: 'Introduction',
        content: ['This is the first slide generated based on your content.', 'It provides an overview of the topic.'],
        notes: 'Opening slide with key context'
      },
      {
        title: 'Key Points',
        content: [
          'First important point from the document',
          'Second important consideration',
          'Additional supporting information'
        ]
      },
      {
        title: 'Analysis',
        content: [
          'Detailed breakdown of the information',
          'Important metrics and figures',
          'Contextual information'
        ]
      },
      {
        title: 'Conclusion',
        content: [
          'Summary of key takeaways',
          'Recommended next steps',
          'Final thoughts'
        ],
        notes: 'Emphasize action items'
      }
    ]
  };
}

/**
 * Convert markdown text to slides
 */
function parseMarkdownToSlides(markdown: string): Slide[] {
  // Simple parser that looks for slide dividers (---) and headers (# or ##)
  const slides: Slide[] = [];
  const slideTexts = markdown.split('---').map(text => text.trim()).filter(text => text.length > 0);
  
  for (const slideText of slideTexts) {
    const lines = slideText.split('\n').map(line => line.trim());
    let title = 'Slide';
    let content: string[] = [];
    
    // Look for a title (# or ## heading)
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('# ')) {
        title = lines[i].substring(2);
        lines.splice(i, 1);
        break;
      } else if (lines[i].startsWith('## ')) {
        title = lines[i].substring(3);
        lines.splice(i, 1);
        break;
      }
    }
    
    // Process content
    let currentList: string[] = [];
    for (const line of lines) {
      if (line.startsWith('- ') || line.startsWith('* ')) {
        currentList.push(line.substring(2));
      } else if (line.length > 0) {
        if (currentList.length > 0) {
          content.push(...currentList);
          currentList = [];
        }
        content.push(line);
      }
    }
    
    if (currentList.length > 0) {
      content.push(...currentList);
    }
    
    if (content.length > 0) {
      slides.push({ title, content });
    }
  }
  
  return slides.length > 0 ? slides : [
    { 
      title: 'Parsed Content', 
      content: ['The presentation content could not be properly parsed from the AI response.', 'Here is the raw markdown:', markdown.substring(0, 100) + '...']
    }
  ];
}

/**
 * Convert presentation to Marp markdown format for rendering
 */
export function convertToMarpMarkdown(presentation: Presentation, themeStyle: string = 'default'): string {
  let markdown = '';
  
  // Add theme directive
  markdown += `---\nmarp: true\ntheme: ${themeStyle}\n---\n\n`;
  
  // Title slide
  markdown += `# ${presentation.title}\n\n`;
  
  if (presentation.slides[0]?.content?.length > 0) {
    markdown += presentation.slides[0].content.join('\n') + '\n\n';
  }
  
  // Add each slide
  for (let i = 1; i < presentation.slides.length; i++) {
    const slide = presentation.slides[i];
    
    // Add slide separator
    markdown += '---\n\n';
    
    // Add slide title
    markdown += `## ${slide.title}\n\n`;
    
    // Add slide content as bullet points
    slide.content.forEach(point => {
      markdown += `- ${point}\n`;
    });
    
    // Add slide notes if they exist
    if (slide.notes) {
      markdown += `\n<!-- Notes: ${slide.notes} -->\n`;
    }
    
    markdown += '\n';
  }
  
  return markdown;
} 