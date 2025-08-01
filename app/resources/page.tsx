import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { therapists, appointments } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { ResourcesPage } from '@/components/ResourcesPage';

export default async function Resources() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const allTherapists = await db.select().from(therapists);
  const userAppointments = await db
    .select()
    .from(appointments)
    .where(eq(appointments.userId, parseInt(session.user.id)));

  return <ResourcesPage therapists={allTherapists} appointments={userAppointments} />;
}