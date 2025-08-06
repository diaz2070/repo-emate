'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button, buttonVariants } from './ui/button';
import { useTransition } from 'react';
import { DarkModeToggle } from './DarkModeToggle';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import ButtonNavigation from './ButtonNavigation';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Navbar({
  isAuthenticated = false,
}: {
  isAuthenticated?: boolean;
}) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  // Call client side sign out function
  async function signOut() {
    console.log('Cerrando sesión');
    startTransition(async () => {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push('/login');
            toast.success('Sesión cerrada exitosamente');
          },
          onError: (error) => {
            toast.error('Error al cerrar sesión');
          },
        },
      });
    });
  }

  return (
    <>
      <div
        className="flex flex-row items-center justify-between px-6 py-4 text-white"
        style={{
          background:
            'linear-gradient(90deg,rgba(0, 93, 164, 1) 0%, rgba(6, 85, 145, 1) 41%, rgba(0, 35, 62, 1) 100%)',
        }}
      >
        <Link href="/" className="flex items-center gap-10 p-0 h-10">
          <Image
            src="/emate-logo.svg"
            alt="Logo"
            width={150}
            height={46}
            className="pt-2"
          />
          <div className="text-xl font-bold p-0">Repositorio Digital EMATE</div>
        </Link>
        <nav className="flex gap-6 text-lg">
          {isAuthenticated && (
            <>
              <ButtonNavigation />
              <Button className="text-lg " variant="ghost" onClick={signOut}>
                {isPending ? (
                  <Loader2 data-testid="loader-icon" className="animate-spin" />
                ) : (
                  'Cerrar sesión'
                )}
              </Button>
            </>
          )}
          {!isAuthenticated && (
            <>
              <Link
                href="/login"
                className={buttonVariants({
                  size: 'lg',
                  className: 'text-[16px]',
                })}
              >
                Iniciar sesión
              </Link>
            </>
          )}
          {/* <DarkModeToggle /> */}
        </nav>
      </div>
      <hr />
    </>
  );
}
