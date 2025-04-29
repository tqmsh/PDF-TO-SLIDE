'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { AVAILABLE_STYLES, AUDIENCE_OPTIONS, DENSITY_OPTIONS } from '@/types';

export default function Dashboard() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  
  // Redirect to sign in if not authenticated
  if (!loading && !user) {
    router.push('/signin');
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">SlideCraft AI</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => router.push('/dashboard/history')}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              History
            </button>
            <button 
              onClick={() => router.push('/dashboard/settings')}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              Settings
            </button>
            <button 
              onClick={() => signOut()}
              className="btn-secondary"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome{user?.name ? `, ${user.name}` : ''}!
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Upload a PDF to get started with your presentation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-2">
            <div className="card h-full">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Create New Presentation
              </h2>
              <div className="mb-6">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                  <div className="mx-auto flex justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                    Drag and drop your PDF here, or click to browse
                  </p>
                  <button className="mt-4 btn-primary">
                    Select File
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contentDensity" className="label">Content Density</label>
                  <select id="contentDensity" className="input-field">
                    {DENSITY_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="targetAudience" className="label">Target Audience</label>
                  <select id="targetAudience" className="input-field">
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
                      className="border rounded-md p-2 cursor-pointer hover:border-primary-500"
                    >
                      <div className="bg-gray-100 rounded-md aspect-video mb-2"></div>
                      <p className="text-sm font-medium">{style.name}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <button className="btn-primary w-full">Generate Presentation</button>
              </div>
            </div>
          </div>

          {/* Recent Presentations */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Recent Presentations
            </h2>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border rounded-md p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Presentation {i}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Created {i} day{i > 1 ? 's' : ''} ago</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-primary-600 hover:text-primary-700">View</button>
                      <button className="text-red-600 hover:text-red-700">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
              
              <Link href="/dashboard/history" className="block text-center text-primary-600 hover:text-primary-700 mt-4">
                View All
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 