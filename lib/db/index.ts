import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';

const sqlite = new Database('./lib/db/database.db');
export const db = drizzle(sqlite, { schema });

// Initialize database with sample data
export async function initializeDatabase() {
  try {
    // Insert sample therapists
    const therapists = [
      {
        name: 'Dr. Sarah Johnson',
        specialization: 'Anxiety & Depression',
        email: 'sarah.johnson@wellbeing.com',
        availableDays: 'Monday,Wednesday,Friday'
      },
      {
        name: 'Dr. Michael Chen',
        specialization: 'Trauma & PTSD',
        email: 'michael.chen@wellbeing.com',
        availableDays: 'Tuesday,Thursday,Saturday'
      },
      {
        name: 'Dr. Emily Rodriguez',
        specialization: 'Relationship & Family Therapy',
        email: 'emily.rodriguez@wellbeing.com',
        availableDays: 'Monday,Tuesday,Thursday,Friday'
      },
      {
        name: 'Dr. James Wilson',
        specialization: 'Addiction & Recovery',
        email: 'james.wilson@wellbeing.com',
        availableDays: 'Monday,Wednesday,Thursday,Saturday'
      }
    ];

    for (const therapist of therapists) {
      await db.insert(schema.therapists).values(therapist).onConflictDoNothing();
    }

    // Insert sample suggestions
    const suggestions = [
      { mood: 'very_happy', tip: 'Share your happiness with others - it\'s contagious!' },
      { mood: 'very_happy', tip: 'Take a moment to reflect on what brought you joy today' },
      { mood: 'happy', tip: 'Keep up the positive momentum with some light exercise' },
      { mood: 'happy', tip: 'Connect with a friend or family member' },
      { mood: 'neutral', tip: 'Try some gentle movement like stretching or walking' },
      { mood: 'neutral', tip: 'Practice mindfulness or meditation for 5-10 minutes' },
      { mood: 'sad', tip: 'Be gentle with yourself - it\'s okay to feel sad sometimes' },
      { mood: 'sad', tip: 'Try some deep breathing exercises' },
      { mood: 'very_sad', tip: 'Remember that you\'re not alone in feeling this way' },
      { mood: 'very_sad', tip: 'Consider speaking with a mental health professional' }
    ];

    for (const suggestion of suggestions) {
      await db.insert(schema.suggestions).values(suggestion).onConflictDoNothing();
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}