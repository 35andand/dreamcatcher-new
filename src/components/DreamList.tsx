'use client';

import { format, parseISO } from 'date-fns';

interface Dream {
  id: string;
  date: string;
  title: string;
  content: string;
}

interface DreamListProps {
  dreams: Dream[];
  onSelect: (dream: Dream) => void;
  selectedDreamId?: string;
}

export default function DreamList({ dreams, onSelect, selectedDreamId }: DreamListProps) {
  const sortedDreams = [...dreams].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="h-full bg-gray-50 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">My Dreams</h2>
        <div className="space-y-2">
          {sortedDreams.map((dream) => (
            <button
              key={dream.id}
              onClick={() => onSelect(dream)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                selectedDreamId === dream.id
                  ? 'bg-blue-100 hover:bg-blue-200'
                  : 'hover:bg-gray-100'
              }`}
            >
              <p className="font-medium text-gray-900 truncate">{dream.title}</p>
              <p className="text-sm text-gray-500">
                {format(parseISO(dream.date), 'MMM d, yyyy')}
              </p>
            </button>
          ))}
          {dreams.length === 0 && (
            <p className="text-gray-500 text-center py-4">No dreams recorded yet</p>
          )}
        </div>
      </div>
    </div>
  );
} 