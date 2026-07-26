import { redirect } from 'next/navigation';

export default function PaymentSuccessPage() {
  redirect('/espace-client?payment=success');
}
