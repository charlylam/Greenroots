'use client';

import { useEffect, useRef, useState } from 'react';
import DesktopHeader from './DesktopHeader';
import MobileHeader from './MobileHeader';
import MobileSearch from './MobileSearch';
import { useCart } from '@/components/cart/CartProvider';
import Link from 'next/link';

// Menu principal partagé entre les versions desktop et mobile.
// Centraliser les liens ici permet de garder les deux en-têtes synchronisés
// sans dupliquer la structure de navigation.
const MENU = [
  { label: 'Accueil', href: '/' },
  { label: 'Arbres', href: '/arbres' },
  { label: 'Projets', href: '/projets' },
  { label: 'A propos', href: '/a-propos' },
  { label: 'Contact', href: '/contact' },
];

// En-tête global de l'application.
// Il affiche la bonne variante selon la taille d'écran et récupère le nombre
// d'articles du panier via le contexte partagé.
export default function Header({ isLoggedIn }: { isLoggedIn: boolean }) {
  // Contrôle l'ouverture du menu mobile.
  // L'état est local au header car il ne concerne que l'affichage du menu déroulant.
  const [mobileOpen, setMobileOpen] = useState(false);

  const mobileMenuRef = useRef<HTMLDivElement>(null);
  // Référence utilisée pour détecter si le clic se produit à l'intérieur
  // ou à l'extérieur de la zone mobile du header.

  // Le panier est fourni par le contexte global pour garder le badge à jour
  // sur toutes les pages sans avoir à propager cette donnée manuellement.
  const { cartCount } = useCart();

  // Prénom de l'utilisateur connecté, récupéré pour personnaliser l'en-tête desktop.
  // Si la requête échoue ou si l'utilisateur n'est pas authentifié, on n'affiche rien.
  const [userFirstName, setUserFirstName] = useState<string | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        mobileOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setMobileOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileOpen]);
  // Ferme le menu mobile quand l'utilisateur clique en dehors de sa zone.
  // Cela améliore l'expérience mobile en évitant de laisser le panneau ouvert
  // lorsque l'on interagit avec le reste de la page.

  // Charge les informations du compte pour afficher un accueil personnalisé sur desktop.
  // Cette requête est conditionnée à l'état de connexion pour éviter des appels inutiles.
  useEffect(() => {
    async function fetchUser() {
      if (!isLoggedIn) {
        // Aucun utilisateur connecté : on efface toute donnée affichée précédemment.
        setUserFirstName(null);
        return;
      }

      try {
        // La route /api/users/me renvoie les informations du compte courant.
        // Ici, on ne récupère que le prénom pour personnaliser le header.
        // Appel à l'API utilisateur afin de récupérer le prénom du compte courant.
        const response = await fetch('/api/user/me');

        if (!response.ok) {
          // Si le backend ne répond pas correctement, on retire le prénom affiché.
          setUserFirstName(null);
          return;
        }

        // Le prénom est ensuite conservé localement pour l'affichage de la salutation.
        const result = await response.json();

        // La salutation n'est affichée que sur desktop, dans le composant dédié.
        setUserFirstName(result.data.firstName);
      } catch {
        // En cas d'erreur réseau ou d'exception, on revient à un état neutre.
        setUserFirstName(null);
      }
    }

    // Le chargement est déclenché à chaque changement d'état de connexion.
    void fetchUser();
  }, [isLoggedIn]);

  return (
    // Le header reste collé en haut de la page pour garantir un accès permanent
    // à la navigation, à la recherche et aux raccourcis compte/panier.
    <header className="sticky top-0 z-50">
      {/* Version mobile : bouton menu, recherche et navigation repliée */}
      <div ref={mobileMenuRef} className="md:hidden">
        {/* Le conteneur mobile entier sert de zone de référence pour le clic extérieur. */}
        <MobileHeader
          isLoggedIn={isLoggedIn}
          cartCount={cartCount}
          // Le bouton mobile alterne simplement entre ouvert et fermé.
          onOpen={() => setMobileOpen((prev) => !prev)}
        />

        {/* Panneau déroulant du menu mobile.
            Sa hauteur et son opacité sont animées pour rendre l'ouverture plus fluide. */}
        <div
          className={`overflow-hidden bg-brand-dark/70 transition-all duration-300 ${
            mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          {/* Contenu interne du menu mobile : recherche puis liens de navigation. */}
          <div className="border-t border-white/10 px-4 py-4 text-white">
            <MobileSearch />

            {/* Liste verticale des liens, fermant le menu dès qu'un lien est sélectionné. */}
            <nav className="flex flex-col gap-3">
              {MENU.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  // On referme le menu après navigation pour éviter de laisser
                  // le panneau ouvert sur la nouvelle page.
                  onClick={() => setMobileOpen(false)}
                  className="transition-colors hover:text-[#88B75D]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Version desktop : navigation complète affichée dans un header dédié. */}
      <div className="hidden md:block">
        <DesktopHeader
          menu={MENU}
          isLoggedIn={isLoggedIn}
          cartCount={cartCount}
          // Le header desktop reçoit aussi le prénom pour afficher un salut personnalisé.
          userFirstName={userFirstName}
        />
      </div>
    </header>
  );
}
