import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { journals } from '@/lib/db/schema';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, content } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newJournalEntry = await db
      .insert(journals)
      .values({
        userId: parseInt(session.user.id),
        entryText: `${title}\n\n${content}`,
      })
      .returning();

    return NextResponse.json(
      { message: 'Journal entry created successfully', entry: newJournalEntry[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Journal entry error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}