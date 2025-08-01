import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { appointments } from '@/lib/db/schema';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { therapistId, date, time } = await request.json();

    if (!therapistId || !date || !time) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newAppointment = await db
      .insert(appointments)
      .values({
        userId: parseInt(session.user.id),
        therapistId: parseInt(therapistId),
        appointmentDate: `${date} ${time}`,
        status: 'scheduled',
      })
      .returning();

    return NextResponse.json(
      { message: 'Appointment booked successfully', appointment: newAppointment[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Appointment booking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}