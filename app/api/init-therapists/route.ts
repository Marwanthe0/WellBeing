import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { therapists } from '@/lib/db/schema';
import { initializeDatabase } from '@/lib/db';

export async function GET() {
  try {
    // First try to get existing therapists
    const existingTherapists = await db.select().from(therapists);
    
    // If no therapists exist, initialize the database
    if (existingTherapists.length === 0) {
      await initializeDatabase();
      const newTherapists = await db.select().from(therapists);
      return NextResponse.json({
        message: 'Database initialized with therapists',
        therapists: newTherapists,
        count: newTherapists.length
      });
    }
    
    return NextResponse.json({
      message: 'Therapists found',
      therapists: existingTherapists,
      count: existingTherapists.length
    });
  } catch (error) {
    console.error('Therapist check error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}