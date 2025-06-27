import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { Lightbulb, Heart, Smile, Sun, RefreshCw } from 'lucide-react';

const Tips = () => {
  const { moodEntries } = useData();
  const [currentTip, setCurrentTip] = useState('');
  const [dailyQuote, setDailyQuote] = useState('');
  const [selectedMoodFilter, setSelectedMoodFilter] = useState('All');

  const tips = {
    'Very Happy': [
      'Share your happiness with others - it\'s contagious!',
      'Take a moment to reflect on what brought you joy today',
      'Consider writing down what made you feel so good',
      'Use this positive energy to tackle a challenging task',
      'Practice gratitude for the good things in your life'
    ],
    'Happy': [
      'Keep up the positive momentum with some light exercise',
      'Connect with a friend or family member',
      'Try learning something new while you\'re in this good mood',
      'Consider doing something kind for someone else',
      'Take some time to enjoy nature'
    ],
    'Neutral': [
      'Try some gentle movement like stretching or walking',
      'Practice mindfulness or meditation for 5-10 minutes',
      'Listen to music that usually lifts your spirits',
      'Reach out to a supportive friend or family member',
      'Engage in a hobby or activity you enjoy'
    ],
    'Sad': [
      'Be gentle with yourself - it\'s okay to feel sad sometimes',
      'Try some deep breathing exercises',
      'Consider taking a warm bath or shower',
      'Reach out to someone you trust for support',
      'Focus on small, achievable tasks to build momentum'
    ],
    'Very Sad': [
      'Remember that you\'re not alone in feeling this way',
      'Consider speaking with a mental health professional',
      'Try to get some sunlight, even if just by a window',
      'Focus on basic self-care: eating, sleeping, hygiene',
      'Use the crisis resources available if you need immediate help'
    ]
  };

  const quotes = [
    'Every day is a new beginning. Take a deep breath, smile, and start again.',
    'You are stronger than you think, braver than you feel, and more loved than you know.',
    'Progress, not perfection, is what we should strive for.',
    'Your mental health is just as important as your physical health.',
    'It\'s okay to not be okay. What matters is that you\'re trying.',
    'Small steps every day lead to big changes over time.',
    'You have survived 100% of your difficult days so far. You\'re doing great.',
    'Be patient with yourself. Growth takes time.',
    'Your feelings are valid, and it\'s okay to feel them.',
    'Every small act of self-care is a victory worth celebrating.'
  ];

  const todaysActivities = [
    { icon: Sun, title: '5-Minute Sun Break', description: 'Step outside and feel the warmth on your face' },
    { icon: Heart, title: 'Gratitude Practice', description: 'Write down 3 things you\'re grateful for today' },
    { icon: Smile, title: 'Call a Friend', description: 'Reach out to someone who makes you smile' },
    { icon: RefreshCw, title: 'Deep Breathing', description: 'Take 10 deep breaths and center yourself' }
  ];

  useEffect(() => {
    // Get daily quote (same quote per day)
    const today = new Date().toDateString();
    const savedQuote = localStorage.getItem(`daily_quote_${today}`);
    
    if (savedQuote) {
      setDailyQuote(savedQuote);
    } else {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setDailyQuote(randomQuote);
      localStorage.setItem(`daily_quote_${today}`, randomQuote);
    }

    // Get personalized tip based on recent mood
    const recentMood = moodEntries[0];
    if (recentMood) {
      const moodTips = tips[recentMood.mood as keyof typeof tips] || tips['Neutral'];
      const randomTip = moodTips[Math.floor(Math.random() * moodTips.length)];
      setCurrentTip(randomTip);
    } else {
      setCurrentTip('Start by tracking your mood to get personalized recommendations!');
    }
  }, [moodEntries]);

  const getFilteredTips = () => {
    if (selectedMoodFilter === 'All') {
      return Object.entries(tips).flatMap(([mood, tipList]) => 
        tipList.map(tip => ({ mood, tip }))
      );
    }
    return tips[selectedMoodFilter as keyof typeof tips]?.map(tip => ({ 
      mood: selectedMoodFilter, 
      tip 
    })) || [];
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
                Based on your {moodEntries[0].mood.toLowerCase()} mood
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Today's Activities */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Today's Wellness Activities</h2>
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
};

export default Tips;