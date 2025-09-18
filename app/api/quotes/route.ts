import { NextRequest, NextResponse } from 'next/server';

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

    // Generate a consistent quote for the same date using a simple hash
    const dateHash = date.split('').reduce((hash, char) => {
      return hash + char.charCodeAt(0);
    }, 0);
    
    const quoteIndex = dateHash % quotes.length;
    const dailyQuote = quotes[quoteIndex];

    return NextResponse.json({ quote: dailyQuote });
  } catch (error) {
    console.error('Error fetching daily quote:', error);
    return NextResponse.json(
      { error: 'Failed to fetch daily quote' },
      { status: 500 }
    );
  }
}