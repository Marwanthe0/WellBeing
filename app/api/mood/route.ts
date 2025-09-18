import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { moodEntries } from '@/lib/db/schema';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { mood, score, notes } = await request.json();

    if (!mood || !score) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await db
      .insert(moodEntries)
      .values({
        userId: parseInt(session.user.id),
        mood: mood, // Use the mood as-is since schema now matches
        moodScore: score, // Updated field name
        notes: notes || null,
      });

    return NextResponse.json(
      { message: 'Mood entry created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Mood entry error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}