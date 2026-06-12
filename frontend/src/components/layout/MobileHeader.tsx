'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Menu, ShoppingCart, User } from 'lucide-react';

interface MobileHeaderProps {
  onOpen: () => void;
  isLoggedIn: boolean;
  cartCount: number;
}

// Variante mobile de l'en-tête global.
// Elle concentre les actions essentielles sur un espace réduit : retour accueil,
// accès au compte, accès au panier et ouverture du menu déroulant.
export default function MobileHeader({
  onOpen,
  isLoggedIn,
  cartCount,
}: MobileHeaderProps) {
  return (
    // Barre supérieure compacte adaptée aux petits écrans.
    <header className="flex w-full items-center justify-between bg-brand-dark/70 px-4 py-3 font-heading">
      {/* Logo cliquable qui ramène toujours vers la page d'accueil. */}
      <Link href="/" aria-label="Retour à l'accueil">
        {/* Conteneur fixe pour conserver une taille cohérente du logo sur mobile. */}
        <div className="flex h-14 w-14 items-center justify-center overflow-hidden">
          <Image
            src="/images/Logo_blanc_transparent.svg"
            alt="Logo GreenRoots - Aller à l'accueil"
            width={80}
            height={80}
            className="object-contain"
            priority
          />
        </div>
      </Link>

      {/* Ensemble des actions rapides côté mobile : compte, panier et menu. */}
      <div className="flex items-center gap-2">
        {/* Accès au compte : si l'utilisateur est connecté, on l'envoie vers son espace client,
            sinon vers la page d'authentification. */}
        <Link href={isLoggedIn ? '/espace-client' : '/authentification'}>
          {/* Le style de l'icône change légèrement selon l'état de connexion pour
              donner un repère visuel immédiat. */}
          <button
            type="button"
            className={
              isLoggedIn
                ? 'p-2 text-brand-accent hover:opacity-80'
                : 'p-2 text-white hover:text-[#88B75D]'
            }
            aria-label={isLoggedIn ? 'Mon espace client' : 'Connexion'}
          >
            <User size={25} />
          </button>
        </Link>

        <Link href="/panier" className="relative" aria-label="Panier">
          <button type="button" className="p-2 text-white hover:text-[#88B75D]">
            <ShoppingCart size={25} />
          </button>

          {/* Badge de quantité : il n'apparaît que si le panier contient au moins un article.
              Le compteur est plafonné à 99+ pour éviter un affichage trop large sur mobile. */}
          {cartCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-accent px-1 text-xs font-bold text-white">
              {cartCount > 99 ? '99+' : cartCount}
            </span>
          )}
        </Link>

        {/* Bouton d'ouverture du menu mobile.
            L'action est déléguée au composant parent qui gère l'état d'ouverture. */}
        <button
          type="button"
          onClick={onOpen}
          aria-label="Ouvrir le menu"
          className="p-2 text-white hover:text-[#88B75D]"
        >
          <Menu size={26} />
        </button>
      </div>
    </header>
  );
}
