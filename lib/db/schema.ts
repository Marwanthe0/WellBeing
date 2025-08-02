import { sql } from 'drizzle-orm';
import { int, mysqlTable, varchar, text, timestamp, mysqlEnum } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  userId: int('user_id').primaryKey().autoincrement(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  age: int('age'),
  gender: mysqlEnum('gender', ['male', 'female', 'other', 'prefer_not_to_say']),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const journals = mysqlTable('journals', {
  journalId: int('journal_id').primaryKey().autoincrement(),
  userId: int('user_id').notNull().references(() => users.userId, { onDelete: 'cascade' }),
  entryText: text('entry_text').notNull(),
  entryDate: timestamp('entry_date').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const therapists = mysqlTable('therapists', {
  therapistId: int('therapist_id').primaryKey().autoincrement(),
  name: varchar('name', { length: 100 }).notNull(),
  specialization: varchar('specialization', { length: 100 }).notNull(),
  email: varchar('email', { length: 100 }).notNull(),
  availableDays: varchar('available_days', { length: 100 }),
});

export const appointments = mysqlTable('appointments', {
  appointmentId: int('appointment_id').primaryKey().autoincrement(),
  userId: int('user_id').notNull().references(() => users.userId, { onDelete: 'cascade' }),
  therapistId: int('therapist_id').notNull().references(() => therapists.therapistId, { onDelete: 'cascade' }),
  appointmentDate: varchar('appointment_date', { length: 50 }).notNull(),
  status: mysqlEnum('status', ['scheduled', 'completed', 'cancelled']).default('scheduled'),
});

export const suggestions = mysqlTable('suggestions', {
  suggestionId: int('suggestion_id').primaryKey().autoincrement(),
  mood: mysqlEnum('mood', ['very_happy', 'happy', 'neutral', 'sad', 'very_sad']).notNull(),
  tip: text('tip').notNull(),
});

export const moodEntries = mysqlTable('mood_entries', {
  moodId: int('mood_id').primaryKey().autoincrement(),
  userId: int('user_id').notNull().references(() => users.userId, { onDelete: 'cascade' }),
  mood: mysqlEnum('mood', ['very_happy', 'happy', 'neutral', 'sad', 'very_sad']).notNull(),
  score: int('score').notNull(),
  notes: text('notes'),
  entryDate: timestamp('entry_date').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const dailyQuotes = mysqlTable('daily_quotes', {
  quoteId: int('quote_id').primaryKey().autoincrement(),
  date: varchar('date', { length: 50 }).notNull().unique(),
  quote: text('quote').notNull(),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Journal = typeof journals.$inferSelect;
export type NewJournal = typeof journals.$inferInsert;
export type Therapist = typeof therapists.$inferSelect;
export type NewTherapist = typeof therapists.$inferInsert;
export type Appointment = typeof appointments.$inferSelect;
export type NewAppointment = typeof appointments.$inferInsert;
export type Suggestion = typeof suggestions.$inferSelect;
export type NewSuggestion = typeof suggestions.$inferInsert;
export type MoodEntry = typeof moodEntries.$inferSelect;
export type NewMoodEntry = typeof moodEntries.$inferInsert;
export type DailyQuote = typeof dailyQuotes.$inferSelect;
export type NewDailyQuote = typeof dailyQuotes.$inferInsert;