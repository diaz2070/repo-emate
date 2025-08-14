'use client';

import { ReactNode, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search } from 'lucide-react';

export interface Column<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => ReactNode;
  className?: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSort: (key: string) => void;
  pagination: Pagination;
  onPageChange: (page: number) => void;
  selectedItems: string[];
  onSelectAll: () => void;
  onSelectItem: (id: string) => void;
  getItemId: (item: T) => string;
  emptyState: {
    icon: ReactNode;
    title: string;
    description?: string;
  };
  actions?: (item: T) => ReactNode;
}

export default function DataTable<T>({
  data,
  columns,
  loading = false,
  searchTerm,
  onSearchChange,
  searchPlaceholder = "Buscar...",
  sortBy,
  sortOrder,
  onSort,
  pagination,
  onPageChange,
  selectedItems,
  onSelectAll,
  onSelectItem,
  getItemId,
  emptyState,
  actions
}: DataTableProps<T>) {
  const handleNextPage = () => {
    if (pagination.hasNext) {
      onPageChange(pagination.page + 1);
    }
  };

  const handlePrevPage = () => {
    if (pagination.hasPrev) {
      onPageChange(pagination.page - 1);
    }
  };

  const renderCellValue = (item: T, column: Column<T>) => {
    if (column.render) {
      return column.render(item);
    }
    
    const value = column.key.includes('.') 
      ? column.key.split('.').reduce((obj: any, key) => obj?.[key], item)
      : (item as any)[column.key];
    
    return value;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {data.length === 0 ? (
            <div className="text-center py-12">
              {emptyState.icon}
              <p className="text-xl font-medium text-gray-600 dark:text-gray-400 mb-2">
                {emptyState.title}
              </p>
              {emptyState.description && (
                <p className="text-gray-500 dark:text-gray-500">
                  {emptyState.description}
                </p>
              )}
            </div>
          ) : (
            <div className="overflow-hidden">
              {/* Table Header */}
              <div className="bg-gray-50 dark:bg-gray-800 px-6 py-3 border-b">
                <div className="grid gap-4 items-center" style={{ gridTemplateColumns: `auto ${columns.map(col => col.className || '1fr').join(' ')} ${actions ? 'auto' : ''}` }}>
                  <div>
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      checked={selectedItems.length === data.length && data.length > 0}
                      onChange={onSelectAll}
                    />
                  </div>
                  {columns.map((column) => (
                    <div 
                      key={String(column.key)}
                      className={`font-medium text-gray-900 dark:text-white ${column.sortable ? 'cursor-pointer flex items-center gap-2' : ''}`}
                      onClick={() => column.sortable && onSort(String(column.key))}
                    >
                      {column.label}
                      {column.sortable && sortBy === column.key && (
                        <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  ))}
                  {actions && (
                    <div className="font-medium text-gray-900 dark:text-white">
                      Acciones
                    </div>
                  )}
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {data.map((item) => {
                  const itemId = getItemId(item);
                  return (
                    <div key={itemId} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="grid gap-4 items-center" style={{ gridTemplateColumns: `auto ${columns.map(col => col.className || '1fr').join(' ')} ${actions ? 'auto' : ''}` }}>
                        <div>
                          <input
                            type="checkbox"
                            className="rounded border-gray-300"
                            checked={selectedItems.includes(itemId)}
                            onChange={() => onSelectItem(itemId)}
                          />
                        </div>
                        {columns.map((column) => (
                          <div key={String(column.key)}>
                            {renderCellValue(item, column)}
                          </div>
                        ))}
                        {actions && (
                          <div>
                            {actions(item)}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Table Footer */}
              <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800 border-t flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedItems.length > 0 
                    ? `${selectedItems.length} de ${data.length} filas seleccionadas`
                    : `Mostrando ${(pagination.page - 1) * pagination.limit + 1}-${Math.min(pagination.page * pagination.limit, pagination.total)} de ${pagination.total} elementos`
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
    </div>
  );
}