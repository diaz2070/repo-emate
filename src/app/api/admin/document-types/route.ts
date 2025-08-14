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

    // Get pagination parameters from URL
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '5', 10);
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = searchParams.get('sortOrder') || 'asc';

    // Calculate offset
    const offset = (page - 1) * limit;

    // Build where clause for search
    const whereClause = search ? {
      OR: [
        {
          name: {
            contains: search,
            mode: 'insensitive' as const
          }
        },
        {
          description: {
            contains: search,
            mode: 'insensitive' as const
          }
        }
      ]
    } : {};

    // Build orderBy clause
    const orderByClause = sortBy === 'documentCount' 
      ? { documents: { _count: sortOrder } }
      : { [sortBy]: sortOrder };

    // Get total count for pagination
    const totalCount = await prisma.documentType.count({
      where: whereClause
    });

    // Get document types with pagination
    const documentTypes = await prisma.documentType.findMany({
      where: whereClause,
      include: {
        _count: {
          select: { documents: true }
        }
      },
      orderBy: orderByClause,
      skip: offset,
      take: limit
    });

    const formattedTypes = documentTypes.map(type => ({
      id: type.id,
      name: type.name,
      description: type.description,
      documentCount: type._count.documents,
      createdAt: type.createdAt,
      updatedAt: type.updatedAt
    }));

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      documentTypes: formattedTypes,
      pagination: {
        total: totalCount,
        page: page,
        limit: limit,
        totalPages: totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
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