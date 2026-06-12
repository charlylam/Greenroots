import type { Metadata } from 'next';
import AuthForm from '../../components/layout/AuthForm'; // ton composant client

export const metadata: Metadata = {
  title: 'Authentification',
  robots: { index: false, follow: false }, // page privée, hors index
};

export default function AuthenticationPage() {
  return <AuthForm />;
}
