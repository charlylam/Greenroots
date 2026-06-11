import { getCart } from '@/lib/api';
import Image from 'next/image';
import CartItemQuantity from '@/components/layout/CartItemQuantity';
import CartEmpty from '@/components/layout/CartEmpty';
import CartDeleteItem from '@/components/layout/CartDeleteItem';
import OrderModal from '@/components/layout/OrderModal';
import { formatPrice } from '@/lib/format';
import { Metadata } from 'next';
import { getImageUrl } from '@/lib/images';

export const metadata: Metadata = {
  title: 'Mon panier',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function CartPage() {
  const { data, meta } = await getCart();

  return (
    <main className="min-h-screen bg-brand-bg text-brand-dark">
      <section className="relative isolate min-h-screen overflow-hidden">
        <Image
          src="/images/background-image-main.jpg"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_top]"
        />

        <div className="relative z-10">
          <section
            className="flex flex-col gap-6 min-h-screen items-center justify-center px-4 pt-28 pb-10 md:pt-36"
            aria-label="Contenu du panier"
          >
            {data.items.length > 0 && (
              <ul
                className="flex flex-col gap-6 w-full max-w-4xl"
                aria-label="Articles dans le panier"
              >
                {data.items.map((item) => (
                  <li
                    key={item.id}
                    className="relative flex flex-col gap-4 w-full rounded-2xl bg-brand-white px-5 py-4 text-brand-dark shadow-sm sm:flex-row sm:items-center sm:gap-4 sm:px-6 sm:pr-14"
                  >
                    <div className="relative w-full h-40 shrink-0 sm:w-28 sm:h-20">
                      <Image
                        src={getImageUrl(item.tree.picture)}
                        alt={`Photo de ${item.tree.commonName}`}
                        fill
                        sizes="(min-width: 640px) 200px, 100vw"
                        className="object-cover rounded-lg"
                      />
                    </div>

                    <div className="absolute top-1/2 right-3 z-10 -translate-y-1/2 sm:right-0 sm:translate-x-1/2">
                      <CartDeleteItem cartItemId={item.id} />
                    </div>

                    <div className="grid grid-cols-2 gap-4 sm:flex-1 sm:grid-cols-[1fr_1fr_6rem_6rem] sm:items-center">
                      <div>
                        <p
                          className="text-xs font-medium text-muted-foreground uppercase"
                          aria-hidden="true"
                        >
                          Arbre
                        </p>
                        <p className="mt-1 break-words">
                          <span className="sr-only">Arbre&nbsp;: </span>
                          {item.tree.commonName}
                        </p>
                      </div>
                      <div>
                        <p
                          className="text-xs font-medium text-muted-foreground uppercase"
                          aria-hidden="true"
                        >
                          Projet
                        </p>
                        <p className="mt-1 break-words">
                          <span className="sr-only">Projet&nbsp;: </span>
                          {item.project.name}
                        </p>
                      </div>
                      <div>
                        <p
                          className="text-xs font-medium text-muted-foreground uppercase"
                          aria-hidden="true"
                        >
                          Quantité
                        </p>
                        <CartItemQuantity
                          cartItemId={item.id}
                          quantity={item.quantity}
                        />
                      </div>
                      <div>
                        <p
                          className="text-xs font-medium text-muted-foreground uppercase"
                          aria-hidden="true"
                        >
                          Prix unitaire
                        </p>
                        <p className="mt-1">
                          <span className="sr-only">Prix unitaire&nbsp;: </span>
                          {formatPrice(Number(item.tree.price))}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div
              className="flex flex-col gap-4 w-full max-w-4xl rounded-2xl bg-brand-white px-5 py-4 text-brand-dark shadow-sm sm:px-6"
              aria-label="Récapitulatif de commande"
            >
              <div className="flex justify-between items-center gap-2 w-full">
                <p id="cart-total-label">Total du panier</p>
                <p
                  className="text-lg font-semibold"
                  aria-labelledby="cart-total-label"
                >
                  {formatPrice(meta.total)}
                </p>
              </div>
              <div className="flex justify-end">
                <OrderModal items={data.items} total={meta.total} />
              </div>
            </div>
            {data.items.length > 0 ? (
              <CartEmpty />
            ) : (
              <p className="rounded-2xl bg-brand-white px-5 py-3 text-brand-dark shadow-sm">
                Votre panier est vide.
              </p>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
