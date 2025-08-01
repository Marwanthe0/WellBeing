import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { journals } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { JournalPage } from '@/components/JournalPage';

export default async function Journal() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const userJournals = await db
    .select()
    .from(journals)
    .where(eq(journals.userId, parseInt(session.user.id)))
    .orderBy(desc(journals.entryDate));

  return <JournalPage journalEntries={userJournals} />;
}