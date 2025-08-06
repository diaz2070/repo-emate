import { auth } from '@/lib/auth';
import LoginForm from '../../../components/Auth/LoginForm';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  // Server side authentication check
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    return redirect('/');
  }

  return <LoginForm />;
}
