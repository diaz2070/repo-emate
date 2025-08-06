'use client';
import Image from 'next/image';
import Link from 'next/link';
import { buttonVariants } from './ui/button';
import { useState } from 'react';
import { DarkModeToggle } from './DarkModeToggle';

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const links = [
    { to: '/', label: 'Inicio' },
    { to: '/usuarios', label: 'Usuarios' },
    { to: '/logout', label: 'Cerrar sesión' },
  ];

  return (
    <div>
      <div
        className="flex flex-row items-center justify-between px-6 py-4 text-white"
        style={{
          background:
            'linear-gradient(90deg,rgba(0, 93, 164, 1) 0%, rgba(6, 85, 145, 1) 41%, rgba(0, 35, 62, 1) 100%)',
        }}
      >
        <div className="flex items-center gap-10 p-0 h-10">
          <Image src="/emate-logo.svg" alt="Logo" width={150} height={46} />
          {/* <Image src="/logoEmat.png" alt="Logo" width={150} height={46} /> */}
          <div className="text-2xl font-bold p-0">
            Repositorio Digital EMATE
          </div>
        </div>
        <nav className="flex gap-10 text-lg">
          {isAuthenticated &&
            links.map(({ to, label }) => {
              return (
                <Link key={to} href={to}>
                  {label}
                </Link>
              );
            })}
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
        {/* <ModeToggle /> */}
        {/* <UserMenu /> */}
        {/* </div> */}
      </div>
      <hr />
    </div>
  );
}
