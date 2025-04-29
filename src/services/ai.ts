import axios from 'axios';

// Types for the AI service
export interface DocumentTransformOptions {
  contentDensity: 'concise' | 'balanced' | 'comprehensive';
  targetAudience: 'casual' | 'educational' | 'specialized' | 'business' | 'leadership';
  visualStyle: string;
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