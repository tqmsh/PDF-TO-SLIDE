import { exec } from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as util from 'util';

const execAsync = util.promisify(exec);

interface SlideOutputFiles {
  pdfContent: Buffer;
  htmlContent: Buffer;
}

export class SlideRenderer {
  /**
   * Convert markdown into PDF and HTML slide presentations
   */
  async renderPresentations(markdown: string, styleTheme: string): Promise<SlideOutputFiles> {
    try {
      // Create a temporary directory for processing files
      const workDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'slide-creator-'));
      
      // Save the markdown content to a file
      const markdownPath = path.join(workDir, 'slides.md');
      await fs.promises.writeFile(markdownPath, markdown);
      
      // Define output file paths
      const pdfOutputPath = path.join(workDir, 'slides.pdf');
      const htmlOutputPath = path.join(workDir, 'slides.html');
      
      // Configure Marp CLI options
      const marpOptions = ['@marp-team/marp-cli', markdownPath, '--theme', styleTheme];
      
      // Generate PDF version
      await execAsync(`npx ${marpOptions.join(' ')} --output ${pdfOutputPath} --pdf`);
      
      // Generate HTML version
      await execAsync(`npx ${marpOptions.join(' ')} --output ${htmlOutputPath} --html`);
      
      // Read the generated output files
      const pdfContent = await fs.promises.readFile(pdfOutputPath);
      const htmlContent = await fs.promises.readFile(htmlOutputPath);
      
      // Clean up temporary directory
      await fs.promises.rm(workDir, { recursive: true, force: true });
      
      return {
        pdfContent,
        htmlContent
      };
    } catch (error) {
      console.error('Error rendering presentations:', error);
      throw new Error('Failed to create presentation files. Please try again.');
    }
  }
}

export const slideRenderer = new SlideRenderer(); 