# Viral Hook Generator™

Created by Vasg-VG.

A simple AI-powered web application for content creators to generate viral-style hooks for TikTok, Instagram Reels, YouTube Shorts, and faceless content.

## Features

- Enter a niche or topic
- Generate 2 viral hooks per free generation
- Free plan includes 3 daily generations
- Upgrade to Pro via Stripe Checkout for monthly subscriptions
- Modern, premium dark UI with glassmorphism cards
- Mobile responsive

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local` and add your OpenAI and Stripe keys
4. Run the development server: `npm run dev`
5. Open `http://localhost:3000`

## Deploy

Deploy to Vercel by connecting your GitHub repo or using the Vercel CLI.

### Vercel deployment

1. Push this repository to GitHub.
2. Open Vercel and import the repo.
3. In your Vercel project settings, add the environment variable:
   - `OPENAI_API_KEY` = your OpenAI API key
4. Deploy the app.
5. Use the Vercel preview URL or production domain to access the generator.

Make sure to set the `OPENAI_API_KEY` in your deployment environment.

## Tech Stack

- Next.js
- Tailwind CSS
- OpenAI API
