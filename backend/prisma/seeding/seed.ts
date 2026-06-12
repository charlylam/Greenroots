import { UserRole, UserType, CartStatus, OrderStatus } from '@prisma/client';

import { prisma } from '../../src/lib/prisma.js';

import argon2 from 'argon2';

async function main() {
  console.log('🌱 Début du seeding GreenRoots...');

  // =========================================================
  // NETTOYAGE
  // =========================================================

  await prisma.$transaction([
    prisma.orderItem.deleteMany(),
    prisma.order.deleteMany(),
    prisma.cartItem.deleteMany(),
    prisma.cart.deleteMany(),
    prisma.projectHasTree.deleteMany(),
    prisma.project.deleteMany(),
    prisma.tree.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  console.log('🧹 Base de données nettoyée');

  // =========================================================
  // USERS
  // =========================================================

  const passwordHash = await argon2.hash('Password123@');

  const adminUser = await prisma.user.create({
    data: {
      lastName: 'Dupont',
      firstName: 'Marie',
      email: 'admin@greenroots.fr',
      password: passwordHash,
      role: UserRole.admin,
      address: '12 rue de la Forêt',
      postalCode: '75001',
      city: 'Paris',
      type: UserType.association,
      phone: '0601020304',
    },
  });

  console.log(adminUser.email);
  //adminUser n'est pas utilisé ici car n'est nécessaire que pour le backoffice
  //Le console log permet d'utiliser la variable adminUser dans l'attente du backoffice

  const user1 = await prisma.user.create({
    data: {
      lastName: 'Martin',
      firstName: 'Thomas',
      email: 'thomas.martin@email.fr',
      password: passwordHash,
      role: UserRole.user,
      address: '45 avenue des Chênes',
      postalCode: '69001',
      city: 'Lyon',
      type: UserType.particulier,
      phone: '0612345678',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      lastName: 'Bernard',
      firstName: 'Sophie',
      email: 'sophie.bernard@email.fr',
      password: passwordHash,
      role: UserRole.user,
      address: '8 boulevard Verdure',
      postalCode: '33000',
      city: 'Bordeaux',
      type: UserType.particulier,
      phone: '0623456789',
    },
  });

  const user3 = await prisma.user.create({
    data: {
      lastName: 'Leroy',
      firstName: 'Jean',
      email: 'contact@ecoentreprise.fr',
      password: passwordHash,
      role: UserRole.user,
      address: "100 rue de l'Industrie",
      postalCode: '67000',
      city: 'Strasbourg',
      type: UserType.entreprise,
      siret: '12345678901234',
      companyName: 'EcoEntreprise SAS',
      phone: '0634567890',
    },
  });

  console.log('👤 Utilisateurs créés');

  // =========================================================
  // TREES (27 au total : 6 existants + 21 ajoutés)
  // =========================================================

  // --- Arbres d'origine ---

  const chene = await prisma.tree.create({
    data: {
      commonName: 'Chêne sessile',
      slug: 'chene-sessile',
      scientificName: 'Quercus petraea',
      family: 'Fagaceae',
      shortDescription: 'Arbre robuste adapté aux forêts tempérées.',
      longDescription:
        'Le chêne sessile est apprécié pour sa longévité, sa résistance et son rôle important dans la biodiversité forestière.',
      origin: 'Europe',
      price: 12.9,
      picture: 'seed/chene-sessile.webp',
    },
  });

  const pin = await prisma.tree.create({
    data: {
      commonName: 'Pin sylvestre',
      slug: 'pin-sylvestre',
      scientificName: 'Pinus sylvestris',
      family: 'Pinaceae',
      shortDescription: 'Conifère résistant adapté aux sols pauvres.',
      longDescription:
        'Le pin sylvestre est une essence pionnière capable de se développer dans des conditions difficiles.',
      origin: 'Europe et Asie',
      price: 8.9,
      picture: 'seed/pin-sylvestre.webp',
    },
  });

  const bouleau = await prisma.tree.create({
    data: {
      commonName: 'Bouleau blanc',
      slug: 'bouleau-blanc',
      scientificName: 'Betula pendula',
      family: 'Betulaceae',
      shortDescription:
        'Arbre léger et pionnier, utile pour régénérer les sols.',
      longDescription:
        'Le bouleau blanc favorise la régénération naturelle et s’adapte bien aux climats tempérés.',
      origin: 'Europe',
      price: 7.5,
      picture: 'seed/bouleau-blanc.webp',
    },
  });

  const acajou = await prisma.tree.create({
    data: {
      commonName: "Acajou d'Afrique",
      slug: 'acajou-afrique',
      scientificName: 'Khaya senegalensis',
      family: 'Meliaceae',
      shortDescription:
        'Essence tropicale adaptée aux projets de reforestation chaude.',
      longDescription:
        'L’acajou d’Afrique est utilisé dans certains projets de restauration écologique en zones chaudes.',
      origin: 'Afrique',
      price: 18,
      picture: 'seed/acajou-afrique.webp',
    },
  });

  const sequoia = await prisma.tree.create({
    data: {
      commonName: 'Séquoia géant',
      slug: 'sequoia-geant',
      scientificName: 'Sequoiadendron giganteum',
      family: 'Cupressaceae',
      shortDescription:
        'Arbre majestueux à forte valeur écologique et symbolique.',
      longDescription:
        'Le séquoia géant est reconnu pour sa longévité exceptionnelle et sa capacité de stockage du carbone.',
      origin: 'Amérique du Nord',
      price: 25,
      picture: 'seed/sequoia-geant.webp',
    },
  });

  const mangrove = await prisma.tree.create({
    data: {
      commonName: 'Palétuvier rouge',
      slug: 'paletuvier-rouge',
      scientificName: 'Rhizophora mangle',
      family: 'Rhizophoraceae',
      shortDescription:
        'Essence essentielle pour la restauration des mangroves.',
      longDescription:
        'Le palétuvier rouge protège les littoraux, favorise la biodiversité et limite l’érosion côtière.',
      origin: 'Zones tropicales',
      price: 15,
      picture: 'seed/paletuvier-rouge.webp',
    },
  });

  // --- Nouveaux arbres (Europe tempérée) ---

  const hetre = await prisma.tree.create({
    data: {
      commonName: 'Hêtre commun',
      slug: 'hetre-commun',
      scientificName: 'Fagus sylvatica',
      family: 'Fagaceae',
      shortDescription: 'Grand arbre des forêts européennes tempérées.',
      longDescription:
        'Le hêtre commun forme des forêts denses et joue un rôle clé dans l’équilibre des écosystèmes forestiers européens.',
      origin: 'Europe',
      price: 11.5,
      picture: 'seed/hetre-commun.webp',
    },
  });

  const erable = await prisma.tree.create({
    data: {
      commonName: 'Érable sycomore',
      slug: 'erable-sycomore',
      scientificName: 'Acer pseudoplatanus',
      family: 'Sapindaceae',
      shortDescription: 'Arbre ornemental à croissance rapide.',
      longDescription:
        'L’érable sycomore s’adapte à de nombreux sols et offre un excellent couvert forestier en milieu tempéré.',
      origin: 'Europe',
      price: 10.5,
      picture: 'seed/erable-sycomore.webp',
    },
  });

  const frene = await prisma.tree.create({
    data: {
      commonName: 'Frêne commun',
      slug: 'frene-commun',
      scientificName: 'Fraxinus excelsior',
      family: 'Oleaceae',
      shortDescription: 'Essence forestière au bois précieux.',
      longDescription:
        'Le frêne commun se développe rapidement et constitue une essence importante des forêts mixtes européennes.',
      origin: 'Europe',
      price: 9.5,
      picture: 'seed/frene-commun.webp',
    },
  });

  const chataignier = await prisma.tree.create({
    data: {
      commonName: 'Châtaignier',
      slug: 'chataignier',
      scientificName: 'Castanea sativa',
      family: 'Fagaceae',
      shortDescription: 'Arbre fruitier des forêts méridionales.',
      longDescription:
        'Le châtaignier produit des fruits comestibles et joue un rôle écologique et patrimonial fort en Europe du Sud.',
      origin: 'Europe méridionale',
      price: 11,
      picture: 'seed/chataignier.webp',
    },
  });

  const tilleul = await prisma.tree.create({
    data: {
      commonName: 'Tilleul à grandes feuilles',
      slug: 'tilleul-grandes-feuilles',
      scientificName: 'Tilia platyphyllos',
      family: 'Malvaceae',
      shortDescription: 'Arbre mellifère apprécié en milieu urbain et rural.',
      longDescription:
        'Le tilleul à grandes feuilles est très favorable aux pollinisateurs et offre un bel ombrage en zone tempérée.',
      origin: 'Europe',
      price: 10,
      picture: 'seed/tilleul-grandes-feuilles.webp',
    },
  });

  const charme = await prisma.tree.create({
    data: {
      commonName: 'Charme commun',
      slug: 'charme-commun',
      scientificName: 'Carpinus betulus',
      family: 'Betulaceae',
      shortDescription: 'Arbre compagnon classique des chênaies européennes.',
      longDescription:
        'Le charme commun accompagne souvent les chênes et forme des sous-bois denses propices à la biodiversité.',
      origin: 'Europe',
      price: 8.5,
      picture: 'seed/charme-commun.webp',
    },
  });

  const aulne = await prisma.tree.create({
    data: {
      commonName: 'Aulne glutineux',
      slug: 'aulne-glutineux',
      scientificName: 'Alnus glutinosa',
      family: 'Betulaceae',
      shortDescription: 'Essence des zones humides et bords de cours d’eau.',
      longDescription:
        'L’aulne glutineux fixe l’azote et stabilise les berges, ce qui en fait un allié des écosystèmes ripariens.',
      origin: 'Europe',
      price: 7,
      picture: 'seed/aulne-glutineux.webp',
    },
  });

  const peuplier = await prisma.tree.create({
    data: {
      commonName: 'Peuplier noir',
      slug: 'peuplier-noir',
      scientificName: 'Populus nigra',
      family: 'Salicaceae',
      shortDescription: 'Arbre rapide des plaines alluviales.',
      longDescription:
        'Le peuplier noir est utilisé dans la restauration des zones alluviales et offre une croissance rapide.',
      origin: 'Europe',
      price: 6.9,
      picture: 'seed/peuplier-noir.webp',
    },
  });

  const saule = await prisma.tree.create({
    data: {
      commonName: 'Saule blanc',
      slug: 'saule-blanc',
      scientificName: 'Salix alba',
      family: 'Salicaceae',
      shortDescription: 'Essence des berges, utile pour stabiliser les sols.',
      longDescription:
        'Le saule blanc se développe en bord de rivière et limite l’érosion grâce à son système racinaire dense.',
      origin: 'Europe',
      price: 6.5,
      picture: 'seed/saule-blanc.webp',
    },
  });

  // --- Nouveaux arbres (Conifères et montagne) ---

  const sapin = await prisma.tree.create({
    data: {
      commonName: 'Sapin pectiné',
      slug: 'sapin-pectine',
      scientificName: 'Abies alba',
      family: 'Pinaceae',
      shortDescription: 'Conifère majestueux des forêts d’altitude.',
      longDescription:
        'Le sapin pectiné est une essence emblématique des forêts de montagne européennes, à fort intérêt écologique.',
      origin: 'Europe',
      price: 13.5,
      picture: 'seed/sapin-pectine.webp',
    },
  });

  const epicea = await prisma.tree.create({
    data: {
      commonName: 'Épicéa commun',
      slug: 'epicea-commun',
      scientificName: 'Picea abies',
      family: 'Pinaceae',
      shortDescription: 'Conifère répandu en Europe du Nord et en altitude.',
      longDescription:
        'L’épicéa commun forme de vastes forêts boréales et constitue une essence importante pour la sylviculture.',
      origin: 'Europe du Nord',
      price: 9.9,
      picture: 'seed/epicea-commun.webp',
    },
  });

  const meleze = await prisma.tree.create({
    data: {
      commonName: 'Mélèze d’Europe',
      slug: 'meleze-europe',
      scientificName: 'Larix decidua',
      family: 'Pinaceae',
      shortDescription: 'Conifère caducifolié des Alpes.',
      longDescription:
        'Le mélèze d’Europe est l’un des rares conifères à perdre ses aiguilles en hiver, adapté à la haute montagne.',
      origin: 'Alpes',
      price: 14,
      picture: 'seed/meleze-europe.webp',
    },
  });

  const cedre = await prisma.tree.create({
    data: {
      commonName: 'Cèdre du Liban',
      slug: 'cedre-liban',
      scientificName: 'Cedrus libani',
      family: 'Pinaceae',
      shortDescription: 'Conifère emblématique du bassin méditerranéen.',
      longDescription:
        'Le cèdre du Liban est apprécié pour sa longévité et son adaptation aux climats secs méditerranéens.',
      origin: 'Méditerranée',
      price: 22,
      picture: 'seed/cedre-liban.webp',
    },
  });

  // --- Nouveaux arbres (Méditerranée) ---

  const olivier = await prisma.tree.create({
    data: {
      commonName: 'Olivier',
      slug: 'olivier',
      scientificName: 'Olea europaea',
      family: 'Oleaceae',
      shortDescription: 'Arbre emblématique des paysages méditerranéens.',
      longDescription:
        'L’olivier est cultivé depuis des millénaires et constitue un symbole fort des écosystèmes méditerranéens.',
      origin: 'Méditerranée',
      price: 16,
      picture: 'seed/olivier.webp',
    },
  });

  const cypres = await prisma.tree.create({
    data: {
      commonName: 'Cyprès de Provence',
      slug: 'cypres-provence',
      scientificName: 'Cupressus sempervirens',
      family: 'Cupressaceae',
      shortDescription: 'Conifère élancé typique des paysages provençaux.',
      longDescription:
        'Le cyprès de Provence sert de brise-vent et marque les paysages méditerranéens depuis l’Antiquité.',
      origin: 'Méditerranée',
      price: 13,
      picture: 'seed/cypres-provence.webp',
    },
  });

  // --- Nouveaux arbres (Tropical et exotique) ---

  const eucalyptus = await prisma.tree.create({
    data: {
      commonName: 'Eucalyptus bleu',
      slug: 'eucalyptus-bleu',
      scientificName: 'Eucalyptus globulus',
      family: 'Myrtaceae',
      shortDescription: 'Arbre à croissance rapide originaire d’Australie.',
      longDescription:
        'L’eucalyptus bleu est utilisé dans plusieurs projets de reforestation pour sa rapidité de croissance.',
      origin: 'Australie',
      price: 14.5,
      picture: 'seed/eucalyptus-bleu.webp',
    },
  });

  const baobab = await prisma.tree.create({
    data: {
      commonName: 'Baobab africain',
      slug: 'baobab-africain',
      scientificName: 'Adansonia digitata',
      family: 'Malvaceae',
      shortDescription: 'Arbre iconique des savanes africaines.',
      longDescription:
        'Le baobab africain est un arbre de longévité exceptionnelle, essentiel à la vie des communautés et de la faune locale.',
      origin: 'Afrique',
      price: 28,
      picture: 'seed/baobab-africain.webp',
    },
  });

  const teck = await prisma.tree.create({
    data: {
      commonName: 'Teck',
      slug: 'teck',
      scientificName: 'Tectona grandis',
      family: 'Lamiaceae',
      shortDescription: 'Essence tropicale au bois imputrescible.',
      longDescription:
        'Le teck est apprécié pour la qualité de son bois et fait l’objet de plantations dans plusieurs projets tropicaux.',
      origin: 'Asie du Sud-Est',
      price: 24,
      picture: 'seed/teck.webp',
    },
  });

  const bambou = await prisma.tree.create({
    data: {
      commonName: 'Bambou géant',
      slug: 'bambou-geant',
      scientificName: 'Phyllostachys edulis',
      family: 'Poaceae',
      shortDescription: 'Plante ligneuse à croissance extrêmement rapide.',
      longDescription:
        'Le bambou géant capte rapidement le CO₂ et est utilisé dans plusieurs projets de restauration en Asie.',
      origin: 'Asie',
      price: 9,
      picture: 'seed/bambou-geant.webp',
    },
  });

  const cocotier = await prisma.tree.create({
    data: {
      commonName: 'Cocotier',
      slug: 'cocotier',
      scientificName: 'Cocos nucifera',
      family: 'Arecaceae',
      shortDescription: 'Palmier emblématique des littoraux tropicaux.',
      longDescription:
        'Le cocotier joue un rôle écologique et économique majeur dans les zones côtières tropicales.',
      origin: 'Zones tropicales',
      price: 17,
      picture: 'seed/cocotier.webp',
    },
  });

  const manguier = await prisma.tree.create({
    data: {
      commonName: 'Manguier',
      slug: 'manguier',
      scientificName: 'Mangifera indica',
      family: 'Anacardiaceae',
      shortDescription: 'Arbre fruitier tropical à forte valeur sociale.',
      longDescription:
        'Le manguier offre une ombre précieuse et des fruits importants pour les populations des zones tropicales.',
      origin: 'Asie tropicale',
      price: 16.5,
      picture: 'seed/manguier.webp',
    },
  });

  console.log('🌳 Arbres créés (27 au total)');

  // =========================================================
  // PROJECTS (18 au total : 5 existants + 13 ajoutés)
  // =========================================================

  // --- Projets d'origine ---

  const projetBretagne = await prisma.project.create({
    data: {
      name: 'Reforestation en Bretagne',
      slug: 'reforestation-bretagne',
      shortDescription: 'Projet de restauration forestière locale en Bretagne.',
      longDescription:
        'Ce projet vise à restaurer des zones forestières fragilisées en plantant des essences locales adaptées au climat breton.',
      localisation: 'Europe',
      picture: 'seed/reforestation-bretagne.webp',
      progress: 45,
    },
  });

  const projetSahel = await prisma.project.create({
    data: {
      name: 'Reboisement au Sahel',
      slug: 'reboisement-sahel',
      shortDescription: 'Projet de reboisement en zone sèche.',
      longDescription:
        'Ce projet contribue à lutter contre la désertification grâce à la plantation d’essences adaptées aux zones arides.',
      localisation: 'Afrique',
      picture: 'seed/reboisement-sahel.webp',
      progress: 30,
    },
  });

  const projetAlpes = await prisma.project.create({
    data: {
      name: 'Restauration forestière dans les Alpes',
      slug: 'restauration-forestiere-alpes',
      shortDescription: 'Projet de reforestation en zone montagneuse.',
      longDescription:
        'Ce projet vise à renforcer les écosystèmes forestiers alpins et à protéger les sols contre l’érosion.',
      localisation: 'Europe',
      picture: 'seed/restauration-alpes.webp',
      progress: 60,
    },
  });

  const projetAmazonie = await prisma.project.create({
    data: {
      name: 'Préservation en Amazonie',
      slug: 'preservation-amazonie',
      shortDescription:
        'Projet de plantation et restauration en zone tropicale.',
      longDescription:
        'Ce projet contribue à la restauration d’espaces naturels dégradés et au maintien de la biodiversité amazonienne.',
      localisation: 'Amérique du Sud',
      picture: 'seed/preservation-amazonie.webp',
      progress: 25,
    },
  });

  const projetMangrove = await prisma.project.create({
    data: {
      name: 'Restauration des mangroves',
      slug: 'restauration-mangroves',
      shortDescription: 'Projet de restauration écologique des zones côtières.',
      longDescription:
        'Ce projet vise à restaurer les mangroves afin de protéger les littoraux et favoriser la biodiversité marine.',
      localisation: 'Asie',
      picture: 'seed/restauration-mangroves.webp',
      progress: 70,
    },
  });

  // --- Nouveaux projets (France métropolitaine) ---

  const projetProvence = await prisma.project.create({
    data: {
      name: 'Forêt méditerranéenne en Provence',
      slug: 'foret-mediterraneenne-provence',
      shortDescription:
        'Projet de plantation d’essences méditerranéennes en Provence.',
      longDescription:
        'Ce projet renforce les écosystèmes méditerranéens en plantant des essences locales résistantes à la sécheresse.',
      localisation: 'Europe',
      picture: 'seed/foret-mediterraneenne-provence.webp',
      progress: 55,
    },
  });

  const projetAuvergne = await prisma.project.create({
    data: {
      name: 'Restauration de la forêt d’Auvergne',
      slug: 'restauration-foret-auvergne',
      shortDescription:
        'Projet de restauration des forêts feuillues auvergnates.',
      longDescription:
        'Ce projet vise à restaurer les forêts feuillues d’Auvergne en favorisant les essences locales et la biodiversité.',
      localisation: 'Europe',
      picture: 'seed/restauration-foret-auvergne.webp',
      progress: 40,
    },
  });

  const projetPyrenees = await prisma.project.create({
    data: {
      name: 'Reforestation des Pyrénées',
      slug: 'reforestation-pyrenees',
      shortDescription:
        'Projet de reforestation en zone montagneuse pyrénéenne.',
      longDescription:
        'Ce projet contribue à la préservation des écosystèmes pyrénéens grâce à la plantation d’essences adaptées à l’altitude.',
      localisation: 'Europe',
      picture: 'seed/reforestation-pyrenees.webp',
      progress: 35,
    },
  });

  const projetLandes = await prisma.project.create({
    data: {
      name: 'Restauration de la forêt landaise',
      slug: 'restauration-foret-landaise',
      shortDescription: 'Projet de restauration du massif forestier landais.',
      longDescription:
        'Ce projet vise à restaurer le massif landais après les épisodes climatiques en diversifiant les essences plantées.',
      localisation: 'Europe',
      picture: 'seed/restauration-foret-landaise.webp',
      progress: 50,
    },
  });

  const projetNormandie = await prisma.project.create({
    data: {
      name: 'Projet écologique en Normandie',
      slug: 'projet-ecologique-normandie',
      shortDescription:
        'Projet de plantation pour renforcer les haies bocagères normandes.',
      longDescription:
        'Ce projet soutient la replantation de haies bocagères en Normandie pour favoriser la biodiversité locale.',
      localisation: 'Europe',
      picture: 'seed/projet-ecologique-normandie.webp',
      progress: 65,
    },
  });

  const projetCorse = await prisma.project.create({
    data: {
      name: 'Reboisement en Corse',
      slug: 'reboisement-corse',
      shortDescription:
        'Projet de reboisement des zones impactées par les incendies.',
      longDescription:
        'Ce projet contribue à la régénération des massifs corses touchés par les incendies grâce à des essences locales.',
      localisation: 'Europe',
      picture: 'seed/reboisement-corse.webp',
      progress: 28,
    },
  });

  const projetBourgogne = await prisma.project.create({
    data: {
      name: 'Forêt mixte en Bourgogne',
      slug: 'foret-mixte-bourgogne',
      shortDescription: 'Projet de plantation d’une forêt mixte en Bourgogne.',
      longDescription:
        'Ce projet vise à créer une forêt mixte résiliente face au changement climatique sur les terres bourguignonnes.',
      localisation: 'Europe',
      picture: 'seed/foret-mixte-bourgogne.webp',
      progress: 42,
    },
  });

  const projetVosges = await prisma.project.create({
    data: {
      name: 'Projet en forêt vosgienne',
      slug: 'projet-foret-vosgienne',
      shortDescription:
        'Projet de restauration des forêts de conifères vosgiennes.',
      longDescription:
        'Ce projet soutient la restauration des forêts vosgiennes touchées par les scolytes et la sécheresse.',
      localisation: 'Europe',
      picture: 'seed/projet-foret-vosgienne.webp',
      progress: 38,
    },
  });

  // --- Nouveaux projets (International) ---

  const projetMadagascar = await prisma.project.create({
    data: {
      name: 'Reforestation à Madagascar',
      slug: 'reforestation-madagascar',
      shortDescription:
        'Projet de reforestation des zones dégradées de Madagascar.',
      longDescription:
        'Ce projet contribue à la restauration des forêts malgaches en collaboration avec les communautés locales.',
      localisation: 'Afrique',
      picture: 'seed/reforestation-madagascar.webp',
      progress: 22,
    },
  });

  const projetKenya = await prisma.project.create({
    data: {
      name: 'Restauration des savanes au Kenya',
      slug: 'restauration-savanes-kenya',
      shortDescription:
        'Projet de restauration écologique des savanes kényanes.',
      longDescription:
        'Ce projet aide à restaurer les paysages dégradés du Kenya tout en soutenant la faune et les communautés.',
      localisation: 'Afrique',
      picture: 'seed/restauration-savanes-kenya.webp',
      progress: 33,
    },
  });

  const projetBorneo = await prisma.project.create({
    data: {
      name: 'Préservation à Bornéo',
      slug: 'preservation-borneo',
      shortDescription:
        'Projet de préservation des forêts tropicales de Bornéo.',
      longDescription:
        'Ce projet contribue à la protection des forêts primaires de Bornéo et à la replantation des zones déforestées.',
      localisation: 'Asie',
      picture: 'seed/preservation-borneo.webp',
      progress: 18,
    },
  });

  const projetCostaRica = await prisma.project.create({
    data: {
      name: 'Reboisement au Costa Rica',
      slug: 'reboisement-costa-rica',
      shortDescription:
        'Projet de reboisement et de corridors écologiques au Costa Rica.',
      longDescription:
        'Ce projet recrée des corridors écologiques entre les parcs nationaux costariciens pour faciliter la migration des espèces.',
      localisation: 'Amérique Centrale',
      picture: 'seed/reboisement-costa-rica.webp',
      progress: 75,
    },
  });

  const projetMataAtlantica = await prisma.project.create({
    data: {
      name: 'Restauration de la Mata Atlantica',
      slug: 'restauration-mata-atlantica',
      shortDescription:
        'Projet de restauration de la forêt atlantique brésilienne.',
      longDescription:
        'Ce projet contribue à la restauration de la Mata Atlantica, l’une des forêts les plus menacées au monde.',
      localisation: 'Amérique du Sud',
      picture: 'seed/restauration-mata-atlantica.webp',
      progress: 47,
    },
  });

  console.log('🌍 Projets créés (18 au total)');

  // =========================================================
  // PROJECT_HAS_TREE
  // =========================================================

  await prisma.projectHasTree.createMany({
    data: [
      // --- Associations d'origine ---
      { projectId: projetBretagne.id, treeId: chene.id, stock: 500 },
      { projectId: projetBretagne.id, treeId: bouleau.id, stock: 300 },
      { projectId: projetBretagne.id, treeId: pin.id, stock: 200 },

      { projectId: projetSahel.id, treeId: acajou.id, stock: 1000 },
      { projectId: projetSahel.id, treeId: bouleau.id, stock: 400 },

      { projectId: projetAlpes.id, treeId: pin.id, stock: 800 },
      { projectId: projetAlpes.id, treeId: sequoia.id, stock: 150 },
      { projectId: projetAlpes.id, treeId: chene.id, stock: 350 },

      { projectId: projetAmazonie.id, treeId: acajou.id, stock: 2000 },
      { projectId: projetAmazonie.id, treeId: sequoia.id, stock: 50 },

      { projectId: projetMangrove.id, treeId: mangrove.id, stock: 3000 },

      // --- Nouvelles associations sur les projets d'origine ---
      { projectId: projetBretagne.id, treeId: hetre.id, stock: 400 },
      { projectId: projetBretagne.id, treeId: aulne.id, stock: 250 },
      { projectId: projetBretagne.id, treeId: saule.id, stock: 200 },
      { projectId: projetBretagne.id, treeId: peuplier.id, stock: 250 },
      { projectId: projetBretagne.id, treeId: charme.id, stock: 300 },

      { projectId: projetSahel.id, treeId: baobab.id, stock: 500 },
      { projectId: projetSahel.id, treeId: eucalyptus.id, stock: 700 },

      { projectId: projetAlpes.id, treeId: sapin.id, stock: 600 },
      { projectId: projetAlpes.id, treeId: epicea.id, stock: 500 },
      { projectId: projetAlpes.id, treeId: meleze.id, stock: 300 },
      { projectId: projetAlpes.id, treeId: cedre.id, stock: 100 },

      { projectId: projetAmazonie.id, treeId: teck.id, stock: 800 },
      { projectId: projetAmazonie.id, treeId: manguier.id, stock: 400 },
      { projectId: projetAmazonie.id, treeId: bambou.id, stock: 600 },

      { projectId: projetMangrove.id, treeId: cocotier.id, stock: 800 },

      // --- Associations des nouveaux projets ---
      { projectId: projetProvence.id, treeId: olivier.id, stock: 400 },
      { projectId: projetProvence.id, treeId: cypres.id, stock: 300 },
      { projectId: projetProvence.id, treeId: pin.id, stock: 500 },
      { projectId: projetProvence.id, treeId: chene.id, stock: 350 },

      { projectId: projetAuvergne.id, treeId: hetre.id, stock: 400 },
      { projectId: projetAuvergne.id, treeId: chataignier.id, stock: 350 },
      { projectId: projetAuvergne.id, treeId: erable.id, stock: 300 },
      { projectId: projetAuvergne.id, treeId: frene.id, stock: 250 },

      { projectId: projetPyrenees.id, treeId: hetre.id, stock: 500 },
      { projectId: projetPyrenees.id, treeId: sapin.id, stock: 450 },
      { projectId: projetPyrenees.id, treeId: pin.id, stock: 400 },
      { projectId: projetPyrenees.id, treeId: chene.id, stock: 300 },

      { projectId: projetLandes.id, treeId: pin.id, stock: 800 },
      { projectId: projetLandes.id, treeId: chene.id, stock: 400 },
      { projectId: projetLandes.id, treeId: bouleau.id, stock: 350 },
      { projectId: projetLandes.id, treeId: peuplier.id, stock: 300 },

      { projectId: projetNormandie.id, treeId: hetre.id, stock: 500 },
      { projectId: projetNormandie.id, treeId: chene.id, stock: 400 },
      { projectId: projetNormandie.id, treeId: frene.id, stock: 300 },
      { projectId: projetNormandie.id, treeId: charme.id, stock: 250 },
      { projectId: projetNormandie.id, treeId: peuplier.id, stock: 200 },

      { projectId: projetCorse.id, treeId: pin.id, stock: 450 },
      { projectId: projetCorse.id, treeId: olivier.id, stock: 350 },
      { projectId: projetCorse.id, treeId: chataignier.id, stock: 400 },
      { projectId: projetCorse.id, treeId: chene.id, stock: 300 },

      { projectId: projetBourgogne.id, treeId: chene.id, stock: 450 },
      { projectId: projetBourgogne.id, treeId: charme.id, stock: 300 },
      { projectId: projetBourgogne.id, treeId: tilleul.id, stock: 250 },
      { projectId: projetBourgogne.id, treeId: erable.id, stock: 350 },

      { projectId: projetVosges.id, treeId: sapin.id, stock: 500 },
      { projectId: projetVosges.id, treeId: epicea.id, stock: 450 },
      { projectId: projetVosges.id, treeId: hetre.id, stock: 400 },
      { projectId: projetVosges.id, treeId: meleze.id, stock: 300 },

      { projectId: projetMadagascar.id, treeId: baobab.id, stock: 800 },
      { projectId: projetMadagascar.id, treeId: manguier.id, stock: 600 },
      { projectId: projetMadagascar.id, treeId: eucalyptus.id, stock: 500 },

      { projectId: projetKenya.id, treeId: baobab.id, stock: 700 },
      { projectId: projetKenya.id, treeId: acajou.id, stock: 800 },
      { projectId: projetKenya.id, treeId: eucalyptus.id, stock: 600 },

      { projectId: projetBorneo.id, treeId: teck.id, stock: 900 },
      { projectId: projetBorneo.id, treeId: bambou.id, stock: 1000 },
      { projectId: projetBorneo.id, treeId: cocotier.id, stock: 700 },

      { projectId: projetCostaRica.id, treeId: manguier.id, stock: 800 },
      { projectId: projetCostaRica.id, treeId: cocotier.id, stock: 600 },
      { projectId: projetCostaRica.id, treeId: mangrove.id, stock: 700 },

      { projectId: projetMataAtlantica.id, treeId: acajou.id, stock: 800 },
      { projectId: projetMataAtlantica.id, treeId: manguier.id, stock: 700 },
      { projectId: projetMataAtlantica.id, treeId: teck.id, stock: 600 },
    ],
  });

  console.log('🔗 Associations projet-arbre créées');

  // =========================================================
  // CARTS
  // =========================================================

  await prisma.cart.create({
    data: {
      userId: user1.id,
      status: CartStatus.active,
      items: {
        create: [
          { treeId: chene.id, projectId: projetBretagne.id, quantity: 3 },
          { treeId: sequoia.id, projectId: projetAlpes.id, quantity: 1 },
        ],
      },
    },
  });

  await prisma.cart.create({
    data: {
      userId: user2.id,
      status: CartStatus.active,
      items: {
        create: [
          { treeId: mangrove.id, projectId: projetMangrove.id, quantity: 5 },
        ],
      },
    },
  });

  const cartThomasConverti = await prisma.cart.create({
    data: {
      userId: user1.id,
      status: CartStatus.converted,
      items: {
        create: [
          { treeId: bouleau.id, projectId: projetBretagne.id, quantity: 2 },
          { treeId: acajou.id, projectId: projetSahel.id, quantity: 1 },
        ],
      },
    },
  });

  const cartEntreprise = await prisma.cart.create({
    data: {
      userId: user3.id,
      status: CartStatus.converted,
      items: {
        create: [
          { treeId: pin.id, projectId: projetAlpes.id, quantity: 50 },
          { treeId: acajou.id, projectId: projetAmazonie.id, quantity: 20 },
          { treeId: sequoia.id, projectId: projetAlpes.id, quantity: 5 },
        ],
      },
    },
  });

  console.log('🛒 Paniers créés');

  // =========================================================
  // ORDERS
  // =========================================================

  await prisma.order.create({
    data: {
      userId: user1.id,
      cartId: cartThomasConverti.id,
      status: OrderStatus.validated,
      amount: 6382.5,
      items: {
        create: [
          {
            treeId: chene.id,
            projectId: projetBretagne.id,
            treeCommonName: 'Chêne sessile',
            quantity: 250,
            unitPrice: 12.9,
          },
          {
            treeId: bouleau.id,
            projectId: projetBretagne.id,
            treeCommonName: 'Bouleau blanc',
            quantity: 180,
            unitPrice: 7.5,
          },
          {
            treeId: hetre.id,
            projectId: projetBretagne.id,
            treeCommonName: 'Hêtre commun',
            quantity: 140,
            unitPrice: 11.5,
          },
          {
            treeId: pin.id,
            projectId: projetBretagne.id,
            treeCommonName: 'Pin sylvestre',
            quantity: 50,
            unitPrice: 8.9,
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      userId: user2.id,
      status: OrderStatus.validated,
      amount: 18040,
      items: {
        create: [
          {
            treeId: acajou.id,
            projectId: projetSahel.id,
            treeCommonName: "Acajou d'Afrique",
            quantity: 600,
            unitPrice: 18,
          },
          {
            treeId: baobab.id,
            projectId: projetSahel.id,
            treeCommonName: 'Baobab africain',
            quantity: 200,
            unitPrice: 28,
          },
          {
            treeId: eucalyptus.id,
            projectId: projetSahel.id,
            treeCommonName: 'Eucalyptus bleu',
            quantity: 80,
            unitPrice: 14.5,
          },
          {
            treeId: bouleau.id,
            projectId: projetSahel.id,
            treeCommonName: 'Bouleau blanc',
            quantity: 64,
            unitPrice: 7.5,
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      userId: user3.id,
      cartId: cartEntreprise.id,
      status: OrderStatus.validated,
      amount: 19475,
      items: {
        create: [
          {
            treeId: pin.id,
            projectId: projetAlpes.id,
            treeCommonName: 'Pin sylvestre',
            quantity: 400,
            unitPrice: 8.9,
          },
          {
            treeId: sapin.id,
            projectId: projetAlpes.id,
            treeCommonName: 'Sapin pectiné',
            quantity: 300,
            unitPrice: 13.5,
          },
          {
            treeId: epicea.id,
            projectId: projetAlpes.id,
            treeCommonName: 'Épicéa commun',
            quantity: 250,
            unitPrice: 9.9,
          },
          {
            treeId: chene.id,
            projectId: projetAlpes.id,
            treeCommonName: 'Chêne sessile',
            quantity: 140,
            unitPrice: 12.9,
          },
          {
            treeId: sequoia.id,
            projectId: projetAlpes.id,
            treeCommonName: 'Séquoia géant',
            quantity: 65,
            unitPrice: 25,
          },
          {
            treeId: meleze.id,
            projectId: projetAlpes.id,
            treeCommonName: 'Mélèze d’Europe',
            quantity: 140,
            unitPrice: 14,
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      userId: user1.id,
      status: OrderStatus.validated,
      amount: 62600,
      items: {
        create: [
          {
            treeId: acajou.id,
            projectId: projetAmazonie.id,
            treeCommonName: "Acajou d'Afrique",
            quantity: 1000,
            unitPrice: 18,
          },
          {
            treeId: teck.id,
            projectId: projetAmazonie.id,
            treeCommonName: 'Teck',
            quantity: 400,
            unitPrice: 24,
          },
          {
            treeId: bambou.id,
            projectId: projetAmazonie.id,
            treeCommonName: 'Bambou géant',
            quantity: 300,
            unitPrice: 9,
          },
          {
            treeId: manguier.id,
            projectId: projetAmazonie.id,
            treeCommonName: 'Manguier',
            quantity: 200,
            unitPrice: 16.5,
          },
          {
            treeId: sequoia.id,
            projectId: projetAmazonie.id,
            treeCommonName: 'Séquoia géant',
            quantity: 20,
            unitPrice: 25,
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      userId: user2.id,
      status: OrderStatus.validated,
      amount: 54300,
      items: {
        create: [
          {
            treeId: mangrove.id,
            projectId: projetMangrove.id,
            treeCommonName: 'Palétuvier rouge',
            quantity: 1500,
            unitPrice: 15,
          },
          {
            treeId: cocotier.id,
            projectId: projetMangrove.id,
            treeCommonName: 'Cocotier',
            quantity: 400,
            unitPrice: 17,
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      userId: user3.id,
      status: OrderStatus.validated,
      amount: 9295,
      items: {
        create: [
          {
            treeId: pin.id,
            projectId: projetProvence.id,
            treeCommonName: 'Pin sylvestre',
            quantity: 250,
            unitPrice: 8.9,
          },
          {
            treeId: olivier.id,
            projectId: projetProvence.id,
            treeCommonName: 'Olivier',
            quantity: 200,
            unitPrice: 16,
          },
          {
            treeId: cypres.id,
            projectId: projetProvence.id,
            treeCommonName: 'Cyprès de Provence',
            quantity: 150,
            unitPrice: 13,
          },
          {
            treeId: chene.id,
            projectId: projetProvence.id,
            treeCommonName: 'Chêne sessile',
            quantity: 149,
            unitPrice: 12.9,
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      userId: user1.id,
      status: OrderStatus.validated,
      amount: 6725,
      items: {
        create: [
          {
            treeId: hetre.id,
            projectId: projetAuvergne.id,
            treeCommonName: 'Hêtre commun',
            quantity: 200,
            unitPrice: 11.5,
          },
          {
            treeId: chataignier.id,
            projectId: projetAuvergne.id,
            treeCommonName: 'Châtaignier',
            quantity: 175,
            unitPrice: 11,
          },
          {
            treeId: erable.id,
            projectId: projetAuvergne.id,
            treeCommonName: 'Érable sycomore',
            quantity: 150,
            unitPrice: 10.5,
          },
          {
            treeId: frene.id,
            projectId: projetAuvergne.id,
            treeCommonName: 'Frêne commun',
            quantity: 100,
            unitPrice: 9.5,
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      userId: user2.id,
      status: OrderStatus.validated,
      amount: 8720,
      items: {
        create: [
          {
            treeId: hetre.id,
            projectId: projetPyrenees.id,
            treeCommonName: 'Hêtre commun',
            quantity: 250,
            unitPrice: 11.5,
          },
          {
            treeId: sapin.id,
            projectId: projetPyrenees.id,
            treeCommonName: 'Sapin pectiné',
            quantity: 220,
            unitPrice: 13.5,
          },
          {
            treeId: pin.id,
            projectId: projetPyrenees.id,
            treeCommonName: 'Pin sylvestre',
            quantity: 200,
            unitPrice: 8.9,
          },
          {
            treeId: chene.id,
            projectId: projetPyrenees.id,
            treeCommonName: 'Chêne sessile',
            quantity: 85,
            unitPrice: 12.9,
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      userId: user3.id,
      status: OrderStatus.validated,
      amount: 10395,
      items: {
        create: [
          {
            treeId: pin.id,
            projectId: projetLandes.id,
            treeCommonName: 'Pin sylvestre',
            quantity: 400,
            unitPrice: 8.9,
          },
          {
            treeId: chene.id,
            projectId: projetLandes.id,
            treeCommonName: 'Chêne sessile',
            quantity: 200,
            unitPrice: 12.9,
          },
          {
            treeId: bouleau.id,
            projectId: projetLandes.id,
            treeCommonName: 'Bouleau blanc',
            quantity: 175,
            unitPrice: 7.5,
          },
          {
            treeId: peuplier.id,
            projectId: projetLandes.id,
            treeCommonName: 'Peuplier noir',
            quantity: 150,
            unitPrice: 6.9,
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      userId: user1.id,
      status: OrderStatus.validated,
      amount: 9175,
      items: {
        create: [
          {
            treeId: hetre.id,
            projectId: projetNormandie.id,
            treeCommonName: 'Hêtre commun',
            quantity: 250,
            unitPrice: 11.5,
          },
          {
            treeId: chene.id,
            projectId: projetNormandie.id,
            treeCommonName: 'Chêne sessile',
            quantity: 200,
            unitPrice: 12.9,
          },
          {
            treeId: frene.id,
            projectId: projetNormandie.id,
            treeCommonName: 'Frêne commun',
            quantity: 150,
            unitPrice: 9.5,
          },
          {
            treeId: charme.id,
            projectId: projetNormandie.id,
            treeCommonName: 'Charme commun',
            quantity: 125,
            unitPrice: 8.5,
          },
          {
            treeId: peuplier.id,
            projectId: projetNormandie.id,
            treeCommonName: 'Peuplier noir',
            quantity: 100,
            unitPrice: 6.9,
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      userId: user2.id,
      status: OrderStatus.validated,
      amount: 7130,
      items: {
        create: [
          {
            treeId: pin.id,
            projectId: projetCorse.id,
            treeCommonName: 'Pin sylvestre',
            quantity: 220,
            unitPrice: 8.9,
          },
          {
            treeId: olivier.id,
            projectId: projetCorse.id,
            treeCommonName: 'Olivier',
            quantity: 175,
            unitPrice: 16,
          },
          {
            treeId: chataignier.id,
            projectId: projetCorse.id,
            treeCommonName: 'Châtaignier',
            quantity: 200,
            unitPrice: 11,
          },
          {
            treeId: chene.id,
            projectId: projetCorse.id,
            treeCommonName: 'Chêne sessile',
            quantity: 14,
            unitPrice: 12.9,
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      userId: user3.id,
      status: OrderStatus.validated,
      amount: 7750,
      items: {
        create: [
          {
            treeId: chene.id,
            projectId: projetBourgogne.id,
            treeCommonName: 'Chêne sessile',
            quantity: 225,
            unitPrice: 12.9,
          },
          {
            treeId: erable.id,
            projectId: projetBourgogne.id,
            treeCommonName: 'Érable sycomore',
            quantity: 175,
            unitPrice: 10.5,
          },
          {
            treeId: charme.id,
            projectId: projetBourgogne.id,
            treeCommonName: 'Charme commun',
            quantity: 150,
            unitPrice: 8.5,
          },
          {
            treeId: tilleul.id,
            projectId: projetBourgogne.id,
            treeCommonName: 'Tilleul à grandes feuilles',
            quantity: 173,
            unitPrice: 10,
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      userId: user1.id,
      status: OrderStatus.validated,
      amount: 10795,
      items: {
        create: [
          {
            treeId: sapin.id,
            projectId: projetVosges.id,
            treeCommonName: 'Sapin pectiné',
            quantity: 250,
            unitPrice: 13.5,
          },
          {
            treeId: epicea.id,
            projectId: projetVosges.id,
            treeCommonName: 'Épicéa commun',
            quantity: 225,
            unitPrice: 9.9,
          },
          {
            treeId: hetre.id,
            projectId: projetVosges.id,
            treeCommonName: 'Hêtre commun',
            quantity: 200,
            unitPrice: 11.5,
          },
          {
            treeId: meleze.id,
            projectId: projetVosges.id,
            treeCommonName: 'Mélèze d’Europe',
            quantity: 210,
            unitPrice: 14,
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      userId: user2.id,
      status: OrderStatus.validated,
      amount: 32775,
      items: {
        create: [
          {
            treeId: baobab.id,
            projectId: projetMadagascar.id,
            treeCommonName: 'Baobab africain',
            quantity: 400,
            unitPrice: 28,
          },
          {
            treeId: manguier.id,
            projectId: projetMadagascar.id,
            treeCommonName: 'Manguier',
            quantity: 1000,
            unitPrice: 16.5,
          },
          {
            treeId: eucalyptus.id,
            projectId: projetMadagascar.id,
            treeCommonName: 'Eucalyptus bleu',
            quantity: 350,
            unitPrice: 14.5,
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      userId: user3.id,
      status: OrderStatus.validated,
      amount: 32900,
      items: {
        create: [
          {
            treeId: baobab.id,
            projectId: projetKenya.id,
            treeCommonName: 'Baobab africain',
            quantity: 350,
            unitPrice: 28,
          },
          {
            treeId: acajou.id,
            projectId: projetKenya.id,
            treeCommonName: "Acajou d'Afrique",
            quantity: 922,
            unitPrice: 18,
          },
          {
            treeId: eucalyptus.id,
            projectId: projetKenya.id,
            treeCommonName: 'Eucalyptus bleu',
            quantity: 450,
            unitPrice: 14.5,
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      userId: user1.id,
      status: OrderStatus.validated,
      amount: 40000,
      items: {
        create: [
          {
            treeId: teck.id,
            projectId: projetBorneo.id,
            treeCommonName: 'Teck',
            quantity: 1231,
            unitPrice: 24,
          },
          {
            treeId: bambou.id,
            projectId: projetBorneo.id,
            treeCommonName: 'Bambou géant',
            quantity: 500,
            unitPrice: 9,
          },
          {
            treeId: cocotier.id,
            projectId: projetBorneo.id,
            treeCommonName: 'Cocotier',
            quantity: 350,
            unitPrice: 17,
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      userId: user2.id,
      status: OrderStatus.validated,
      amount: 40475,
      items: {
        create: [
          {
            treeId: manguier.id,
            projectId: projetCostaRica.id,
            treeCommonName: 'Manguier',
            quantity: 1826,
            unitPrice: 16.5,
          },
          {
            treeId: cocotier.id,
            projectId: projetCostaRica.id,
            treeCommonName: 'Cocotier',
            quantity: 300,
            unitPrice: 17,
          },
          {
            treeId: mangrove.id,
            projectId: projetCostaRica.id,
            treeCommonName: 'Palétuvier rouge',
            quantity: 350,
            unitPrice: 15,
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      userId: user3.id,
      status: OrderStatus.validated,
      amount: 28275,
      items: {
        create: [
          {
            treeId: acajou.id,
            projectId: projetMataAtlantica.id,
            treeCommonName: "Acajou d'Afrique",
            quantity: 850,
            unitPrice: 18,
          },
          {
            treeId: manguier.id,
            projectId: projetMataAtlantica.id,
            treeCommonName: 'Manguier',
            quantity: 350,
            unitPrice: 16.5,
          },
          {
            treeId: teck.id,
            projectId: projetMataAtlantica.id,
            treeCommonName: 'Teck',
            quantity: 300,
            unitPrice: 24,
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      userId: user2.id,
      status: OrderStatus.canceled,
      amount: 450,
      items: {
        create: [
          {
            treeId: mangrove.id,
            projectId: projetMangrove.id,
            treeCommonName: 'Palétuvier rouge',
            quantity: 30,
            unitPrice: 15,
          },
        ],
      },
    },
  });

  console.log('📦 Commandes créées');
  console.log('\n✅ Seeding terminé avec succès !');
}

main()
  .catch((error) => {
    console.error('❌ Erreur lors du seeding :', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
