import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text, primaryKey } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  userId: integer('user_id').primaryKey({ autoIncrement: true }),
  name: text('name', { length: 100 }).notNull(),
  email: text('email', { length: 100 }).notNull().unique(),
  passwordHash: text('password_hash', { length: 255 }).notNull(),
  age: integer('age'),
  gender: text('gender', { enum: ['male', 'female', 'other', 'prefer_not_to_say'] }),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const journals = sqliteTable('journals', {
  journalId: integer('journal_id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.userId, { onDelete: 'cascade' }),
  entryText: text('entry_text').notNull(),
  entryDate: text('entry_date').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const therapists = sqliteTable('therapists', {
  therapistId: integer('therapist_id').primaryKey({ autoIncrement: true }),
  name: text('name', { length: 100 }).notNull(),
  specialization: text('specialization', { length: 100 }).notNull(),
  email: text('email', { length: 100 }).notNull(),
  availableDays: text('available_days', { length: 100 }),
});

export const appointments = sqliteTable('appointments', {
  appointmentId: integer('appointment_id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.userId, { onDelete: 'cascade' }),
  therapistId: integer('therapist_id').notNull().references(() => therapists.therapistId, { onDelete: 'cascade' }),
  appointmentDate: text('appointment_date').notNull(),
  status: text('status', { enum: ['scheduled', 'completed', 'cancelled'] }).default('scheduled'),
});

export const suggestions = sqliteTable('suggestions', {
  suggestionId: integer('suggestion_id').primaryKey({ autoIncrement: true }),
  mood: text('mood', { enum: ['very_happy', 'happy', 'neutral', 'sad', 'very_sad'] }).notNull(),
  tip: text('tip').notNull(),
});

export const moodEntries = sqliteTable('mood_entries', {
  moodId: integer('mood_id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.userId, { onDelete: 'cascade' }),
  mood: text('mood', { enum: ['very_happy', 'happy', 'neutral', 'sad', 'very_sad'] }).notNull(),
  score: integer('score').notNull(),
  notes: text('notes'),
  entryDate: text('entry_date').default(sql`CURRENT_TIMESTAMP`).notNull(),
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