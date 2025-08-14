'use client';

import StaticNavbar from './StaticNavbar';
import AuthSection from './AuthSection';
import { authClient } from '@/lib/auth-client';

export default function ServerHeader() {
  const { data: session } = authClient.useSession();

  return (
    <>
      <div
        className="flex flex-row items-center justify-between px-6 py-4 text-white"
        style={{
          background:
            'linear-gradient(90deg,rgba(0, 93, 164, 1) 0%, rgba(6, 85, 145, 1) 41%, rgba(0, 35, 62, 1) 100%)',
        }}
      >
        <StaticNavbar />
        <AuthSection isAuthenticated={!!session} />
      </div>
      <hr />
    </>
  );
}