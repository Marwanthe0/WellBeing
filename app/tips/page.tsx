import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { moodEntries, suggestions } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { TipsPage } from '@/components/TipsPage';

export default async function Tips() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const userMoodEntries = await db
    .select()
    .from(moodEntries)
    .where(eq(moodEntries.userId, parseInt(session.user.id)))
    .orderBy(desc(moodEntries.entryDate))
    .limit(1);

  const allSuggestions = await db.select().from(suggestions);

  return <TipsPage moodEntries={userMoodEntries} suggestions={allSuggestions} />;
}