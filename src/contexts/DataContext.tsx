import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface MoodEntry {
  id: string;
  mood: string;
  score: number;
  notes: string;
  date: string;
}

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
}

interface Appointment {
  id: string;
  therapistId: string;
  date: string;
  time: string;
  status: string;
}

interface DataContextType {
  moodEntries: MoodEntry[];
  journalEntries: JournalEntry[];
  appointments: Appointment[];
  addMoodEntry: (mood: string, score: number, notes: string) => void;
  addJournalEntry: (title: string, content: string) => void;
  bookAppointment: (therapistId: string, date: string, time: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    if (user) {
      const moods = JSON.parse(localStorage.getItem(`wellbeing_moods_${user.id}`) || '[]');
      const journals = JSON.parse(localStorage.getItem(`wellbeing_journals_${user.id}`) || '[]');
      const appts = JSON.parse(localStorage.getItem(`wellbeing_appointments_${user.id}`) || '[]');
      
      setMoodEntries(moods);
      setJournalEntries(journals);
      setAppointments(appts);
    }
  }, [user]);

  const addMoodEntry = (mood: string, score: number, notes: string) => {
    if (!user) return;

    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      mood,
      score,
      notes,
      date: new Date().toISOString()
    };

    const updatedEntries = [newEntry, ...moodEntries];
    setMoodEntries(updatedEntries);
    localStorage.setItem(`wellbeing_moods_${user.id}`, JSON.stringify(updatedEntries));
  };

  const addJournalEntry = (title: string, content: string) => {
    if (!user) return;

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      title,
      content,
      date: new Date().toISOString()
    };

    const updatedEntries = [newEntry, ...journalEntries];
    setJournalEntries(updatedEntries);
    localStorage.setItem(`wellbeing_journals_${user.id}`, JSON.stringify(updatedEntries));
  };

  const bookAppointment = (therapistId: string, date: string, time: string) => {
    if (!user) return;

    const newAppointment: Appointment = {
      id: Date.now().toString(),
      therapistId,
      date,
      time,
      status: 'scheduled'
    };

    const updatedAppointments = [newAppointment, ...appointments];
    setAppointments(updatedAppointments);
    localStorage.setItem(`wellbeing_appointments_${user.id}`, JSON.stringify(updatedAppointments));
  };

  const value = {
    moodEntries,
    journalEntries,
    appointments,
    addMoodEntry,
    addJournalEntry,
    bookAppointment
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}