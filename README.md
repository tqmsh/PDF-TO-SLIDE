# SlideCraft AI

A modern web application that converts PDF documents to engaging presentations using Google's Generative AI.

## Features

- PDF to presentation conversion
- Multiple presentation themes (Classic, Corporate, Modern)
- Customizable detail levels and audience targeting
- Export to PDF and HTML formats using Marp
- Real-time AI-powered slide generation
- Responsive web interface

## Tech Stack

- **Frontend**: Next.js, React, TailwindCSS
- **AI Services**: Google Gemini AI API
- **Cloud Services**: Firebase (Storage)
- **Presentation Generation**: Marp CLI

## Setup

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables:
   - Create a `.env.local` file with the following variables:
     ```
     GOOGLE_API_KEY=your_google_api_key
     NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
     NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
     ```
4. Run the development server:
   ```
   npm run dev
   ```

## How It Works

1. **Upload PDF**: Start by uploading your PDF document
2. **Choose Settings**: Select content density, target audience, and visual style
3. **Generate Presentation**: AI analyzes your document and creates presentation slides
4. **Download/Print**: Export your presentation as PDF/HTML or print directly

## Firebase Setup

We use Firebase for storage and hosting:

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login to Firebase: `firebase login`
3. Initialize Firebase: `firebase init`
4. Deploy: `firebase deploy`

## Dependencies

- **@marp-team/marp-cli**: For rendering presentations as PDF and HTML
- **Google Gemini AI**: For intelligent content analysis
- **Firebase**: For storage and hosting
- **Next.js**: React framework with API routes
- **TailwindCSS**: For styling

## License

MIT 