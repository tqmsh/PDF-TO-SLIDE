'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function HowItWorks() {
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm">
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
              href="/dashboard" 
              className="btn-primary"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
            How It Works
          </h1>
          
          <div className="space-y-16">
            {/* Step 1 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="flex-shrink-0 bg-primary-500 text-white font-bold rounded-full w-10 h-10 flex items-center justify-center mr-4">
                    1
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Upload Your PDF Document</h2>
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  Start by uploading your PDF document to our secure platform. We accept academic papers, 
                  reports, articles, and any text-heavy PDF documents up to 20MB in size.
                </p>
                <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg">
                  <div className="aspect-[16/9] rounded-md overflow-hidden bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">Upload Interface Visualization</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="flex-shrink-0 bg-primary-500 text-white font-bold rounded-full w-10 h-10 flex items-center justify-center mr-4">
                    2
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">AI Content Analysis</h2>
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  Our advanced AI engine analyzes your document, identifying key concepts, important facts, 
                  figures, and the logical structure. The AI understands context and prioritizes information 
                  based on its relevance and importance.
                </p>
                <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg">
                  <div className="aspect-[16/9] rounded-md overflow-hidden bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">AI Analysis Visualization</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="flex-shrink-0 bg-primary-500 text-white font-bold rounded-full w-10 h-10 flex items-center justify-center mr-4">
                    3
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Presentation Creation</h2>
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  Using the analyzed content, our system creates well-structured slides with appropriate titles, 
                  bullet points, and visual elements. You can customize the level of detail, presentation style, 
                  and choose from multiple professional themes.
                </p>
                <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg">
                  <div className="aspect-[16/9] rounded-md overflow-hidden bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">Presentation Creation Visualization</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="flex-shrink-0 bg-primary-500 text-white font-bold rounded-full w-10 h-10 flex items-center justify-center mr-4">
                    4
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Review and Download</h2>
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  Preview your presentation, make any necessary edits, and download in your preferred format. 
                  Our system supports PDF and HTML exports, making it easy to use your presentation in any 
                  environment.
                </p>
                <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg">
                  <div className="aspect-[16/9] rounded-md overflow-hidden bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">Download Interface Visualization</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Ready to Create Your First Presentation?
            </h3>
            <button 
              onClick={() => router.push('/dashboard')}
              className="btn-primary text-lg px-8 py-3"
            >
              Try It Now
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">SlideCraft AI</h3>
              <p className="text-gray-400">
                Transforming documents into beautiful presentations with the power of AI.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link href="/features" className="text-gray-400 hover:text-white">Features</Link></li>
                <li><Link href="/pricing" className="text-gray-400 hover:text-white">Pricing</Link></li>
                <li><Link href="/how-it-works" className="text-gray-400 hover:text-white">How It Works</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="/support" className="text-gray-400 hover:text-white">Support</Link></li>
                <li><Link href="/docs" className="text-gray-400 hover:text-white">Documentation</Link></li>
                <li><Link href="/blog" className="text-gray-400 hover:text-white">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
                <li><Link href="/legal" className="text-gray-400 hover:text-white">Legal</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} SlideCraft AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 