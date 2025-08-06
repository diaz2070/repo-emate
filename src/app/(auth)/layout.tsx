import { useTheme } from 'next-themes';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-[url('/girasol-exposure.png')] bg-cover bg-no-repeat bg-center ">
      <div className="flex w-full max-w-sm flex-col gap-6">{children}</div>
    </div>
  );
}
