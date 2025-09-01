'use client';

import { useEffect, useState } from 'react';
import { FolderOpen, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FolderData {
  id: string;
  name: string;
  description?: string;
  year: number;
  createdAt: string;
  _count: {
    documents: number;
  };
}

interface FolderListProps {
  user: any;
}

export default function FolderList({ user }: FolderListProps) {
  const [folders, setFolders] = useState<FolderData[]>([]);
  const [filteredFolders, setFilteredFolders] = useState<FolderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      const response = await fetch('/api/folders');
      
      if (!response.ok) {
        throw new Error('Failed to fetch folders');
      }
      
      const data = await response.json();
      setFolders(data);
      setFilteredFolders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFolder = () => {
    console.log('Create folder clicked');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredFolders(folders);
    } else {
      const filtered = folders.filter(folder => 
        folder.year.toString().includes(query) ||
        folder.name.toLowerCase().includes(query.toLowerCase()) ||
        folder.description?.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredFolders(filtered);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm min-h-[calc(100vh-200px)]">
          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex flex-1 items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors whitespace-nowrap">
                Búsqueda Avanzada
              </button>
            </div>
            
            <Button 
              className="flex items-center gap-2"
              onClick={handleCreateFolder}
            >
              <Plus className="w-4 h-4" />
              Crear Carpeta
            </Button>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 dark:text-red-400 mb-4">Error: {error}</p>
              <button
                onClick={fetchFolders}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Retry
              </button>
            </div>
          ) : filteredFolders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-yellow-500 dark:text-yellow-400 mb-4">
                <svg className="mx-auto h-16 w-16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z"/>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                {searchQuery ? 'No se encontraron carpetas' : 'No hay carpetas'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {searchQuery ? `No hay carpetas que coincidan con "${searchQuery}"` : 'Crea tu primera carpeta para comenzar.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 py-4">
              {filteredFolders.map((folder) => (
                <div
                  key={folder.id}
                  className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-6 hover:shadow-md dark:hover:shadow-lg cursor-pointer transition-all group flex flex-col items-center"
                >
                  <div className="mb-4 group-hover:scale-105 transition-transform">
                    <svg className="h-20 w-20" viewBox="0 0 24 24" fill="none">
                      <path 
                        d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" 
                        fill="#EAB308" 
                      />
                      <path 
                        d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" 
                        fill="url(#folderGradient)" 
                      />
                      <defs>
                        <linearGradient id="folderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#FDE047" />
                          <stop offset="50%" stopColor="#EAB308" />
                          <stop offset="100%" stopColor="#CA8A04" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
                    {folder.year}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

    </div>
  );
}