'use client';
import { auth } from '@/lib/auth';
import Navbar from './Navbar';
import { authClient } from '@/lib/auth-client';

export default function Header() {
  // Client side authentication check
  const { data: session } = authClient.useSession();
  return (
    <div>
      <Navbar isAuthenticated={!!session} />
    </div>
  );
}
