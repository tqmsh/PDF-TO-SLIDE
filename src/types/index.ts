// User types
export interface User {
  id: string;
  email: string;
  name?: string;
  photoURL?: string;
}

// Document types
export interface Document {
  id: string;
  name: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  fileUrl?: string;
  fileType: string;
  slidesPdfUrl?: string;
  slidesHtmlUrl?: string;
}

// Presentation settings types
export interface PresentationSettings {
  contentDensity: 'concise' | 'balanced' | 'comprehensive';
  targetAudience: 'casual' | 'educational' | 'specialized' | 'business' | 'leadership';
  visualStyle: string;
}

// Theme types
export interface VisualStyle {
  id: string;
  name: string;
  description: string;
  preview?: string;
}

// Available visual styles
export const AVAILABLE_STYLES: VisualStyle[] = [
  {
    id: 'default',
    name: 'Classic',
    description: 'Clean and minimal design with a white background'
  },
  {
    id: 'gaia',
    name: 'Corporate',
    description: 'Professional style with blue accent colors'
  },
  {
    id: 'uncover',
    name: 'Modern',
    description: 'Contemporary dark theme with subtle gradients'
  }
];

// Audience options
export const AUDIENCE_OPTIONS = [
  { value: 'casual', label: 'Casual' },
  { value: 'educational', label: 'Educational' },
  { value: 'specialized', label: 'Specialized' },
  { value: 'business', label: 'Business' },
  { value: 'leadership', label: 'Leadership' }
];

// Content density options
export const DENSITY_OPTIONS = [
  { value: 'concise', label: 'Concise' },
  { value: 'balanced', label: 'Balanced' },
  { value: 'comprehensive', label: 'Comprehensive' }
]; 