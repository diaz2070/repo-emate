'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useTransition } from 'react';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Checkbox } from '../ui/checkbox';
import { LoadingButton } from '../loading-button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const signInSchema = z.object({
  username: z
    .string()
    .min(1, { message: 'Nombre de usuario es requerido' })
    .max(20, { message: 'Nombre de usuario no puede excerder 20 caracteres' })
    .regex(/^\w+$/, {
      message:
        'Nombre de usuario solo puede contener letras, numeros y guion bajo',
    }),
  password: z.string().min(1, { message: 'Contraseña es requerida' }),
  rememberMe: z.boolean().optional(),
});

type SignInValues = z.infer<typeof signInSchema>;

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const searchParams = useSearchParams();

  const redirect = searchParams.get('redirect');

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: '',
      password: '',
      rememberMe: false,
    },
  });

  async function onSubmit({ username, password, rememberMe }: SignInValues) {
    console.log('hello login')
    setError(null);
    setLoading(true);

    const { error } = await authClient.signIn.username({
      username,
      password,
      rememberMe,
    });

    setLoading(false);

    if (error) {
      setError(error.message || 'Error al iniciar sesión ');
    } else {
      toast.success('Inicio de sesión exitoso');
      router.push(redirect ?? '/');
    }
  }

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
          Introduzca su nombre de usuario para acceder a su cuenta.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nombre de usuario <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Ingrese su nombre de usuario"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Contraseña<span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="password"
                      placeholder="Ingrese su contraseña"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Mantener sesión iniciada</FormLabel>
                </FormItem>
              )}
            />

            {error && <div className="text-sm text-red-600">{error}</div>}

            <LoadingButton type="submit" className="w-full" loading={loading}>
              Iniciar sesión
            </LoadingButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
