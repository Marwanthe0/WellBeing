'use client';

import React, { useState, useEffect } from 'react';
import { Lightbulb, Heart, Smile, Sun, RefreshCw } from 'lucide-react';
import { MoodEntry, Suggestion } from '@/lib/db/schema';

interface TipsPageProps {
  moodEntries: MoodEntry[];
  suggestions: Suggestion[];
}

export function TipsPage({ moodEntries, suggestions }: TipsPageProps) {
  const [currentTip, setCurrentTip] = useState('');
  const [dailyQuote, setDailyQuote] = useState('');
  const [selectedMoodFilter, setSelectedMoodFilter] = useState('All');

  const todaysActivities = [
    { icon: Sun, title: '5-Minute Sun Break', description: 'Step outside and feel the warmth on your face' },
    { icon: Heart, title: 'Gratitude Practice', description: 'Write down 3 things you&apos;re grateful for today' },
    { icon: Smile, title: 'Call a Friend', description: 'Reach out to someone who makes you smile' },
    { icon: RefreshCw, title: 'Deep Breathing', description: 'Take 10 deep breaths and center yourself' }
  ];

  useEffect(() => {
    // Get daily quote from database API
    const fetchDailyQuote = async () => {
      try {
        const today = new Date().toDateString();
        const response = await fetch(`/api/quotes?date=${encodeURIComponent(today)}`);
        
        if (response.ok) {
          const data = await response.json();
          setDailyQuote(data.quote);
        } else {
          // Fallback quote if API fails
          setDailyQuote('Every day is a new beginning. Take a deep breath, smile, and start again.');
        }
      } catch (error) {
        console.error('Error fetching daily quote:', error);
        // Fallback quote if API fails
        setDailyQuote('Every day is a new beginning. Take a deep breath, smile, and start again.');
      }
    };

    fetchDailyQuote();

    // Get personalized tip based on recent mood
    const recentMood = moodEntries[0];
    if (recentMood) {
      const moodSuggestions = suggestions.filter(s => s.mood === recentMood.mood);
      if (moodSuggestions.length > 0) {
        const randomTip = moodSuggestions[Math.floor(Math.random() * moodSuggestions.length)];
        setCurrentTip(randomTip.tip);
      }
    } else {
      setCurrentTip('Start by tracking your mood to get personalized recommendations!');
    }
  }, [moodEntries, suggestions]);

  const getFilteredTips = () => {
    if (selectedMoodFilter === 'All') {
      return suggestions.map(suggestion => ({
        mood: suggestion.mood.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        tip: suggestion.tip
      }));
    }
    const filterMood = selectedMoodFilter.toLowerCase().replace(' ', '_');
    return suggestions
      .filter(s => s.mood === filterMood)
      .map(suggestion => ({
        mood: suggestion.mood.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        tip: suggestion.tip
      }));
  };

  const getMoodColor = (mood: string) => {
    const colors = {
      'Very Happy': 'bg-green-100 text-green-800 border-green-200',
      'Happy': 'bg-green-50 text-green-700 border-green-200',
      'Neutral': 'bg-yellow-50 text-yellow-700 border-yellow-200',
      'Sad': 'bg-orange-50 text-orange-700 border-orange-200',
      'Very Sad': 'bg-red-50 text-red-700 border-red-200'
    };
    return colors[mood as keyof typeof colors] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Wellness Tips & Inspiration</h1>
        <p className="text-lg text-gray-600">
          Personalized recommendations to support your mental wellness journey
        </p>
      </div>

      {/* Daily Quote */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white mb-8">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-white bg-opacity-20 rounded-full">
            <Lightbulb className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-3">Daily Inspiration</h2>
            <p className="text-lg leading-relaxed">{dailyQuote}</p>
          </div>
        </div>
      </div>

      {/* Personalized Tip */}
      {moodEntries.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Personalized Tip Based on Your Recent Mood
          </h2>
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Heart className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-700 text-lg leading-relaxed">{currentTip}</p>
              <p className="text-sm text-gray-500 mt-2">
                Based on your {moodEntries[0].mood.replace('_', ' ').toLowerCase()} mood
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Today's Activities */}
      <div className="mb-8">
  <h2 className="text-2xl font-bold text-gray-900 mb-6">Today&apos;s Wellness Activities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {todaysActivities.map((activity, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="p-3 bg-green-100 rounded-full inline-block mb-4">
                <activity.icon className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{activity.title}</h3>
              <p className="text-gray-600">{activity.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tips by Mood */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Tips by Mood</h2>
          <select
            value={selectedMoodFilter}
            onChange={(e) => setSelectedMoodFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="All">All Moods</option>
            <option value="Very Happy">Very Happy</option>
            <option value="Happy">Happy</option>
            <option value="Neutral">Neutral</option>
            <option value="Sad">Sad</option>
            <option value="Very Sad">Very Sad</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {getFilteredTips().map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getMoodColor(item.mood)}`}>
                  {item.mood}
                </span>
              </div>
              <p className="text-gray-700 mt-3 leading-relaxed">{item.tip}</p>
            </div>
          ))}
        </div>

        {getFilteredTips().length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-4">💡</div>
            <p className="text-gray-600">No tips available for the selected mood filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}