# SlideCraft AI

A modern web application that converts PDF documents to engaging presentations using Google's Generative AI.

## Features

- PDF to presentation conversion
- Multiple presentation themes
- Customizable detail levels and audience targeting
- Export to PDF and HTML formats
- Firebase authentication and storage
- Responsive web interface

## Tech Stack

- **Frontend**: Next.js, React, TailwindCSS
- **Backend**: Node.js, Express
- **Cloud Services**: Firebase (Auth, Storage), Google Cloud (AI)
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
     FIREBASE_API_KEY=your_firebase_api_key
     FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
     FIREBASE_PROJECT_ID=your_firebase_project_id
     FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
     FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
     FIREBASE_APP_ID=your_firebase_app_id
     ```
4. Run the development server:
   ```
   npm run dev
   ```

## License

MIT 