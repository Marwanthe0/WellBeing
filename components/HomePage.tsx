'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, BarChart3, BookOpen, Users, ArrowRight, Sparkles } from 'lucide-react';
import { MoodEntry } from '@/lib/db/schema';

interface HomePageProps {
  moodEntries: MoodEntry[];
  user: { name: string };
}

export function HomePage({ moodEntries, user }: HomePageProps) {
  const recentMood = moodEntries[0];
  const streak = calculateStreak(moodEntries);

  function calculateStreak(entries: MoodEntry[]) {
    const today = new Date();
    let streakDays = 0;
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const hasEntry = entries.some(entry => {
        const entryDate = new Date(entry.entryDate);
        return entryDate.toDateString() === checkDate.toDateString();
      });
      
      if (hasEntry) {
        streakDays++;
      } else if (i > 0) {
        break;
      }
    }
    
    return streakDays;
  }

  const quickActions = [
    {
      title: 'Track Your Mood',
      description: 'Log how you\'re feeling today',
      icon: Heart,
      link: '/mood',
      color: 'bg-pink-100 text-pink-600'
    },
    {
      title: 'View Progress',
      description: 'See your wellness analytics',
      icon: BarChart3,
      link: '/dashboard',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Write in Journal',
      description: 'Reflect on your thoughts',
      icon: BookOpen,
      link: '/journal',
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Find Resources',
      description: 'Connect with therapists',
      icon: Users,
      link: '/resources',
      color: 'bg-purple-100 text-purple-600'
    }
  ];

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <Sparkles className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome back, {user.name}!
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Take a moment to check in with yourself. Your mental wellness journey continues here.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Streak</p>
              <p className="text-3xl font-bold text-blue-600">{streak} days</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Heart className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Keep up the great work!</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Entries</p>
              <p className="text-3xl font-bold text-green-600">{moodEntries.length}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Tracking your progress</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Latest Mood</p>
              <p className="text-3xl font-bold text-purple-600">
                {recentMood ? getMoodEmoji(recentMood.mood) : 'N/A'}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Heart className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {recentMood ? new Date(recentMood.entryDate).toLocaleDateString() : 'Start tracking'}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              href={action.link}
              className="group bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className={`inline-flex p-3 rounded-lg ${action.color} mb-4`}>
                <action.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
              <p className="text-gray-600 mb-4">{action.description}</p>
              <div className="flex items-center text-blue-600 group-hover:text-blue-700">
                <span className="text-sm font-medium">Get started</span>
                <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-4">Ready to start your day?</h2>
        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
          Begin by tracking your current mood and setting positive intentions for the day ahead.
        </p>
        <Link
          href="/mood"
          className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
        >
          Start Tracking
          <ArrowRight className="h-5 w-5 ml-2" />
        </Link>
      </div>
    </div>
  );
}