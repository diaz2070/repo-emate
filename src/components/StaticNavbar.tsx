import Image from 'next/image';
import Link from 'next/link';

export default function StaticNavbar() {
  return (
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
  );
}