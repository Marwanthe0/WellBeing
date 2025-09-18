import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { appointments } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userAppointments = await db
      .select()
      .from(appointments)
      .where(eq(appointments.userId, parseInt(session.user.id)));

    return NextResponse.json({ appointments: userAppointments });
  } catch (error) {
    console.error('Appointment fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log('Appointment booking request:', body);
    console.log('User ID:', session.user.id);
    
    const { therapistId, date, time } = body;

    if (!therapistId || !date || !time) {
      console.log('Missing fields:', { therapistId, date, time });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create a proper datetime by combining date and time
    const appointmentDateTime = new Date(`${date}T${time}:00`);
    console.log('Appointment datetime:', appointmentDateTime);
    
    // Validate the date is in the future
    if (appointmentDateTime <= new Date()) {
      return NextResponse.json(
        { error: 'Appointment must be in the future' },
        { status: 400 }
      );
    }

    console.log('Inserting appointment:', {
      userId: parseInt(session.user.id),
      therapistId: parseInt(therapistId),
      appointmentDate: appointmentDateTime,
      status: 'Pending',
    });

    await db
      .insert(appointments)
      .values({
        userId: parseInt(session.user.id),
        therapistId: parseInt(therapistId),
        appointmentDate: appointmentDateTime,
        status: 'Pending',
      });

    console.log('Appointment created successfully');

    return NextResponse.json(
      { message: 'Appointment booked successfully' },
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