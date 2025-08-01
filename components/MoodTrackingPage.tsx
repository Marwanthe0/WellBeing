'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { MoodEntry } from '@/lib/db/schema';

interface MoodTrackingPageProps {
  moodEntries: MoodEntry[];
}

export function MoodTrackingPage({ moodEntries }: MoodTrackingPageProps) {
  const [selectedMood, setSelectedMood] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const moods = [
    { emoji: '😄', label: 'Very Happy', score: 5, color: 'bg-green-100 border-green-300 text-green-800' },
    { emoji: '😊', label: 'Happy', score: 4, color: 'bg-green-50 border-green-200 text-green-700' },
    { emoji: '😐', label: 'Neutral', score: 3, color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
    { emoji: '😔', label: 'Sad', score: 2, color: 'bg-orange-50 border-orange-200 text-orange-700' },
    { emoji: '😢', label: 'Very Sad', score: 1, color: 'bg-red-50 border-red-200 text-red-700' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMood) return;

    setIsSubmitting(true);
    
    const mood = moods.find(m => m.label === selectedMood);
    if (mood) {
      try {
        const response = await fetch('/api/mood', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            mood: mood.label,
            score: mood.score,
            notes,
          }),
        });

        if (response.ok) {
          setSelectedMood('');
          setNotes('');
          router.refresh();
        }
      } catch (error) {
        console.error('Error saving mood entry:', error);
      }
    }
    
    setIsSubmitting(false);
  };

  const getMoodEmoji = (mood: string) => {
    const moodMap: Record<string, string> = {
      'very_happy': '😄',
      'happy': '😊',
      'neutral': '😐',
      'sad': '😔',
      'very_sad': '😢'
    };
    return moodMap[mood] || '😐';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">How are you feeling today?</h1>
        <p className="text-lg text-gray-600">
          Take a moment to check in with your emotions. Your feelings are valid and important.
        </p>
      </div>

      {/* Mood Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Select your current mood</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {moods.map((mood) => (
              <label
                key={mood.label}
                className={`cursor-pointer rounded-lg border-2 p-4 text-center transition-all hover:shadow-md ${
                  selectedMood === mood.label
                    ? `${mood.color} border-opacity-100 shadow-md`
                    : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="mood"
                  value={mood.label}
                  checked={selectedMood === mood.label}
                  onChange={(e) => setSelectedMood(e.target.value)}
                  className="sr-only"
                />
                <div className="text-4xl mb-2">{mood.emoji}</div>
                <div className="font-medium text-sm">{mood.label}</div>
              </label>
            ))}
          </div>

          <div className="mb-6">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Additional notes (optional)
            </label>
            <textarea
              id="notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="What's on your mind? Describe what's influencing your mood today..."
            />
          </div>

          <button
            type="submit"
            disabled={!selectedMood || isSubmitting}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Saving...' : 'Save Mood Entry'}
          </button>
        </form>
      </div>

      {/* Recent Entries */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Mood Entries</h2>
        
        {moodEntries.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-lg mb-2">📝</div>
            <p className="text-gray-600">No mood entries yet. Start by logging your first mood above!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {moodEntries.map((entry) => (
              <div key={entry.moodId} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl">{getMoodEmoji(entry.mood)}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-gray-900 capitalize">{entry.mood.replace('_', ' ')}</h3>
                    <span className="text-sm text-gray-500">
                      {format(new Date(entry.entryDate), 'MMM dd, yyyy • h:mm a')}
                    </span>
                  </div>
                  {entry.notes && (
                    <p className="text-gray-600 text-sm">{entry.notes}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}