'use client';

import Link from 'next/link';
import { Button, buttonVariants } from './ui/button';
import { useTransition } from 'react';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import ButtonNavigation from './ButtonNavigation';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface AuthSectionProps {
  isAuthenticated: boolean;
}

export default function AuthSection({ isAuthenticated }: AuthSectionProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function signOut() {
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
    <nav className="flex gap-6 text-lg">
      {isAuthenticated && (
        <>
          <ButtonNavigation />
          <Button className="text-lg" variant="ghost" onClick={signOut}>
            {isPending ? (
              <Loader2 data-testid="loader-icon" className="animate-spin" />
            ) : (
              'Cerrar sesión'
            )}
          </Button>
        </>
      )}
      {!isAuthenticated && (
        <Link
          href="/login"
          className={buttonVariants({
            size: 'lg',
            className: 'text-[16px]',
          })}
        >
          Iniciar sesión
        </Link>
      )}
    </nav>
  );
}