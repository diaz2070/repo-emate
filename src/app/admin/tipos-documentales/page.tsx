'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, FileText, Calendar, Edit, Trash2, Archive } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface DocumentType {
  id: string;
  name: string;
  description?: string;
  documentCount: number;
  createdAt: string;
  updatedAt: string;
}

interface DocumentTypesResponse {
  documentTypes: DocumentType[];
  total: number;
}

export default function TiposDocumentalesPage() {
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'createdAt' | 'documentCount'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [total, setTotal] = useState(0);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const fetchDocumentTypes = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/admin/document-types');
      if (!response.ok) {
        toast.error('Error al cargar tipos documentales');
        return;
      }
      
      const data: DocumentTypesResponse = await response.json();
      if (data.documentTypes) {
        let fetchedTypes = data.documentTypes;
        console.log('Fetched document types:', fetchedTypes);
        
        // Client-side filtering
        if (searchTerm) {
          fetchedTypes = fetchedTypes.filter((type: DocumentType) =>
            type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (type.description?.toLowerCase().includes(searchTerm.toLowerCase()))
          );
        }
        
        // Client-side sorting
        fetchedTypes.sort((a: DocumentType, b: DocumentType) => {
          let aValue, bValue;
          if (sortBy === 'createdAt') {
            aValue = new Date(a.createdAt).getTime();
            bValue = new Date(b.createdAt).getTime();
          } else if (sortBy === 'documentCount') {
            aValue = a.documentCount;
            bValue = b.documentCount;
          } else {
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
          }
          
          if (sortOrder === 'asc') {
            return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
          } else {
            return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
          }
        });
        
        setDocumentTypes(fetchedTypes);
        setTotal(fetchedTypes.length);
      }
    } catch (error) {
      console.error('Error fetching document types:', error);
      toast.error('Error al cargar tipos documentales');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocumentTypes();
  }, [searchTerm, sortBy, sortOrder]);

  const handleSelectAll = () => {
    if (selectedTypes.length === documentTypes.length) {
      setSelectedTypes([]);
    } else {
      setSelectedTypes(documentTypes.map(type => type.id));
    }
  };

  const handleSelectType = (typeId: string) => {
    setSelectedTypes(prev => 
      prev.includes(typeId) 
        ? prev.filter(id => id !== typeId)
        : [...prev, typeId]
    );
  };

  const handleDeleteType = async (typeId: string, typeName: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar el tipo documental "${typeName}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/document-types/${typeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error || 'Error al eliminar tipo documental');
        return;
      }

      toast.success('Tipo documental eliminado exitosamente');
      fetchDocumentTypes();
    } catch (error) {
      console.error('Error deleting document type:', error);
      toast.error('Error al eliminar tipo documental');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando tipos documentales...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Tipo Documental
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gestiona los tipos documentales del sistema
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Crear documental
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Filtrar documentales"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Types Table */}
      <Card>
        <CardContent className="p-0">
          {documentTypes.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl font-medium text-gray-600 dark:text-gray-400 mb-2">
                {searchTerm ? 'No se encontraron tipos documentales' : 'No hay tipos documentales registrados'}
              </p>
              {!searchTerm && (
                <p className="text-gray-500 dark:text-gray-500">
                  Crea el primer tipo documental para comenzar
                </p>
              )}
            </div>
          ) : (
            <div className="overflow-hidden">
              {/* Table Header */}
              <div className="bg-gray-50 dark:bg-gray-800 px-6 py-3 border-b">
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-1">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      checked={selectedTypes.length === documentTypes.length}
                      onChange={handleSelectAll}
                    />
                  </div>
                  <div 
                    className="col-span-4 font-medium text-gray-900 dark:text-white cursor-pointer flex items-center gap-2"
                    onClick={() => {
                      setSortBy('name');
                      setSortOrder(sortBy === 'name' && sortOrder === 'asc' ? 'desc' : 'asc');
                    }}
                  >
                    Tipo Documental
                    {sortBy === 'name' && (
                      <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                  <div 
                    className="col-span-3 font-medium text-gray-900 dark:text-white cursor-pointer flex items-center gap-2"
                    onClick={() => {
                      setSortBy('createdAt');
                      setSortOrder(sortBy === 'createdAt' && sortOrder === 'asc' ? 'desc' : 'asc');
                    }}
                  >
                    Fecha de creación
                    {sortBy === 'createdAt' && (
                      <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                  <div 
                    className="col-span-3 font-medium text-gray-900 dark:text-white cursor-pointer flex items-center gap-2"
                    onClick={() => {
                      setSortBy('documentCount');
                      setSortOrder(sortBy === 'documentCount' && sortOrder === 'asc' ? 'desc' : 'asc');
                    }}
                  >
                    Cantidad de documentos
                    {sortBy === 'documentCount' && (
                      <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                  <div className="col-span-1 font-medium text-gray-900 dark:text-white">
                    Acciones
                  </div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {documentTypes.map((type, index) => (
                  <div key={type.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-1">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={selectedTypes.includes(type.id)}
                          onChange={() => handleSelectType(type.id)}
                        />
                      </div>
                      <div className="col-span-4">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {type.name}
                        </div>
                        {type.description && (
                          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {type.description}
                          </div>
                        )}
                      </div>
                      <div className="col-span-3">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(type.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="col-span-3">
                        <Badge variant="secondary" className="font-mono">
                          {type.documentCount} {type.documentCount === 1 ? 'documento' : 'documentos'}
                        </Badge>
                      </div>
                      <div className="col-span-1">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="Eliminar"
                            onClick={() => handleDeleteType(type.id, type.name)}
                            disabled={type.documentCount > 0}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Table Footer */}
              <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800 border-t flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedTypes.length > 0 
                    ? `${selectedTypes.length} de ${documentTypes.length} filas seleccionadas`
                    : `${total} tipos documentales encontrados`
                  }
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" disabled>
                    Anterior
                  </Button>
                  <Button variant="ghost" size="sm" disabled>
                    Siguiente
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}