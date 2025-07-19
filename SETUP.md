# AI Learning Platform Setup Guide

## Prerequisites
- Node.js 18+ installed
- A Google account for Gemini API access

## Getting Started

### 1. Install Dependencies
\`\`\`bash
npm install @google/generative-ai
\`\`\`

### 2. Get Your Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### 3. Configure Environment Variables
1. Copy `.env.example` to `.env.local`
2. Replace `your_gemini_api_key_here` with your actual API key

\`\`\`env
GEMINI_API_KEY=your_actual_api_key_here
\`\`\`

### 4. Deploy to Firebase (Optional)
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Build: `npm run build`
5. Deploy: `firebase deploy`

## API Features

### Text Summarizer
- Uses Gemini 1.5 Flash model for fast, accurate summarization
- Handles texts from 100 to 10,000+ words
- Provides compression ratio and statistics
- Includes error handling for API limits

### Roadmap Generator
- Creates personalized learning paths based on current knowledge
- Generates 3-tier progression (Beginner → Intermediate → Advanced)
- Supports 7 different technology tracks
- Includes fallback roadmaps for reliability

## Troubleshooting

### Common Issues
1. **"Gemini API key not configured"**: Check your `.env.local` file
2. **"API quota exceeded"**: You've hit the free tier limit, wait or upgrade
3. **"Invalid API key"**: Regenerate your key in Google AI Studio

### Rate Limits
- Free tier: 15 requests per minute
- Paid tier: Higher limits available

## Security Notes
- Never commit your API key to version control
- Use environment variables for all sensitive data
- Consider implementing rate limiting for production use
