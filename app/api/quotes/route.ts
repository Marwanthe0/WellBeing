import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { dailyQuotes } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const quotes = [
  'Every day is a new beginning. Take a deep breath, smile, and start again.',
  'You are stronger than you think, braver than you feel, and more loved than you know.',
  'Progress, not perfection, is what we should strive for.',
  'Your mental health is just as important as your physical health.',
  'It\'s okay to not be okay. What matters is that you\'re trying.',
  'Small steps every day lead to big changes over time.',
  'You have survived 100% of your difficult days so far. You\'re doing great.',
  'Be patient with yourself. Growth takes time.',
  'Your feelings are valid, and it\'s okay to feel them.',
  'Every small act of self-care is a victory worth celebrating.'
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    
    if (!date) {
      return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 });
    }

    // Check if quote exists for this date
    const existingQuote = await db
      .select()
      .from(dailyQuotes)
      .where(eq(dailyQuotes.date, date))
      .limit(1);

    if (existingQuote.length > 0) {
      return NextResponse.json({ quote: existingQuote[0].quote });
    }

    // Generate new quote for this date
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    
    // Store in database
    await db.insert(dailyQuotes).values({
      date,
      quote: randomQuote,
    });

    return NextResponse.json({ quote: randomQuote });
  } catch (error) {
    console.error('Error fetching daily quote:', error);
    return NextResponse.json(
      { error: 'Failed to fetch daily quote' },
      { status: 500 }
    );
  }
}