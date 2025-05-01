'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AVAILABLE_STYLES, AUDIENCE_OPTIONS, DENSITY_OPTIONS } from '@/types';
import FileUpload from '@/components/FileUpload';
import { Presentation, Slide, convertToMarpMarkdown } from '@/services/ai';

// Mock style preview images
const STYLE_PREVIEWS = {
  default: "linear-gradient(to bottom, #f8f9fa, #e9ecef)",
  gaia: "linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)",
  uncover: "linear-gradient(135deg, #334155 0%, #1e293b 100%)"
};

export default function Dashboard() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [contentDensity, setContentDensity] = useState('concise');
  const [targetAudience, setTargetAudience] = useState('casual');
  const [selectedStyle, setSelectedStyle] = useState('default');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState<{pdf: boolean, html: boolean}>({pdf: false, html: false});
  const [generatedPresentation, setGeneratedPresentation] = useState<Presentation | null>(null);
  
  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setGeneratedPresentation(null);
  };
  
  const handleGenerate = async () => {
    if (!selectedFile) {
      alert('Please select a PDF file first');
      return;
    }
    
    setIsGenerating(true);
    setGeneratedPresentation(null);
    
    try {
      // Create form data for API call
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('contentDensity', contentDensity);
      formData.append('targetAudience', targetAudience);
      formData.append('visualStyle', selectedStyle);
      
      // Call API to generate presentation
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate presentation');
      }
      
      console.log('API Response:', data);
      
      if (data.success) {
        // Check if we're in demo mode
        if (data.demoMode) {
          const slides = data.presentation?.slides || [];
          
          // Display demo alert
          alert(`DEMO MODE: In a production environment, this would generate and download a real presentation.
          
The API processed your file "${selectedFile.name}" with:
- Style: ${AVAILABLE_STYLES.find(s => s.id === selectedStyle)?.name}
- Density: ${DENSITY_OPTIONS.find(d => d.value === contentDensity)?.label}
- Audience: ${AUDIENCE_OPTIONS.find(a => a.value === targetAudience)?.label}

Your presentation would contain ${slides.length} slides.

To make this actually work, you need to add valid API keys in your .env.local file.`);
        } else {
          // Not in demo mode - using real API
          console.log('Setting generated presentation:', data.presentation);
          setGeneratedPresentation(data.presentation);
        }
      } else {
        throw new Error(data.error || 'Failed to generate presentation');
      }
    } catch (error) {
      console.error('Error generating presentation:', error);
      alert(`Error: ${(error as Error).message}\n\nTo make this work properly, you need to add valid API keys in your .env.local file.`);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleDownload = async (format: 'pdf' | 'html') => {
    if (!generatedPresentation) return;
    
    setIsDownloading({...isDownloading, [format]: true});
    
    try {
      // Convert presentation to Marp markdown
      const markdown = convertToMarpMarkdown(generatedPresentation, selectedStyle);
      
      // Call API to render presentation
      const response = await fetch('/api/render', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          markdown,
          theme: selectedStyle,
          format
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to generate ${format.toUpperCase()}`);
      }
      
      // Get the blob from the response
      const blob = await response.blob();
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `presentation.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error(`Error downloading ${format}:`, error);
      alert(`Error downloading ${format}: ${(error as Error).message}`);
    } finally {
      setIsDownloading({...isDownloading, [format]: false});
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              SlideCraft AI
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              href="/"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              Home
            </Link>
            <Link 
              href="/how-it-works"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              How It Works
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Create Your Presentation
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Upload a PDF to get started with your presentation.
          </p>
        </div>

        {generatedPresentation ? (
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{generatedPresentation.title}</h2>
              <button 
                onClick={() => setGeneratedPresentation(null)}
                className="btn-secondary"
              >
                Create New
              </button>
            </div>
            
            <div className="space-y-6 mb-6">
              {generatedPresentation.slides.map((slide, index) => (
                <div key={index} className="border rounded-lg p-6 bg-white shadow-sm">
                  <h3 className="text-xl font-bold mb-3">{slide.title}</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    {slide.content.map((point, pointIndex) => (
                      <li key={pointIndex} className="text-gray-700">{point}</li>
                    ))}
                  </ul>
                  {slide.notes && (
                    <div className="mt-4 pt-3 border-t text-sm text-gray-500">
                      <p className="font-medium">Notes:</p>
                      <p>{slide.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex justify-center space-x-4">
              <button 
                className="btn-primary flex items-center"
                onClick={() => handleDownload('pdf')}
                disabled={isDownloading.pdf}
              >
                {isDownloading.pdf ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating PDF...
                  </>
                ) : (
                  'Download PDF'
                )}
              </button>
              
              <button 
                className="btn-secondary flex items-center"
                onClick={() => handleDownload('html')}
                disabled={isDownloading.html}
              >
                {isDownloading.html ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating HTML...
                  </>
                ) : (
                  'Download HTML'
                )}
              </button>
              
              <button 
                className="btn-secondary"
                onClick={() => window.print()}
              >
                Print View
              </button>
              
              <button 
                className="btn-secondary"
                onClick={() => setGeneratedPresentation(null)}
              >
                Create Another
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upload Section */}
            <div className="lg:col-span-2">
              <div className="card h-full">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Create New Presentation
                </h2>
                <div className="mb-6">
                  <FileUpload 
                    onFileSelect={handleFileSelect} 
                    acceptedFileTypes={['application/pdf']}
                    maxSize={20 * 1024 * 1024} // 20MB
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contentDensity" className="label">Content Density</label>
                    <select 
                      id="contentDensity" 
                      className="input-field"
                      value={contentDensity}
                      onChange={(e) => setContentDensity(e.target.value)}
                    >
                      {DENSITY_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="targetAudience" className="label">Target Audience</label>
                    <select 
                      id="targetAudience" 
                      className="input-field"
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                    >
                      {AUDIENCE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label htmlFor="visualStyle" className="label">Visual Style</label>
                  <div className="grid grid-cols-3 gap-4 mt-2">
                    {AVAILABLE_STYLES.map((style) => (
                      <div 
                        key={style.id}
                        className={`border rounded-md p-2 cursor-pointer ${
                          selectedStyle === style.id 
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10' 
                            : 'hover:border-primary-500'
                        }`}
                        onClick={() => setSelectedStyle(style.id)}
                      >
                        <div 
                          className="rounded-md aspect-video mb-2" 
                          style={{ 
                            background: STYLE_PREVIEWS[style.id as keyof typeof STYLE_PREVIEWS] || '#f3f4f6',
                            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.05)'
                          }}
                        ></div>
                        <p className="text-sm font-medium">{style.name}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <button 
                    className="btn-primary w-full flex items-center justify-center"
                    onClick={handleGenerate}
                    disabled={isGenerating || !selectedFile}
                  >
                    {isGenerating ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                      </>
                    ) : (
                      'Generate Presentation'
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Example Presentations */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Example Presentations
              </h2>
              <div className="space-y-4">
                {[
                  "AI and Machine Learning Overview",
                  "Climate Change Research Summary",
                  "Business Strategy Analysis"
                ].map((title, i) => (
                  <div key={i} className="border rounded-md p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Example template</p>
                      </div>
                      <div>
                        <button className="text-primary-600 hover:text-primary-700">View</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 