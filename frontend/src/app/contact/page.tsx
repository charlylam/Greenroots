import type { Metadata } from 'next';
import ContactForm from '../../components/layout/ContactForm'; // ton composant client

export const metadata: Metadata = {
  title: 'Nous contacter',
  description:
    "Une question sur nos projets de reforestation ou votre commande ? Contactez l'équipe GreenRoots, nous vous répondons rapidement.",
};

export default function ContactPage() {
  return <ContactForm />;
}
