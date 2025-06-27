import React from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { format, subDays, startOfDay } from 'date-fns';
import { useData } from '../contexts/DataContext';
import { TrendingUp, Calendar, Target, Award } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const { moodEntries } = useData();

  // Prepare data for the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = startOfDay(subDays(new Date(), 6 - i));
    const entry = moodEntries.find(entry => {
      const entryDate = startOfDay(new Date(entry.date));
      return entryDate.getTime() === date.getTime();
    });
    
    return {
      date: format(date, 'MMM dd'),
      score: entry ? entry.score : null,
      mood: entry ? entry.mood : null
    };
  });

  const lineChartData = {
    labels: last7Days.map(day => day.date),
    datasets: [
      {
        label: 'Mood Score',
        data: last7Days.map(day => day.score),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: 'white',
        pointBorderWidth: 2,
        pointRadius: 6,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        ticks: {
          stepSize: 1,
          callback: function(value: any) {
            const moodLabels = ['', 'Very Sad', 'Sad', 'Neutral', 'Happy', 'Very Happy'];
            return moodLabels[value] || '';
          },
        },
      },
    },
  };

  // Mood distribution
  const moodCounts = moodEntries.reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const doughnutData = {
    labels: Object.keys(moodCounts),
    datasets: [
      {
        data: Object.values(moodCounts),
        backgroundColor: [
          '#10B981', // Green
          '#8B5CF6', // Purple
          '#F59E0B', // Yellow
          '#EF4444', // Red
          '#3B82F6', // Blue
        ],
        borderWidth: 2,
        borderColor: 'white',
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
    },
  };

  // Calculate statistics
  const averageMood = moodEntries.length > 0 
    ? (moodEntries.reduce((sum, entry) => sum + entry.score, 0) / moodEntries.length).toFixed(1)
    : '0';

  const streak = calculateStreak();
  const weeklyAverage = last7Days.filter(day => day.score !== null).length > 0
    ? (last7Days.reduce((sum, day) => sum + (day.score || 0), 0) / last7Days.filter(day => day.score !== null).length).toFixed(1)
    : '0';

  function calculateStreak() {
    const today = new Date();
    let streakDays = 0;
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const hasEntry = moodEntries.some(entry => {
        const entryDate = new Date(entry.date);
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Wellness Dashboard</h1>
        <p className="text-lg text-gray-600">
          Track your progress and celebrate your journey to better mental health
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Streak</p>
              <p className="text-3xl font-bold text-blue-600">{streak}</p>
              <p className="text-sm text-gray-500">days</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Award className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Weekly Average</p>
              <p className="text-3xl font-bold text-green-600">{weeklyAverage}</p>
              <p className="text-sm text-gray-500">out of 5</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Entries</p>
              <p className="text-3xl font-bold text-purple-600">{moodEntries.length}</p>
              <p className="text-sm text-gray-500">recorded</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overall Average</p>
              <p className="text-3xl font-bold text-orange-600">{averageMood}</p>
              <p className="text-sm text-gray-500">out of 5</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Target className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Mood Trend Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">7-Day Mood Trend</h2>
          {moodEntries.length > 0 ? (
            <div className="h-64">
              <Line data={lineChartData} options={lineChartOptions} />
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="text-gray-400 text-4xl mb-4">📊</div>
                <p className="text-gray-600">Start logging your moods to see trends here</p>
              </div>
            </div>
          )}
        </div>

        {/* Mood Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Mood Distribution</h2>
          {moodEntries.length > 0 ? (
            <div className="h-64">
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="text-gray-400 text-4xl mb-4">📈</div>
                <p className="text-gray-600">Your mood distribution will appear here</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {moodEntries.length === 0 && (
        <div className="mt-8 text-center">
          <div className="bg-blue-50 rounded-xl p-8">
            <div className="text-blue-400 text-5xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-blue-900 mb-2">Start Your Wellness Journey</h3>
            <p className="text-blue-700 mb-4">
              Begin tracking your moods to unlock powerful insights about your mental health patterns
            </p>
            <a
              href="/mood"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Track Your First Mood
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;