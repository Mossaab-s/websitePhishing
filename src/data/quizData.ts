import { QuizQuestion } from '../types';

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Un email prétend venir de Google vous informant d'une connexion suspecte. Que faites-vous en premier ?",
    options: [
      "Je clique sur le lien pour sécuriser",
      "Je vérifie l'expéditeur et l'URL du lien",
      "Je supprime directement"
    ],
    correctAnswer: 1,
    explanation: "Il faut toujours vérifier l'expéditeur et examiner l'URL avant toute action. Google n'envoie jamais d'emails urgents demandant de cliquer immédiatement."
  },
  {
    id: 2,
    question: "Quelle est la méthode la plus fiable pour valider un lien ?",
    options: [
      "Cliquer pour tester",
      "Survoler et observer l'URL",
      "Regarder le logo dans le mail"
    ],
    correctAnswer: 1,
    explanation: "Survoler le lien permet de voir la vraie destination sans risquer de cliquer. Les logos peuvent être facilement copiés par les attaquants."
  },
  {
    id: 3,
    question: "Vous êtes pressé, vous recevez un fichier partagé depuis un Google Drive externe. Vous :",
    options: [
      "Ouvrez le lien rapidement",
      "Demandez à l'expéditeur via un autre canal",
      "Supprimez directement"
    ],
    correctAnswer: 1,
    explanation: "Même sous pression, il faut toujours vérifier l'authenticité par un canal alternatif (téléphone, chat interne, etc.)."
  },
  {
    id: 4,
    question: "Quel indice n'est pas suffisant seul pour juger un email comme légitime ?",
    options: [
      "L'adresse d'expédition est correcte",
      "Le nom de votre entreprise est mentionné",
      "L'email est sans fautes"
    ],
    correctAnswer: 1,
    explanation: "Les cybercriminels peuvent facilement mentionner le nom de votre entreprise grâce aux informations publiques disponibles en ligne."
  },
  {
    id: 5,
    question: "Quelle faille un hacker peut exploiter après avoir volé un compte Gmail ?",
    options: [
      "Lecture de mails",
      "Accès aux Drives partagés",
      "Accès aux outils d'admin (ex. newsletters, console admin)",
      "Toutes les réponses"
    ],
    correctAnswer: 3,
    explanation: "Un compte Gmail compromis donne accès à tout l'écosystème Google Workspace : mails, Drive, outils admin, historique, contacts..."
  },
  {
    id: 6,
    question: "Pourquoi certains mails de phishing passent les filtres de Gmail ?",
    options: [
      "Mauvaise configuration",
      "Les hackers utilisent de vraies boîtes mail compromises",
      "Les liens sont masqués",
      "Toutes les réponses"
    ],
    correctAnswer: 3,
    explanation: "Les filtres ne sont pas parfaits. Les attaquants utilisent des comptes légitimes compromis, des techniques d'obfuscation et exploitent les failles de configuration."
  },
  {
    id: 7,
    question: "Le lien suivant est visible : https://security.google.com.login.safezone.help/reset — que remarquez-vous ?",
    options: [
      "Il est sécurisé (https)",
      "Il contient 'google.com'",
      "Ce n'est pas un site Google légitime"
    ],
    correctAnswer: 2,
    explanation: "Attention au domaine ! Le vrai domaine est 'safezone.help', pas 'google.com'. C'est une technique classique d'usurpation de domaine."
  },
  {
    id: 8,
    question: "Un collègue clique sur un lien de phishing. Quelle est votre priorité ?",
    options: [
      "Supprimer le mail",
      "Changer son mot de passe",
      "Prévenir l'IT pour blocage et analyse"
    ],
    correctAnswer: 2,
    explanation: "L'IT doit être prévenu immédiatement pour bloquer le compte, analyser l'impact et prendre les mesures de sécurité nécessaires."
  },
  {
    id: 9,
    question: "Que signifie 'spear phishing' ?",
    options: [
      "Phishing de masse",
      "Attaque ciblée sur une personne",
      "Virus intégré dans un lien"
    ],
    correctAnswer: 1,
    explanation: "Le spear phishing est une attaque hautement personnalisée visant une personne spécifique avec des informations précises sur elle."
  },
  {
    id: 10,
    question: "Le phishing peut être combiné avec :",
    options: [
      "Une usurpation d'identité",
      "Un ransomware",
      "Une fraude au président",
      "Toutes les réponses"
    ],
    correctAnswer: 3,
    explanation: "Le phishing est souvent la première étape d'attaques plus complexes : vol d'identité, installation de malwares, fraudes sophistiquées..."
  },
  {
    id: 11,
    question: "Gmail vous affiche une alerte 'ce message semble dangereux'. Que faites-vous ?",
    options: [
      "Supprimer immédiatement",
      "Ignorer, c'est sûrement une erreur",
      "Transférer à un collègue pour avis"
    ],
    correctAnswer: 0,
    explanation: "Les alertes Gmail sont fiables. Il faut supprimer immédiatement et ne jamais transférer un email suspect à d'autres personnes."
  },
  {
    id: 12,
    question: "Vous êtes administrateur Google Workspace. Un utilisateur est compromis. Que faites-vous ?",
    options: [
      "Le déconnecter de tous les appareils",
      "Forcer un changement de mot de passe",
      "Révoquer les accès Drive et vérifier les logs",
      "Toutes les actions"
    ],
    correctAnswer: 3,
    explanation: "En cas de compromission, il faut agir sur tous les fronts : déconnexion, nouveau mot de passe, révocation d'accès et audit complet."
  },
  {
    id: 13,
    question: "Pourquoi les cybercriminels ciblent les PME ?",
    options: [
      "Plus d'argent",
      "Moins de sécurité",
      "Plus de crédulité",
      "B et C"
    ],
    correctAnswer: 3,
    explanation: "Les PME ont souvent moins de moyens pour la sécurité et la sensibilisation, ce qui les rend plus vulnérables aux attaques."
  },
  {
    id: 14,
    question: "Une attaque par phishing réussie a permis l'accès au compte admin de Google Workspace. Quels sont les impacts potentiels ?",
    options: [
      "Vol massif de données",
      "Blocage des comptes utilisateurs",
      "Envoi de phishing à toute l'entreprise",
      "Toutes les réponses"
    ],
    correctAnswer: 3,
    explanation: "Un compte admin compromis est catastrophique : accès total aux données, possibilité de bloquer les utilisateurs et d'utiliser le système pour propager l'attaque."
  },
  {
    id: 15,
    question: "Que signifie 'Zero Trust' face au phishing ?",
    options: [
      "Ne faire confiance à personne",
      "Appliquer des restrictions d'accès",
      "Valider toutes les connexions",
      "Toutes les réponses"
    ],
    correctAnswer: 3,
    explanation: "Zero Trust signifie vérifier systématiquement chaque accès, chaque utilisateur et chaque connexion, même internes."
  }
];