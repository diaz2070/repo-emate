import { Home, Calendar, History, User as UserIcon, Plus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

function ButtonNavigation() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;
  const links = [
    { href: '/', name: 'Inicio' },
    { href: '/admin', name: 'Admin' },
    { href: '/admin/usuarios', name: 'Usuarios' },
  ];

  return (
    <>
      {links.map((item) => {
        return (
          <Button
            key={item.name}
            variant={isActive(item.href) ? 'default' : 'ghost'}
            asChild
            className="text-lg dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
          >
            <Link
              href={item.href}
              className={`font-[family-name:var(--font-lemon)] ${
                isActive(item.href) ? 'text-white hover:text-white' : ''
              } `}
            >
              {item.name}
            </Link>
          </Button>
        );
      })}
    </>
  );
}

export default ButtonNavigation;