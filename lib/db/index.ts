import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';

const connection = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'wellbeing',
  connectionLimit: 10,
});

export const db = drizzle(connection, { schema });

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
      await db.insert(schema.therapists).values(therapist).onDuplicateKeyUpdate({
        set: { name: therapist.name }
      });
    }

    // Insert sample suggestions
    const suggestions = [
      { mood: 'very_happy' as const, tip: 'Share your happiness with others - it\'s contagious!' },
      { mood: 'very_happy' as const, tip: 'Take a moment to reflect on what brought you joy today' },
      { mood: 'happy' as const, tip: 'Keep up the positive momentum with some light exercise' },
      { mood: 'happy' as const, tip: 'Connect with a friend or family member' },
      { mood: 'neutral' as const, tip: 'Try some gentle movement like stretching or walking' },
      { mood: 'neutral' as const, tip: 'Practice mindfulness or meditation for 5-10 minutes' },
      { mood: 'sad' as const, tip: 'Be gentle with yourself - it\'s okay to feel sad sometimes' },
      { mood: 'sad' as const, tip: 'Try some deep breathing exercises' },
      { mood: 'very_sad' as const, tip: 'Remember that you\'re not alone in feeling this way' },
      { mood: 'very_sad' as const, tip: 'Consider speaking with a mental health professional' }
    ];

    for (const suggestion of suggestions) {
      await db.insert(schema.suggestions).values(suggestion).onDuplicateKeyUpdate({
        set: { tip: suggestion.tip }
      });
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}