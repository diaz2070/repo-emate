'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import CreateDocumentTypeForm from '@/components/admin/CreateDocumentTypeForm';
import DataTable, { Column, Pagination } from '@/components/ui/DataTable';
import DeleteDialog from '@/components/ui/DeleteDialog';

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
  pagination: Pagination;
}

export default function TiposDocumentalesPage() {
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<DocumentType | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 5,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });

  const columns: Column<DocumentType>[] = [
    {
      key: 'name',
      label: 'Tipo Documental',
      sortable: true,
      className: '1fr',
      render: (item) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">
            {item.name}
          </div>
          {item.description && (
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {item.description}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'createdAt',
      label: 'Fecha de creación',
      sortable: true,
      className: '200px',
      render: (item) => (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {new Date(item.createdAt).toLocaleDateString()}
        </div>
      )
    },
    {
      key: 'documentCount',
      label: 'Cantidad de documentos',
      sortable: true,
      className: '200px',
      render: (item) => (
        <Badge variant="secondary" className="font-mono">
          {item.documentCount} {item.documentCount === 1 ? 'Documento' : 'Documentos'}
        </Badge>
      )
    }
  ];

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

  const handleDeleteClick = (item: DocumentType) => {
    if (item.documentCount > 0) {
      toast.error(`No se puede eliminar: este tipo está en uso por ${item.documentCount} ${item.documentCount === 1 ? 'documento' : 'documentos'}`);
      return;
    }
    
    setItemToDelete(item);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      const response = await fetch(`/api/admin/document-types/${itemToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error || 'Error al eliminar tipo documental');
        return;
      }

      toast.success('Tipo documental eliminado exitosamente');
      fetchDocumentTypes();
      setShowDeleteDialog(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Error deleting document type:', error);
      toast.error('Error al eliminar tipo documental');
      throw error;
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
    setItemToDelete(null);
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

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const renderActions = (item: DocumentType) => (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 transition-all duration-200 hover:scale-105 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/20 dark:hover:text-blue-300"
        title="Editar"
      >
        <Edit className="h-4 w-4 transition-transform duration-200" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={`h-8 w-8 p-0 transition-all duration-200 hover:scale-105 ${
          item.documentCount > 0 
            ? 'text-orange-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20' 
            : 'text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20'
        }`}
        title={item.documentCount > 0 ? "No se puede eliminar: tipo en uso" : "Eliminar"}
        onClick={() => handleDeleteClick(item)}
      >
        <Trash2 className="h-4 w-4 transition-transform duration-200" />
      </Button>
    </div>
  );

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

      {/* Data Table */}
      <DataTable
        data={documentTypes}
        columns={columns}
        loading={loading}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Filtrar documentales"
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
        pagination={pagination}
        onPageChange={handlePageChange}
        selectedItems={selectedTypes}
        onSelectAll={handleSelectAll}
        onSelectItem={handleSelectType}
        getItemId={(item) => item.id}
        emptyState={{
          icon: <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />,
          title: searchTerm ? 'No se encontraron tipos documentales' : 'No hay tipos documentales registrados',
          description: !searchTerm ? 'Crea el primer tipo documental para comenzar' : undefined
        }}
        actions={renderActions}
      />

      {/* Create Document Type Form */}
      <CreateDocumentTypeForm
        open={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onDocumentTypeCreated={handleDocumentTypeCreated}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        open={showDeleteDialog}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Tipo Documental"
        itemName={itemToDelete?.name}
        disabled={itemToDelete ? itemToDelete.documentCount > 0 : false}
        disabledReason={itemToDelete && itemToDelete.documentCount > 0 
          ? `Este tipo está en uso por ${itemToDelete.documentCount} ${itemToDelete.documentCount === 1 ? 'documento' : 'documentos'} y no puede ser eliminado.`
          : undefined
        }
      />
    </div>
  );
}