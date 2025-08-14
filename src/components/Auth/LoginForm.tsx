'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authClient } from '@/lib/auth-client';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useTransition } from 'react';
import { toast } from 'sonner';

export default function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState(''); 
  const router = useRouter();

  async function signInUsername(username: string, password: string) {
    startTransition(async () => {
      await authClient.signIn.username(
        {
          username,
          password,
        },
        {
          onSuccess: () => {
            toast.success('Inicio de sesión exitoso');
            router.replace('/');
          },
          onError: (error) => {
            toast.error('Error al iniciar sesión');
          },
        },
      );
    });
  }

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    signInUsername(username, password);
  };

  return (
    <Card className="pt-0">
      <CardHeader className="flex flex-row items-center p-4 bg-[#5D7EFF] rounded-t-sm">
        <CardTitle className="text-white text-xl">
          Repositorio Digital EMAT
        </CardTitle>
        <Image src="/girasol.png" alt="Logo" width={32} height={32} />
      </CardHeader>
      <CardHeader>
        <CardTitle className="text-xl">Inicio de sesión</CardTitle>
        <CardDescription>
          Introduzca su dirección de correo electrónico para acceder a su
          cuenta.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-4"
          autoComplete="off"
        >
          <div className="grid gap-5">
            <div className="grid gap-2">
              <Label htmlFor="user">
                Nombre de usuario <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                id="user"
                placeholder="Ingrese su nombre de usuario"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">
                Contraseña <span className="text-red-500">*</span>
              </Label>
              <Input
                type="password"
                id="password"
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 data-testid="loader-icon" className="animate-spin" />
            ) : (
              'Iniciar sesión'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

