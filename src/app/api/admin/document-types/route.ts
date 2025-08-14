import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { canManageUsers } from '@/lib/roles';
import prisma from '../../../../../prisma';

export async function GET(request: NextRequest) {
  try {
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

    // Get all document types with document counts
    const documentTypes = await prisma.documentType.findMany({
      include: {
        _count: {
          select: { documents: true }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    const formattedTypes = documentTypes.map(type => ({
      id: type.id,
      name: type.name,
      description: type.description,
      documentCount: type._count.documents,
      createdAt: type.createdAt,
      updatedAt: type.updatedAt
    }));

    return NextResponse.json({
      documentTypes: formattedTypes,
      total: formattedTypes.length
    });
  } catch (error) {
    console.error('Error fetching document types:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
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

    // Check if document type with this name already exists
    const existingType = await prisma.documentType.findUnique({
      where: { name }
    });

    if (existingType) {
      return NextResponse.json(
        { error: 'Ya existe un tipo documental con este nombre' },
        { status: 409 }
      );
    }

    // Create new document type
    const documentType = await prisma.documentType.create({
      data: {
        name,
        description: description || null
      }
    });

    return NextResponse.json(documentType, { status: 201 });
  } catch (error) {
    console.error('Error creating document type:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}