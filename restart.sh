#!/bin/sh

# Kill any running Next.js processes
echo "Stopping any running Next.js processes..."
pkill -f "node.*next"

# Set timeout to make sure processes are terminated
echo "Waiting for processes to terminate..."
sleep 2

# Start the development server with environment variables explicitly loaded
echo "Starting Next.js with environment variables..."
export GOOGLE_API_KEY="AIzaSyBaScj_-dVfG180veLDhCAnSr3av2wRBac"
export NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyDkDGFw9GQFkZg3WiImjX_MzN-WczNSp_Q"
export NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="pdftoslide-c3676.firebaseapp.com"
export NEXT_PUBLIC_FIREBASE_PROJECT_ID="pdftoslide-c3676"
export NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="pdftoslide-c3676.firebasestorage.app"
export NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="677295990657"
export NEXT_PUBLIC_FIREBASE_APP_ID="1:677295990657:web:717cfd09dc1c258c6a2a80"

npm run dev 