import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const parseHooks = (text: string) => {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^[0-9]+[\).\-\s]*|^[-*\s]+/, '').trim());

  return lines.length > 0 ? lines : text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
};

export async function POST(request: NextRequest) {
  const body = await request.json();
  const niche = typeof body?.niche === 'string' ? body.niche.trim() : '';

  if (!niche) {
    return NextResponse.json({ error: 'Niche is required' }, { status: 400 });
  }

  const prompt = `Generate 2 viral-style hooks for ${niche} content creation, suitable for TikTok, Instagram Reels, YouTube Shorts, and faceless content creators. Make them engaging, clickbait-y, and designed to grab attention quickly. Format as a numbered list.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
    });

    const response = completion.choices?.[0]?.message?.content?.trim();
    if (!response) {
      return NextResponse.json({ error: 'No response from OpenAI' }, { status: 500 });
    }

    const hooks = parseHooks(response);
    return NextResponse.json({ hooks });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to generate hooks' }, { status: 500 });
  }
}