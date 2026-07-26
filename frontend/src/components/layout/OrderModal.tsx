'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CartItem } from '@/types';
import { formatPrice } from '@/lib/format';

interface OrderModalProps {
  items: CartItem[];
  total: number;
}

export default function OrderModal({ items, total }: OrderModalProps) {
  const [isPending, setIsPending] = useState(false);
  const [errMessage, setErrMessage] = useState('');

  async function handleConfirm() {
    setIsPending(true);
    setErrMessage('');

    try {
      const response = await fetch('/api/payment/checkout-session', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        setErrMessage(
          data.error?.message ?? 'Impossible de lancer le paiement'
        );
        setIsPending(false);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      setErrMessage('URL Stripe manquante');
    } catch {
      setErrMessage('Erreur lors de la redirection vers Stripe');
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full bg-brand-accent hover:bg-brand-accent/90 sm:w-auto">
          Valider la commande
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Récapitulatif de votre commande</DialogTitle>

          {items.map((item) => (
            <DialogDescription key={item.id}>
              {item.tree.commonName} - {item.project.name} x {item.quantity}
            </DialogDescription>
          ))}
        </DialogHeader>

        <p className="text-lg font-semibold">{formatPrice(total)}</p>

        {errMessage && <p className="text-sm text-destructive">{errMessage}</p>}

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Annuler</Button>
          </DialogClose>

          <Button disabled={isPending} onClick={handleConfirm}>
            {isPending ? 'Redirection en cours' : 'Confirmer et payer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
