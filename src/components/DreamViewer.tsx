'use client';

import { format, parseISO } from 'date-fns';

interface Dream {
  id: string;
  date: string;
  title: string;
  content: string;
}

interface DreamViewerProps {
  dream: Dream;
}

export default function DreamViewer({ dream }: DreamViewerProps) {
  return (
    <div className="space-y-4 p-6 max-w-2xl mx-auto">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date
        </label>
        <div className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-900">
          {format(parseISO(dream.date), 'MMMM d, yyyy')}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Dream Title
        </label>
        <div className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-900">
          {dream.title}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Dream Description
        </label>
        <div className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-900 whitespace-pre-wrap min-h-[150px]">
          {dream.content}
        </div>
      </div>
    </div>
  );
} 