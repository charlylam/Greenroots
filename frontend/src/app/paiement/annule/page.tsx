import { redirect } from 'next/navigation';

export default function PaymentCancelPage() {
  redirect('/panier?payment=cancelled');
}
