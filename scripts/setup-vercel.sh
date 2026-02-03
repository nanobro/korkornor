#!/bin/bash

echo "🚀 Setting up korkornor on Vercel..."
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm i -g vercel
fi

# Link to project
echo "🔗 Linking to Vercel project..."
vercel link

# Set environment variables
echo ""
echo "🔐 Setting environment variables..."
echo "Please enter your credentials:"
echo ""

read -p "Supabase URL: " supabase_url
read -p "Supabase Anon Key: " supabase_anon
read -p "Supabase Service Role Key: " supabase_service
read -p "Gemini API Key: " gemini_key
read -p "Vercel Blob Token: " blob_token

vercel env add NEXT_PUBLIC_SUPABASE_URL production <<< "$supabase_url"
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production <<< "$supabase_anon"
vercel env add SUPABASE_SERVICE_ROLE_KEY production <<< "$supabase_service"
vercel env add GEMINI_API_KEY production <<< "$gemini_key"
vercel env add BLOB_READ_WRITE_TOKEN production <<< "$blob_token"

echo ""
echo "📦 Deploying..."
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo "Your site is live at: https://korkornor.vercel.app"
