'use client';

import { useState, useTransition } from 'react';
import { createOrderAction } from '@/lib/actions/cart';
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
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/cart/CartProvider';

interface OrderModalProps {
  items: CartItem[];
  total: number;
}

export default function OrderModal({ items, total }: OrderModalProps) {
  const [isPending, startTransition] = useTransition();
  const [errMessage, setErrMessage] = useState('');
  const [orderId, setOrderId] = useState(0);
  const router = useRouter();
  // Permet de remettre à jour le badge du panier dans le header.
  const { refreshCart } = useCart();

  function handleConfirm() {
    startTransition(async () => {
      const data = await createOrderAction();
      if (!data.ok) {
        return setErrMessage(data.message);
      }
      setOrderId(data.orderId);
      // Le panier a été converti en commande : on resynchronise le compteur.
      await refreshCart();
    });
  }

  return (
    <Dialog
      onOpenChange={(open) => {
        // Si le modal se ferme après une commande validée, on redirige
        if (!open && orderId) {
          router.push('/espace-client');
          router.refresh();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="w-full bg-brand-accent hover:bg-brand-accent/90 sm:w-auto">
          Valider la commande
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        {orderId ? (
          <>
            <DialogHeader>
              <DialogTitle>Votre commande #{orderId} est validée</DialogTitle>

              <DialogDescription>
                Merci pour votre achat ! Vous recevrez un email de confirmation
                avec les détails de votre commande. Nous vous tiendrons
                également informé de l&apos;avancement de la plantation de vos
                arbres.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button asChild className="w-full bg-accent">
                <Link href="/espace-client">Retour à mon espace client</Link>
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Récapitulatif de votre commande</DialogTitle>
              {items.map((item) => (
                <DialogDescription key={item.id}>
                  {item.tree.commonName} - {item.project.name} x {item.quantity}
                </DialogDescription>
              ))}
            </DialogHeader>
            <p className="text-lg font-semibold">{formatPrice(total)}</p>
            {errMessage && <p>{errMessage}</p>}
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button disabled={isPending} onClick={handleConfirm}>
                {isPending ? 'Confirmation en cours' : 'Confirmer'}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
