"use client";

import { Dream } from '@/types/dream';

interface DreamListProps {
  dreams: Dream[];
  onSelect: (dream: Dream) => void;
  selectedDreamId: string | null;
  isLoading: boolean;
}

export default function DreamList({ dreams, onSelect, selectedDreamId, isLoading }: DreamListProps) {
  if (isLoading) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold text-text-primary mb-4">My Dreams</h2>
        <div className="text-text-secondary italic p-2">Loading dreams...</div>
      </div>
    );
  }

  // Sort dreams by date (newest first)
  const sortedDreams = [...dreams].sort((a, b) => {
    // Try to parse dates and compare them
    try {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    } catch {
      // Fallback to string comparison if parsing fails
      return b.date.localeCompare(a.date);
    }
  });

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold text-text-primary mb-4">My Dreams</h2>
      <div className="space-y-2">
        {sortedDreams.length === 0 ? (
          <p className="text-text-secondary italic">No dreams recorded yet</p>
        ) : (
          sortedDreams.map((dream) => (
            <button
              key={dream.id}
              onClick={() => onSelect(dream)}
              className={`w-full text-left p-3 rounded-md transition-colors ${
                selectedDreamId === dream.id
                  ? 'bg-hover text-text-primary'
                  : 'text-text-secondary hover:bg-hover hover:text-text-primary'
              }`}
            >
              <div className="font-medium">{dream.title}</div>
              <div className="text-sm opacity-75">{dream.date}</div>
            </button>
          ))
        )}
      </div>
    </div>
  );
} 