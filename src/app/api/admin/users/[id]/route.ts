import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import prisma from '../../../../../../prisma';

// Update user status (activate/deactivate) or other user properties
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { active, role } = body;
    console.log('Updating user:', params.id, 'with data:', body);

    // Handle role update using Better Auth's admin API
    if (role !== undefined) {
      const result = await auth.api.setRole({
        body: {
          userId: params.id,
          role,
        },
        headers: await headers(),
      });

      if (result.error) {
        return NextResponse.json({ error: result.error.message }, { status: 400 });
      }
    }

    // Handle active status update (this is our custom field, so we handle it directly)
    if (active !== undefined) {
      const updatedUser = await prisma.user.update({
        where: { id: params.id },
        data: { active },
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          role: true,
          active: true,
          registrationDate: true,
        }
      });

      return NextResponse.json({ 
        message: active ? 'User activated successfully' : 'User deactivated successfully',
        user: updatedUser 
      });
    }

    return NextResponse.json({ message: 'User updated successfully' });

  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Delete user using Better Auth's admin removeUser API
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Use Better Auth's admin removeUser API
    const result = await auth.api.removeUser({
      body: {
        userId: params.id,
      },
      headers: await headers(),
    });

    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 400 });
    }

    return NextResponse.json({ 
      message: 'User deleted successfully',
      user: result.data
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}