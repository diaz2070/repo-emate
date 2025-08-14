'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, FileText, Calendar, Edit, Trash2, Archive } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import CreateDocumentTypeForm from '@/components/admin/CreateDocumentTypeForm';

interface DocumentType {
  id: string;
  name: string;
  description?: string;
  documentCount: number;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface DocumentTypesResponse {
  documentTypes: DocumentType[];
  pagination: Pagination;
}

export default function TiposDocumentalesPage() {
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'createdAt' | 'documentCount'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 5,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });

  const fetchDocumentTypes = async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        search: searchTerm,
        sortBy: sortBy,
        sortOrder: sortOrder
      });
      
      const response = await fetch(`/api/admin/document-types?${params}`);
      if (!response.ok) {
        toast.error('Error al cargar tipos documentales');
        return;
      }
      
      const data: DocumentTypesResponse = await response.json();
      if (data.documentTypes && data.pagination) {
        console.log('Fetched document types:', data.documentTypes);
        console.log('Pagination info:', data.pagination);
        
        setDocumentTypes(data.documentTypes);
        setPagination(data.pagination);
        
        // Reset selections when data changes
        setSelectedTypes([]);
      }
    } catch (error) {
      console.error('Error fetching document types:', error);
      toast.error('Error al cargar tipos documentales');
    } finally {
      setLoading(false);
    }
  };

  // Reset to page 1 when search or sort changes
  useEffect(() => {
    if (pagination.page !== 1) {
      setPagination(prev => ({ ...prev, page: 1 }));
    }
  }, [searchTerm, sortBy, sortOrder]);

  useEffect(() => {
    fetchDocumentTypes();
  }, [pagination.page, searchTerm, sortBy, sortOrder]);

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

  const handleDocumentTypeCreated = () => {
    setShowCreateForm(false);
    fetchDocumentTypes();
  };

  const handleNextPage = () => {
    if (pagination.hasNext) {
      setPagination(prev => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const handlePrevPage = () => {
    if (pagination.hasPrev) {
      setPagination(prev => ({ ...prev, page: prev.page - 1 }));
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
        <Button 
          className="flex items-center gap-2"
          onClick={() => setShowCreateForm(true)}
        >
          <Plus className="w-4 h-4" />
          Nuevo tipo documental
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
                    : `Mostrando ${(pagination.page - 1) * pagination.limit + 1}-${Math.min(pagination.page * pagination.limit, pagination.total)} de ${pagination.total} tipos documentales`
                  }
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Página {pagination.page} de {pagination.totalPages}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    disabled={!pagination.hasPrev || loading}
                    onClick={handlePrevPage}
                    className="transition-all duration-200 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/20 dark:hover:text-blue-300 disabled:hover:bg-transparent disabled:hover:text-current"
                  >
                    Anterior
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    disabled={!pagination.hasNext || loading}
                    onClick={handleNextPage}
                    className="transition-all duration-200 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/20 dark:hover:text-blue-300 disabled:hover:bg-transparent disabled:hover:text-current"
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Document Type Form */}
      <CreateDocumentTypeForm
        open={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onDocumentTypeCreated={handleDocumentTypeCreated}
      />
    </div>
  );
}