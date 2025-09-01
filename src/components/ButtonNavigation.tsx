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
    { href: '/admin/document-types', name: 'Documentales' },
  ];

  return (
    <>
      {links.map((item) => {
        return (
          <Button
            key={item.name}
            variant={isActive(item.href) ? 'default' : 'ghost'}
            asChild
            className={`text-lg ${
              isActive(item.href) 
                ? 'bg-white/20 text-white hover:bg-white/30 hover:text-white dark:bg-white/30 dark:text-white dark:hover:bg-white/40' 
                : 'text-gray-200 hover:text-white hover:bg-white/10 dark:text-gray-200 dark:hover:text-white dark:hover:bg-white/10'
            }`}
          >
            <Link
              href={item.href}
              className="font-[family-name:var(--font-lemon)]"
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