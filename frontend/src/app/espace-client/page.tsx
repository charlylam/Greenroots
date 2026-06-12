import {
  CalendarDays,
  Mail,
  MapPin,
  Package,
  User as UserIcon,
} from 'lucide-react';

import Title from '@/components/layout/Title';
import LogoutButton from '@/components/layout/LogoutButton';
import { getMe, getMyOrders } from '@/lib/api';
import type { Order, User } from '@/types';
import { redirect } from 'next/dist/client/components/navigation';
import { Metadata } from 'next';
import DeleteAccountButton from '@/components/layout/DeleteAccountButton';

export const metadata: Metadata = {
  title: 'Mon espace client',
  robots: {
    index: false,
    follow: false,
  },
};

// ============================================================
//  Espace client — données récupérées via /api/users/me
//  et /api/users/me/orders (token JWT injecté par apiFetchPrivate).
// ============================================================

export default async function CustomerAreaPage() {
  let user: User;
  let orders: Order[];

  try {
    const [meRes, ordersRes] = await Promise.all([getMe(), getMyOrders()]);

    user = meRes.data;
    orders = ordersRes.data;
  } catch (err) {
    console.error('[espace-client] API call failed:', err);
    redirect('/authentification');
  }
  function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  return (
    <main>
      <Title title="Espace client" />

      <section className="bg-brand-bg px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-4xl space-y-10 text-brand-dark">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-3xl font-bold">
                Bonjour {user.firstName} 👋
              </h2>

              <p className="text-muted-foreground mt-1">
                Votre espace personnel GreenRoots.
              </p>
            </div>

            <LogoutButton />
          </header>

          <section className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <UserIcon className="size-5 text-primary" aria-hidden="true" />
              Mes informations
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl border border-border p-5 bg-card">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">
                  Nom complet
                </p>
                <p className="mt-1">
                  {user.firstName} {user.lastName}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">
                  Email
                </p>
                <p className="mt-1 flex items-center gap-1.5">
                  <Mail
                    className="size-3.5 text-muted-foreground"
                    aria-hidden="true"
                  />
                  {user.email}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">
                  Type de compte
                </p>
                <p className="mt-1 capitalize">{user.type}</p>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">
                  Adresse
                </p>
                <p className="mt-1 flex items-center gap-1.5">
                  <MapPin
                    className="size-3.5 text-muted-foreground"
                    aria-hidden="true"
                  />
                  {user.address}, {user.postalCode} {user.city}
                </p>
              </div>

              {user.companyName && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase">
                    Raison sociale
                  </p>
                  <p className="mt-1">{user.companyName}</p>
                </div>
              )}

              {user.siret && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase">
                    SIRET
                  </p>
                  <p className="mt-1 font-mono text-sm">{user.siret}</p>
                </div>
              )}
            </div>
          </section>

          {/* Commandes */}
          <section className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Package className="size-5 text-primary" aria-hidden="true" />
              Mes commandes ({orders.length})
            </h3>

            <ul className="space-y-3">
              {orders.map((order) => (
                <li
                  key={order.id}
                  className="rounded-2xl border border-border p-4 bg-card space-y-3"
                >
                  {/* En-tête de la commande */}
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <p className="font-semibold">Commande #{order.id}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                        <CalendarDays className="size-3.5" aria-hidden="true" />
                        {formatDate(order.createdAt)}
                        {' · '}
                        {order.items.length} article
                        {order.items.length > 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={
                          order.status === 'validated'
                            ? 'rounded-full bg-brand-accent text-brand-white px-3 py-1 text-xs font-medium'
                            : 'rounded-full bg-destructive/10 text-destructive px-3 py-1 text-xs font-medium'
                        }
                      >
                        {order.status === 'validated' ? 'Validée' : 'Annulée'}
                      </span>
                      <span className="font-semibold">
                        {Number(order.amount).toFixed(2)} €
                      </span>
                    </div>
                  </div>

                  {/* Détail des items */}
                  <ul className="border-t border-border pt-3 space-y-2">
                    {order.items.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-start justify-between gap-3 text-sm"
                      >
                        <div className="flex-1">
                          <p className="text-muted-foreground">
                            {item.treeCommonName}{' '}
                            <span className="text-xs">× {item.quantity}</span>
                          </p>

                          <p className="text-xs text-muted-foreground/70 italic mt-0.5">
                            Projet : {item.project.name}
                          </p>
                        </div>
                        <span className="font-mono text-muted-foreground whitespace-nowrap">
                          {Number(item.unitPrice).toFixed(2)} €
                        </span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </section>

          {/* Bouton de suppression du compte  */}
          <div className="flex justify-end pt-4">
            <DeleteAccountButton />
          </div>
        </div>
      </section>
    </main>
  );
}
