import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

// This route acts as a proxy to Better Auth's admin API
// We use Better Auth's built-in listUsers which has advanced search, filtering, and pagination

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    
    // Extract query parameters for Better Auth listUsers API
    const searchValue = url.searchParams.get('search') || undefined;
    const searchField = (url.searchParams.get('searchField') as 'email' | 'name') || 'name';
    const searchOperator = (url.searchParams.get('searchOperator') as 'contains' | 'starts_with' | 'ends_with') || 'contains';
    const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit')!) : 100;
    const offset = url.searchParams.get('offset') ? parseInt(url.searchParams.get('offset')!) : 0;
    const sortBy = url.searchParams.get('sortBy') || 'name';
    const sortDirection = (url.searchParams.get('sortDirection') as 'asc' | 'desc') || 'asc';

    // Use Better Auth's admin listUsers API
    const result = await auth.api.listUsers({
      query: {
        searchValue,
        searchField,
        searchOperator,
        limit,
        offset,
        sortBy,
        sortDirection,
      },
      headers: await headers(),
    });

    if (!result) {
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Create new user using Better Auth's admin createUser API
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, username, email, password, role } = body;

    // Validate required fields
    if (!name || !username || !email || !password || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Use Better Auth's admin createUser API
    const result = await auth.api.createUser({
      body: {
        name,
        email,
        password,
        role,
        data: { username, active: true,  registrationDate: new Date(), }, // Pass username as additional data
      },
      headers: await headers(),
    });

    console.log('User created:', result);

    if (!result) {
      return NextResponse.json({ error: 'Failed to create user' }, { status: 400 });
    }

    return NextResponse.json({ 
      message: 'User created successfully', 
      user: result
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}