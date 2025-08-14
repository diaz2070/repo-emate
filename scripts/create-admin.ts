// Script to create an admin user using Better Auth API
// This ensures all fields are properly set (password hashing, IDs, timestamps, etc.)

import { auth } from '../src/lib/auth';

async function createAdminUser() {
  try {
    console.log('Creating admin user...');
    
    // Create admin user using Better Auth's createUser API (admin method)
    const result = await auth.api.createUser({
      body: {
        email: 'admin@emate.com',
        password: 'admin123',
        name: 'Administrator',
        username: 'admin',
        role: 'admin'
      }
    });

    console.log('Full result:', JSON.stringify(result, null, 2));

    if (result.error) {
      console.error('Error creating admin user:', result.error);
      return;
    }

    const user = result.user || result.data?.user || result;
    
    console.log('✅ Admin user created successfully!');
    console.log('User ID:', user?.id);
    console.log('Username:', user?.username);
    console.log('Email:', user?.email);
    
    if (user?.id) {
      console.log('\n📝 Add this user ID to your .env file:');
      console.log(`ADMIN_USER_IDS="${user.id}"`);
    }
    
  } catch (error) {
    console.error('Failed to create admin user:', error);
  }
  
  // Exit the process
  process.exit(0);
}

createAdminUser();