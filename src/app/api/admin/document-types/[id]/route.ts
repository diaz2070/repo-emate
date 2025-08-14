import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { canManageUsers } from '@/lib/roles';
import prisma from '../../../../../../prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    // Check authentication and admin permissions
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    if (!canManageUsers(session.user.role || '')) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 });
    }

    const documentType = await prisma.documentType.findUnique({
      where: { id },
      include: {
        _count: {
          select: { documents: true }
        }
      }
    });

    if (!documentType) {
      return NextResponse.json(
        { error: 'Tipo documental no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: documentType.id,
      name: documentType.name,
      description: documentType.description,
      documentCount: documentType._count.documents,
      createdAt: documentType.createdAt,
      updatedAt: documentType.updatedAt
    });
  } catch (error) {
    console.error('Error fetching document type:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    // Check authentication and admin permissions
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    if (!canManageUsers(session.user.role || '')) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 });
    }

    const body = await request.json();
    const { name, description } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'El nombre es requerido' },
        { status: 400 }
      );
    }

    // Check if document type exists
    const existingType = await prisma.documentType.findUnique({
      where: { id }
    });

    if (!existingType) {
      return NextResponse.json(
        { error: 'Tipo documental no encontrado' },
        { status: 404 }
      );
    }

    // Check if another document type with this name already exists (excluding current one)
    const duplicateType = await prisma.documentType.findFirst({
      where: { 
        name,
        NOT: { id }
      }
    });

    if (duplicateType) {
      return NextResponse.json(
        { error: 'Ya existe un tipo documental con este nombre' },
        { status: 409 }
      );
    }

    // Update document type
    const updatedType = await prisma.documentType.update({
      where: { id },
      data: {
        name,
        description: description || null
      }
    });

    return NextResponse.json(updatedType);
  } catch (error) {
    console.error('Error updating document type:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    // Check authentication and admin permissions
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    if (!canManageUsers(session.user.role || '')) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 });
    }

    // Check if document type exists
    const documentType = await prisma.documentType.findUnique({
      where: { id },
      include: {
        _count: {
          select: { documents: true }
        }
      }
    });

    if (!documentType) {
      return NextResponse.json(
        { error: 'Tipo documental no encontrado' },
        { status: 404 }
      );
    }

    // Check if there are documents using this type
    if (documentType._count.documents > 0) {
      return NextResponse.json(
        { error: 'No se puede eliminar un tipo documental que tiene documentos asociados' },
        { status: 409 }
      );
    }

    // Delete document type
    await prisma.documentType.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Tipo documental eliminado exitosamente' });
  } catch (error) {
    console.error('Error deleting document type:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}