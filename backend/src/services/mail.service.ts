import { BrevoClient } from '@getbrevo/brevo';

// Client d'envoi d'emails transactionnels via Brevo.
// La clé API est lue depuis l'environnement pour éviter de la coder en dur.
const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY ?? '',
});

// Identité de l'expéditeur utilisée pour tous les emails envoyés par ce service.
// Les valeurs sont injectées depuis l'environnement, avec des valeurs de secours
// minimales pour éviter une erreur immédiate au chargement du module.
const sender = {
  email: process.env.MAIL_FROM_EMAIL ?? '',
  name: process.env.MAIL_FROM_NAME ?? 'GreenRoots',
};

// Envoie un email de confirmation de commande à l'utilisateur.
//
// Paramètres :
// - email : adresse du destinataire.
// - firstName : prénom affiché dans le message pour personnaliser l'email.
// - orderNumber : numéro de commande affiché dans le contenu du message.
//
// Le contenu est envoyé en HTML pour permettre une mise en forme simple.
export async function sendOrderConfirmationEmail(
  email: string,
  firstName: string,
  orderNumber: string
) {
  // Appel direct à l'API Brevo pour envoyer le message transactionnel.
  await brevo.transactionalEmails.sendTransacEmail({
    sender,
    // Le message est adressé au client concerné, avec son prénom pour le rendu.
    to: [{ email, name: firstName }],
    // Sujet affiché dans la boîte de réception.
    subject: 'Confirmation de votre commande GreenRoots',
    // Corps HTML du mail de confirmation de commande.
    htmlContent: `
      <h1>Merci ${firstName} 🌱</h1>
      <p>Votre commande <strong>${orderNumber}</strong> a bien été enregistrée.</p>
      <p>Merci de participer au reboisement avec GreenRoots.</p>
      <p>À bientôt sur GreenRoots !</p>
    `,
  });
}

// Envoie un email de bienvenue après la création d'un compte.
//
// Paramètres :
// - to : adresse email du nouveau compte.
// - firstName : prénom utilisé pour personnaliser la salutation.
export async function sendRegistrationConfirmationEmail(
  to: string,
  firstName: string
) {
  // Même mécanisme d'envoi que pour la commande, mais avec un contenu différent.
  await brevo.transactionalEmails.sendTransacEmail({
    sender,
    // On cible le nouvel utilisateur avec son adresse et son prénom.
    to: [{ email: to, name: firstName }],
    // Sujet orienté accueil / confirmation d'inscription.
    subject: 'Bienvenue sur GreenRoots 🌱',
    // Message de bienvenue envoyé en HTML.
    htmlContent: `
      <h1>Bienvenue ${firstName} 🌱</h1>
      <p>Votre compte GreenRoots a bien été créé.</p>
      <p>Vous pouvez maintenant vous connecter à votre espace client.</p>
    `,
  });
}

// Envoie un email confirmant la suppression d'un compte utilisateur.
//
// Paramètres :
// - email : adresse du compte supprimé.
// - firstName : prénom du destinataire pour personnaliser le message.
//
// Le texte précise aussi la conservation éventuelle de certaines données,
// afin d'informer l'utilisateur des obligations légales et comptables.
export async function sendAccountDeletionEmail(
  email: string,
  firstName: string
) {
  // Déclenchement de l'envoi transactionnel de confirmation de suppression.
  await brevo.transactionalEmails.sendTransacEmail({
    sender,
    // Le destinataire est le compte supprimé.
    to: [{ email, name: firstName }],
    // Sujet explicite pour lever toute ambiguïté sur la nature du message.
    subject: 'Confirmation de suppression de votre compte GreenRoots',
    // Corps HTML détaillant les conséquences de la suppression du compte.
    htmlContent: `
      <h1>Bonjour ${firstName},</h1>

      <p>Nous vous confirmons que votre compte GreenRoots a bien été supprimé.</p>

      <p>
        Vous ne pourrez désormais plus accéder à votre espace client ni aux
        services associés à votre compte.
      </p>

      <p>
        Conformément à nos obligations légales, certaines données liées à vos
        commandes peuvent être conservées pendant la durée nécessaire aux
        obligations administratives et comptables.
      </p>

      <p>Merci d'avoir participé aux projets de reforestation GreenRoots 🌱</p>

      <p>L'équipe GreenRoots</p>
    `,
  });
}
