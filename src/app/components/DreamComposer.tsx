"use client";

import { useState, useEffect } from 'react';
import { Dream } from '@/types/dream';

interface DreamComposerProps {
  onSave: (dream: { date: string; title: string; content: string }) => void;
  initialDream?: Dream;
}

export default function DreamComposer({ onSave, initialDream }: DreamComposerProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState(formatDateForInput(new Date()));
  
  // Format date for the input element (YYYY-MM-DD format)
  function formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }
  
  // Format date for display/storage (locale-specific format)
  function formatDateForDisplay(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }
  
  // If initialDream is provided, we're in edit mode
  useEffect(() => {
    if (initialDream) {
      setTitle(initialDream.title);
      setContent(initialDream.content);
      
      // Try to parse the date from the initialDream
      try {
        // Handle different date formats by attempting to create a Date object
        const dreamDate = new Date(initialDream.date);
        if (!isNaN(dreamDate.getTime())) {
          setDate(formatDateForInput(dreamDate));
        }
      } catch (error) {
        // If parsing fails, use today's date
        setDate(formatDateForInput(new Date()));
      }
    }
  }, [initialDream]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    onSave({
      date: formatDateForDisplay(date),
      title: title.trim(),
      content: content.trim(),
    });

    if (!initialDream) {
      // Only clear if we're creating a new dream, not editing
      setTitle('');
      setContent('');
      setDate(formatDateForInput(new Date()));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-text-primary mb-4">
        {initialDream ? 'Edit Dream' : 'Create New Dream'}
      </h2>
      <div className="mb-4">
        <label htmlFor="date" className="block text-text-primary mb-2">
          Date
        </label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 rounded-md bg-sidebar border border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-button-primary"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="title" className="block text-text-primary mb-2">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 rounded-md bg-sidebar border border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-button-primary"
          placeholder="Enter dream title"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="content" className="block text-text-primary mb-2">
          Dream Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-64 p-2 rounded-md bg-sidebar border border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-button-primary resize-none"
          placeholder="Describe your dream..."
          required
        />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-button-light text-main px-4 py-2 rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-button-light focus:ring-offset-2 focus:ring-offset-main transition-colors"
        >
          {initialDream ? 'Save Changes' : 'Save Dream'}
        </button>
      </div>
    </form>
  );
} 