'use client';

import { ShoppingCart, User } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import DesktopSearch from './DesktopSearch';

interface DesktopHeaderProps {
  menu: { label: string; href: string }[];
  isLoggedIn: boolean;
  cartCount: number;
  // Prénom du visiteur connecté, utilisé pour afficher une salutation personnalisée.
  userFirstName: string | null;
}

// En-tête principal affiché sur desktop.
// Il regroupe le logo, les liens de navigation, la recherche, l'accès au compte
// et le panier. Le composant reste volontairement purement visuel : il reçoit
// toutes les informations nécessaires via ses props.
export default function DesktopHeader({
  menu,
  isLoggedIn,
  cartCount,
  userFirstName,
}: DesktopHeaderProps) {
  return (
    // Barre de navigation superposée au bandeau visuel de la page.
    // Le fond semi-transparent permet de garder le contenu lisible tout en
    // laissant apparaître l'image de fond du site.
    <nav className="flex items-center justify-between px-4 py-4 absolute top-0 left-0 right-0 z-50 font-heading bg-brand-dark/70">
      {/* Logo cliquable renvoyant vers la page d'accueil. */}
      <Link href="/">
        {/* Conteneur du logo avec dimensions fixes pour conserver un rendu stable. */}
        <div className="w-17 h-17 border-white/60 overflow-hidden flex items-center justify-center">
          <Image
            src="/images/Logo_blanc_transparent.svg"
            alt="Logo GreenRoots - Accueil plateforme de reforestation"
            width={3500}
            height={3500}
            className="object-cover"
          />
        </div>
      </Link>

      {/* Partie droite : navigation, recherche et accès rapide aux espaces clés. */}
      <div className="flex items-center gap-8">
        {/* Liens de navigation principaux fournis par le parent.
            Chaque élément est rendu dynamiquement pour éviter de dupliquer la structure. */}
        <ul
          className="flex items-center gap-8 font-medium text-white"
          style={{ fontSize: '18px' }}
        >
          {menu.map((item) => (
            <li key={item.href}>
              {/* Lien du menu principal avec survol accentué pour signaler l'interaction. */}
              <Link
                href={item.href}
                className="!text-white transition-colors hover:!text-brand-accent"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Recherche desktop autonome avec suggestions déroulantes. */}
        <DesktopSearch />

        {/* Accès au compte : la destination dépend de l'état de connexion. */}
        <Link href={isLoggedIn ? '/espace-client' : '/authentification'}>
          {/* Le bouton change légèrement de style pour différencier l'état connecté
              de l'état de connexion classique. */}
          <button
            className={
              isLoggedIn
                ? 'flex items-center gap-2 p-2 text-brand-accent hover:opacity-80'
                : 'flex items-center gap-2 p-2 text-white hover:text-[#88B75D]'
            }
            aria-label={isLoggedIn ? 'Mon espace client' : 'Connexion'}
          >
            <User size={25} />
            {/* Le prénom apparaît uniquement quand il a été récupéré avec succès,
                afin d'éviter d'afficher une salutation vide ou incohérente. */}
            {/* Salutation affichée uniquement quand l'utilisateur est connecté
                et que son prénom a bien été récupéré depuis l'API. */}
            {isLoggedIn && userFirstName && (
              <span className="text-sm font-medium">
                Bonjour {userFirstName}
              </span>
            )}
          </button>
        </Link>

        {/* Panier */}
        {/* Panier */}
        <Link href="/panier" className="relative" aria-label="Panier">
          <button className="text-white hover:text-[#88B75D] p-2">
            <ShoppingCart size={25} />
          </button>

          {cartCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-accent px-1 text-xs font-bold text-white">
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}
