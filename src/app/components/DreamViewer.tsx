"use client";

import { Dream } from '@/types/dream';

interface DreamViewerProps {
  dream: Dream;
  onEdit: () => void;
  onDelete: () => void;
}

export default function DreamViewer({ dream, onEdit, onDelete }: DreamViewerProps) {
  // Format the date for better display
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString(undefined, { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      }
      return dateString;
    } catch {
      return dateString;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">{dream.title}</h2>
          <p className="text-text-secondary">{formatDate(dream.date)}</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="px-3 py-1 rounded-md bg-sidebar border border-border text-text-primary hover:bg-hover focus:outline-none focus:ring-2 focus:ring-button-light focus:ring-offset-2 focus:ring-offset-main transition-colors"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="px-3 py-1 rounded-md bg-sidebar border border-border text-text-primary hover:bg-hover focus:outline-none focus:ring-2 focus:ring-button-light focus:ring-offset-2 focus:ring-offset-main transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
      <div className="prose prose-invert max-w-none">
        <p className="text-text-secondary whitespace-pre-wrap">{dream.content}</p>
      </div>
    </div>
  );
} 