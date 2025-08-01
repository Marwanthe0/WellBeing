import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { moodEntries } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { HomePage } from '@/components/HomePage';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const userMoodEntries = await db
    .select()
    .from(moodEntries)
    .where(eq(moodEntries.userId, parseInt(session.user.id)))
    .orderBy(desc(moodEntries.entryDate));

  return <HomePage moodEntries={userMoodEntries} user={session.user} />;
}