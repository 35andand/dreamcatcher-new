"use client";

import { useState, useEffect } from 'react';
import { Dream } from '@/types/dream';
import { getAllDreams, saveDream, updateDream, deleteDream, exportDreams, importDreams } from '@/lib/db';
import DreamList from '@/app/components/DreamList';
import DreamComposer from '@/app/components/DreamComposer';
import DreamViewer from '@/app/components/DreamViewer';

export default function Home() {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [selectedDream, setSelectedDream] = useState<Dream | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load dreams from IndexedDB on component mount
  useEffect(() => {
    const loadDreams = async () => {
      try {
        const loadedDreams = await getAllDreams();
        setDreams(loadedDreams);
      } catch (error) {
        console.error("Failed to load dreams:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDreams();
  }, []);

  // Handle saving a new dream
  const handleSaveDream = async (newDream: Omit<Dream, 'id'>) => {
    try {
      const savedDream = await saveDream(newDream);
      setDreams((prev) => [...prev, savedDream]);
      setIsComposing(false);
    } catch (error) {
      console.error("Failed to save dream:", error);
      alert("Failed to save your dream. Please try again.");
    }
  };

  // Handle updating an existing dream
  const handleUpdateDream = async (updatedDream: Dream) => {
    try {
      await updateDream(updatedDream);
      setDreams((prev) => prev.map(dream => 
        dream.id === updatedDream.id ? updatedDream : dream
      ));
      setSelectedDream(updatedDream);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update dream:", error);
      alert("Failed to update your dream. Please try again.");
    }
  };

  // Handle deleting a dream
  const handleDeleteDream = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this dream?")) {
      try {
        await deleteDream(id);
        setDreams((prev) => prev.filter(dream => dream.id !== id));
        if (selectedDream?.id === id) {
          setSelectedDream(null);
        }
      } catch (error) {
        console.error("Failed to delete dream:", error);
        alert("Failed to delete your dream. Please try again.");
      }
    }
  };

  // Handle exporting all dreams
  const handleExportDreams = () => {
    try {
      exportDreams(dreams);
    } catch (error) {
      console.error("Failed to export dreams:", error);
      alert("Failed to export your dreams. Please try again.");
    }
  };

  // Handle importing dreams from file
  const handleImportDreams = async (file: File) => {
    try {
      const importedDreams = await importDreams(file);
      setDreams((prev) => {
        // Create a map of existing dreams by ID for quick lookup
        const existingDreamsMap = new Map(prev.map(dream => [dream.id, dream]));
        
        // Merge imported dreams with existing ones, newer versions take precedence
        importedDreams.forEach(dream => existingDreamsMap.set(dream.id, dream));
        
        return Array.from(existingDreamsMap.values());
      });
      alert(`Successfully imported ${importedDreams.length} dreams.`);
    } catch (error) {
      console.error("Failed to import dreams:", error);
      alert("Failed to import dreams. Please check your file and try again.");
    }
  };

  return (
    <main className="min-h-screen bg-main">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 w-80 h-screen border-r border-border bg-sidebar overflow-y-auto">
        <div className="p-4 border-b border-border">
          <h1 className="text-xl font-bold text-text-primary">Dream Journal</h1>
          <p className="text-sm text-text-secondary">Your dreams, stored locally</p>
        </div>
        <DreamList
          dreams={dreams}
          isLoading={isLoading}
          onSelect={(dream) => {
            setSelectedDream(dream);
            setIsComposing(false);
            setIsEditing(false);
          }}
          selectedDreamId={selectedDream?.id || null}
        />
        <div className="p-4 border-t border-border">
          <button
            onClick={() => {
              setIsComposing(true);
              setSelectedDream(null);
              setIsEditing(false);
            }}
            className="w-full bg-button-light text-main px-4 py-2 rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-button-light focus:ring-offset-2 focus:ring-offset-main transition-colors mb-2"
          >
            New Dream
          </button>
          <div className="flex space-x-2">
            <button
              onClick={handleExportDreams}
              className="flex-1 text-sm bg-sidebar border border-border text-text-primary px-2 py-1 rounded-md hover:bg-hover focus:outline-none focus:ring-1 focus:ring-button-light transition-colors"
              disabled={dreams.length === 0}
            >
              Export
            </button>
            <label className="flex-1">
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleImportDreams(file);
                  }
                  // Reset the input value so the same file can be selected again
                  e.target.value = '';
                }}
              />
              <span className="block text-center text-sm bg-sidebar border border-border text-text-primary px-2 py-1 rounded-md hover:bg-hover focus:outline-none focus:ring-1 focus:ring-button-light transition-colors cursor-pointer">
                Import
              </span>
            </label>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="ml-80 min-h-screen bg-main">
        {/* Content Area */}
        <div className="p-6">
          {isLoading ? (
            <div className="text-center text-text-secondary mt-20">
              <p>Loading your dreams...</p>
            </div>
          ) : isComposing ? (
            <DreamComposer onSave={handleSaveDream} />
          ) : isEditing && selectedDream ? (
            <DreamComposer 
              onSave={(dream) => handleUpdateDream({ ...dream, id: selectedDream.id })} 
              initialDream={selectedDream}
            />
          ) : selectedDream ? (
            <DreamViewer 
              dream={selectedDream} 
              onEdit={() => setIsEditing(true)}
              onDelete={() => handleDeleteDream(selectedDream.id)}
            />
          ) : (
            <div className="text-center text-text-secondary mt-20">
              <p>Select a dream from the sidebar to view it</p>
              <p>or click "New Dream" to create one</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
