import { Dream } from '@/types/dream';

// Open or create the IndexedDB database
export function openDatabase() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open('DreamCatcherDB', 1);
    
    // Run on database upgrade (first creation or version change)
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      // Create object store for dreams if it doesn't exist
      if (!db.objectStoreNames.contains('dreams')) {
        const store = db.createObjectStore('dreams', { keyPath: 'id', autoIncrement: false });
        store.createIndex('date', 'date', { unique: false });
        store.createIndex('title', 'title', { unique: false });
      }
    };
    
    request.onsuccess = (event) => resolve((event.target as IDBOpenDBRequest).result);
    request.onerror = (event) => reject((event.target as IDBOpenDBRequest).error);
  });
}

// Add a new dream to the database
export async function saveDream(dream: Omit<Dream, 'id'>): Promise<Dream> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('dreams', 'readwrite');
    const store = transaction.objectStore('dreams');
    
    const dreamWithId = {
      ...dream,
      id: Date.now().toString() // Simple ID generation
    };
    
    const request = store.add(dreamWithId);
    
    request.onsuccess = () => resolve(dreamWithId);
    request.onerror = () => reject(request.error);
    
    transaction.oncomplete = () => db.close();
  });
}

// Get all dreams from the database
export async function getAllDreams(): Promise<Dream[]> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('dreams', 'readonly');
    const store = transaction.objectStore('dreams');
    const request = store.getAll();
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    
    transaction.oncomplete = () => db.close();
  });
}

// Update an existing dream
export async function updateDream(dream: Dream): Promise<Dream> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('dreams', 'readwrite');
    const store = transaction.objectStore('dreams');
    const request = store.put(dream);
    
    request.onsuccess = () => resolve(dream);
    request.onerror = () => reject(request.error);
    
    transaction.oncomplete = () => db.close();
  });
}

// Delete a dream by ID
export async function deleteDream(id: string): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('dreams', 'readwrite');
    const store = transaction.objectStore('dreams');
    const request = store.delete(id);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    
    transaction.oncomplete = () => db.close();
  });
}

// Export dreams to a JSON file
export function exportDreams(dreams: Dream[]): void {
  const json = JSON.stringify(dreams, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `dream-journal-export-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  
  URL.revokeObjectURL(url);
}

// Import dreams from a JSON file
export async function importDreams(file: File): Promise<Dream[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const dreams = JSON.parse(e.target?.result as string) as Dream[];
        const db = await openDatabase();
        const transaction = db.transaction('dreams', 'readwrite');
        const store = transaction.objectStore('dreams');
        
        // Add all dreams from the imported file
        for (const dream of dreams) {
          store.put(dream);
        }
        
        transaction.oncomplete = () => {
          db.close();
          resolve(dreams);
        };
        
        transaction.onerror = () => reject(transaction.error);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
} 