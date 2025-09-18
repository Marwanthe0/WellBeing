'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Search, Plus, BookOpen, Calendar } from 'lucide-react';
import { Journal } from '@/lib/db/schema';

interface JournalPageProps {
  journalEntries: Journal[];
}

export function JournalPage({ journalEntries }: JournalPageProps) {
  const [isWriting, setIsWriting] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedEntry, setExpandedEntry] = useState<number | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    try {
      const response = await fetch('/api/journal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
        }),
      });

      if (response.ok) {
        setTitle('');
        setContent('');
        setIsWriting(false);
        router.refresh();
      }
    } catch (error) {
      console.error('Error saving journal entry:', error);
    }
  };

  const filteredEntries = journalEntries.filter(entry =>
    entry.entryText.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPreview = (content: string, wordLimit: number = 30) => {
    const words = content.split(' ');
    if (words.length <= wordLimit) return content;
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  const parseJournalEntry = (entryText: string) => {
    const lines = entryText.split('\n');
    const title = lines[0] || 'Untitled Entry';
    const content = lines.slice(2).join('\n') || entryText;
    return { title, content };
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Personal Journal</h1>
        <p className="text-lg text-gray-600">
          A safe space to reflect, process, and document your thoughts and feelings
        </p>
      </div>

      {/* Write New Entry */}
      {!isWriting ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <button
            onClick={() => setIsWriting(true)}
            className="w-full flex items-center justify-center space-x-2 py-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span className="font-medium">Write a new journal entry</span>
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">New Journal Entry</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Entry Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Give your entry a title..."
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Your Thoughts
              </label>
              <textarea
                id="content"
                rows={10}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Write about your day, your feelings, your thoughts... This is your safe space."
                required
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Save Entry
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsWriting(false);
                  setTitle('');
                  setContent('');
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      {journalEntries.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search your journal entries..."
            />
          </div>
        </div>
      )}

      {/* Journal Entries */}
      <div className="space-y-6">
        {filteredEntries.length === 0 && journalEntries.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="text-gray-400 text-5xl mb-4">
              <BookOpen className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Start Your Journal</h3>
            <p className="text-gray-600 mb-4">
              Writing can be a powerful tool for mental wellness. Start by sharing what&apos;s on your mind today.
            </p>
            <button
              onClick={() => setIsWriting(true)}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Write Your First Entry
            </button>
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="text-gray-400 text-4xl mb-4">🔍</div>
            <p className="text-gray-600">No entries match your search term.</p>
          </div>
        ) : (
          filteredEntries.map((entry) => {
            const { title, content } = parseJournalEntry(entry.entryText);
            return (
              <div key={entry.journalId} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {format(new Date(entry.entryDate), 'MMM dd, yyyy • h:mm a')}
                  </div>
                </div>
                
                <div className="text-gray-700 leading-relaxed">
                  {expandedEntry === entry.journalId ? (
                    <div>
                      <div className="whitespace-pre-wrap">{content}</div>
                      <button
                        onClick={() => setExpandedEntry(null)}
                        className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Show less
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="whitespace-pre-wrap">{getPreview(content)}</div>
                      {content.split(' ').length > 30 && (
                        <button
                          onClick={() => setExpandedEntry(entry.journalId)}
                          className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Read more
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}