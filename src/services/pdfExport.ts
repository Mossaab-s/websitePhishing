import jsPDF from 'jspdf';
import { User, QuizResult } from '../types';
import { quizQuestions } from '../data/quizData';

// Fonction utilitaire pour convertir une image en base64 avec redimensionnement
const getImageAsBase64 = async (imagePath: string): Promise<{ data: string; width: number; height: number } | null> => {
  try {
    const response = await fetch(imagePath);
    const blob = await response.blob();
     
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        // Calculer les dimensions pour maintenir le ratio
        const maxWidth = 150;
        const maxHeight = 100;
        let { width, height } = img;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;
        
        // Dessiner l'image redimensionnée
        ctx.drawImage(img, 0, 0, width, height);
        
        resolve({
          data: canvas.toDataURL('image/jpeg', 0.8),
          width,
          height
        });
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(blob);
    });
  } catch (error) {
    console.warn(`Impossible de charger l'image ${imagePath}:`, error);
    return null;
  }
};

// Fonction pour créer un graphique des résultats
const createResultsChart = async (quizResult: QuizResult): Promise<string> => {
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 300;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return '';

  const correctAnswers = quizResult.score;
  const incorrectAnswers = quizResult.totalQuestions - quizResult.score;
  
  // Configuration du graphique en camembert
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = 80;
  
  // Couleurs
  const correctColor = '#10B981'; // Vert
  const incorrectColor = '#EF4444'; // Rouge
  
  // Calcul des angles
  const correctAngle = (correctAnswers / quizResult.totalQuestions) * 2 * Math.PI;
  const incorrectAngle = (incorrectAnswers / quizResult.totalQuestions) * 2 * Math.PI;
  
  // Fond blanc
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Dessiner le camembert
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.arc(centerX, centerY, radius, 0, correctAngle);
  ctx.closePath();
  ctx.fillStyle = correctColor;
  ctx.fill();
  
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.arc(centerX, centerY, radius, correctAngle, correctAngle + incorrectAngle);
  ctx.closePath();
  ctx.fillStyle = incorrectColor;
  ctx.fill();
  
  // Bordures
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.stroke();
  
  // Légende
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 16px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Résultats du Quiz', centerX, 30);
  
  // Pourcentage au centre
  const percentage = Math.round((correctAnswers / quizResult.totalQuestions) * 100);
  ctx.font = 'bold 24px Arial';
  ctx.fillStyle = '#1F2937';
  ctx.fillText(`${percentage}%`, centerX, centerY + 8);
  
  // Légende en bas
  ctx.font = '14px Arial';
  ctx.textAlign = 'left';
  
  // Bonnes réponses
  ctx.fillStyle = correctColor;
  ctx.fillRect(centerX - 80, canvas.height - 60, 15, 15);
  ctx.fillStyle = '#000000';
  ctx.fillText(`Bonnes réponses: ${correctAnswers}`, centerX - 60, canvas.height - 48);
  
  // Mauvaises réponses
  ctx.fillStyle = incorrectColor;
  ctx.fillRect(centerX - 80, canvas.height - 35, 15, 15);
  ctx.fillStyle = '#000000';
  ctx.fillText(`Mauvaises réponses: ${incorrectAnswers}`, centerX - 60, canvas.height - 23);
  
  return canvas.toDataURL('image/png');
};

// Fonction pour créer un graphique en barres des réponses par question
const createDetailedChart = async (quizResult: QuizResult): Promise<string> => {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 400;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return '';

  // Fond blanc
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  const margin = 60;
  const chartWidth = canvas.width - 2 * margin;
  const chartHeight = canvas.height - 2 * margin;
  const barWidth = chartWidth / quizResult.totalQuestions;
  
  // Titre
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 18px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Détail des réponses par question', canvas.width / 2, 30);
  
  // Dessiner les barres
  quizResult.answers.forEach((answer, index) => {
    const isCorrect = answer === quizQuestions[index].correctAnswer;
    const x = margin + index * barWidth;
    const barHeight = chartHeight * 0.8;
    const y = margin + chartHeight - barHeight;
    
    // Barre
    ctx.fillStyle = isCorrect ? '#10B981' : '#EF4444';
    ctx.fillRect(x + barWidth * 0.1, y, barWidth * 0.8, barHeight);
    
    // Bordure
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.strokeRect(x + barWidth * 0.1, y, barWidth * 0.8, barHeight);
    
    // Numéro de question
    ctx.fillStyle = '#000000';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Q${index + 1}`, x + barWidth / 2, canvas.height - 20);
    
    // Symbole de résultat (texte simple)
    ctx.font = '16px Arial';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(isCorrect ? 'OK' : 'KO', x + barWidth / 2, y + barHeight / 2);
  });
  
  // Axes
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 1;
  
  // Axe X
  ctx.beginPath();
  ctx.moveTo(margin, margin + chartHeight);
  ctx.lineTo(margin + chartWidth, margin + chartHeight);
  ctx.stroke();
  
  // Axe Y
  ctx.beginPath();
  ctx.moveTo(margin, margin);
  ctx.lineTo(margin, margin + chartHeight);
  ctx.stroke();
  
  // Légende
  ctx.font = '12px Arial';
  ctx.textAlign = 'left';
  
  // Bonne réponse
  ctx.fillStyle = '#10B981';
  ctx.fillRect(margin, 50, 15, 15);
  ctx.fillStyle = '#000000';
  ctx.fillText('Bonne réponse', margin + 20, 62);
  
  // Mauvaise réponse
  ctx.fillStyle = '#EF4444';
  ctx.fillRect(margin + 120, 50, 15, 15);
  ctx.fillStyle = '#000000';
  ctx.fillText('Mauvaise réponse', margin + 140, 62);
  
  return canvas.toDataURL('image/png');
};

export const generateTrainingPDF = async (user: User, quizResult?: QuizResult): Promise<void> => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = margin;

  // Configuration des polices
  pdf.setFont('helvetica');

  // === PAGE DE COUVERTURE ===
  // Fond dégradé simulé
  pdf.setFillColor(37, 99, 235);
  pdf.rect(0, 0, pageWidth, pageHeight / 3, 'F');
  
  pdf.setFillColor(59, 130, 246);
  pdf.rect(0, pageHeight / 3, pageWidth, pageHeight / 3, 'F');
  
  pdf.setFillColor(147, 197, 253);
  pdf.rect(0, (pageHeight * 2) / 3, pageWidth, pageHeight / 3, 'F');

  // Titre principal
  pdf.setFontSize(28);
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  const titleLines = pdf.splitTextToSize('FORMATION ANTI-PHISHING', pageWidth - 2 * margin);
  pdf.text(titleLines, pageWidth / 2, 60, { align: 'center' });

  // Sous-titre
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Reconnaître et éviter les pièges du phishing', pageWidth / 2, 80, { align: 'center' });

  // Logo simulé (bouclier)
  pdf.setFillColor(255, 255, 255);
  pdf.circle(pageWidth / 2, 110, 15, 'F');
  pdf.setFontSize(20);
  pdf.setTextColor(37, 99, 235);
  pdf.text('SECURITE', pageWidth / 2, 115, { align: 'center' });

  // Informations participant
  pdf.setFontSize(14);
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.text('PARTICIPANT', pageWidth / 2, 150, { align: 'center' });
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`${user.firstName} ${user.lastName}`, pageWidth / 2, 165, { align: 'center' });
  pdf.text(`Entreprise: ${user.company}`, pageWidth / 2, 175, { align: 'center' });
  pdf.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, pageWidth / 2, 185, { align: 'center' });

  // Pied de page
  pdf.setFontSize(10);
  pdf.setTextColor(255, 255, 255);
  pdf.text('Support de formation professionnel', pageWidth / 2, pageHeight - 20, { align: 'center' });

  // === PAGE 2: TABLE DES MATIÈRES ===
  pdf.addPage();
  yPosition = margin;

  pdf.setFillColor(248, 250, 252);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');

  pdf.setFontSize(20);
  pdf.setTextColor(37, 99, 235);
  pdf.setFont('helvetica', 'bold');
  pdf.text('TABLE DES MATIERES', margin, yPosition);
  yPosition += 20;

  const tableOfContents = [
    { title: '1. Contexte & Introduction', page: '3' },
    { title: '2. Reconnaître un email de phishing', page: '4' },
    { title: '3. Exemples concrets de phishing', page: '5' },
    { title: '4. Réagir correctement', page: '8' },
    { title: '5. Résultats du quiz', page: '9' },
    { title: '6. Recommandations finales', page: '10' }
  ];

  pdf.setFontSize(12);
  pdf.setTextColor(0, 0, 0);
  pdf.setFont('helvetica', 'normal');

  tableOfContents.forEach((item, index) => {
    pdf.text(`${item.title}`, margin + 5, yPosition);
    pdf.text(`${item.page}`, pageWidth - margin - 10, yPosition);
    
    // Ligne pointillée
    const dotCount = Math.floor((pageWidth - 2 * margin - 50) / 3);
    let dotLine = '';
    for (let i = 0; i < dotCount; i++) {
      dotLine += '.';
    }
    pdf.setTextColor(150, 150, 150);
    pdf.text(dotLine, margin + 80, yPosition);
    pdf.setTextColor(0, 0, 0);
    
    yPosition += 12;
  });

  // === PAGE 3: CONTEXTE & INTRODUCTION ===
  pdf.addPage();
  yPosition = margin;

  // En-tête de section
  pdf.setFillColor(34, 197, 94);
  pdf.rect(0, 0, pageWidth, 25, 'F');
  pdf.setFontSize(16);
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.text('1. CONTEXTE & INTRODUCTION', margin, 18);

  yPosition = 40;
  pdf.setTextColor(0, 0, 0);
  pdf.setFont('helvetica', 'normal');

  // Contenu de la section 1
  const section1Content = [
    {
      title: "Qu'est-ce que le phishing ?",
      content: [
        "Le phishing (ou hameçonnage) est une attaque qui consiste à se faire passer pour un tiers de confiance (Google, un collègue, un fournisseur) afin de vous pousser à :",
        "• Fournir vos identifiants/mots de passe",
        "• Cliquer sur un lien piégé",
        "• Ouvrir une pièce jointe infectée",
        "• Réaliser une action (virement, changement RIB...)"
      ]
    },
    {
      title: "Pourquoi est-ce utilisé ?",
      content: [
        "• Accès aux comptes professionnels (Drive, Gmail, etc.)",
        "• Usurpation d'identité pour piéger d'autres employés ou partenaires",
        "• Vol de données sensibles (clients, fournisseurs, projets)",
        "• Rançongiciels / sabotages"
      ]
    },
    {
      title: "Risques pour l'entreprise",
      content: [
        "• Perte ou vol de données",
        "• Blocage de services",
        "• Dommages à l'image",
        "• Sanctions RGPD",
        "• Pertes financières (fraude, rançon, escroquerie)"
      ]
    }
  ];

  section1Content.forEach(section => {
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(37, 99, 235);
    pdf.text(section.title, margin, yPosition);
    yPosition += 8;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);

    section.content.forEach(line => {
      const lines = pdf.splitTextToSize(line, pageWidth - 2 * margin);
      pdf.text(lines, margin, yPosition);
      yPosition += lines.length * 5 + 2;
    });
    yPosition += 5;
  });

  // === PAGE 4: RECONNAÎTRE UN EMAIL DE PHISHING ===
  pdf.addPage();
  yPosition = margin;

  // En-tête de section
  pdf.setFillColor(245, 158, 11);
  pdf.rect(0, 0, pageWidth, 25, 'F');
  pdf.setFontSize(16);
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.text('2. RECONNAITRE UN EMAIL DE PHISHING', margin, 18);

  yPosition = 40;
  pdf.setTextColor(0, 0, 0);

  // Comparaison email légitime vs frauduleux
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Analyse comparative : email légitime vs frauduleux', margin, yPosition);
  yPosition += 15;

  // Tableau comparatif
  pdf.setFillColor(220, 252, 231);
  pdf.rect(margin, yPosition, (pageWidth - 2 * margin) / 2 - 5, 30, 'F');
  pdf.setFillColor(254, 226, 226);
  pdf.rect(margin + (pageWidth - 2 * margin) / 2 + 5, yPosition, (pageWidth - 2 * margin) / 2 - 5, 30, 'F');

  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(21, 128, 61);
  pdf.text('BON email Google', margin + 5, yPosition + 8);
  pdf.setTextColor(185, 28, 28);
  pdf.text('FAUX email', margin + (pageWidth - 2 * margin) / 2 + 10, yPosition + 8);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  pdf.text('noreply@google.com', margin + 5, yPosition + 20);
  pdf.text('noreplv@goog1e-sec.com', margin + (pageWidth - 2 * margin) / 2 + 10, yPosition + 20);

  yPosition += 40;

  // Points de vigilance
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(37, 99, 235);
  pdf.text('Points de vigilance à observer :', margin, yPosition);
  yPosition += 10;

  const vigilancePoints = [
    "Adresse d'expéditeur",
    "Liens (vérifier avant de cliquer)",
    "Ton alarmiste ou urgent",
    "Pièces jointes inattendues",
    "Demandes inhabituelles ou pressées",
    "Fautes d'orthographe ou de grammaire"
  ];

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 0, 0);

  vigilancePoints.forEach(point => {
    pdf.text(`• ${point}`, margin + 5, yPosition);
    yPosition += 8;
  });

  // Astuce importante
  yPosition += 10;
  pdf.setFillColor(219, 234, 254);
  pdf.rect(margin, yPosition, pageWidth - 2 * margin, 25, 'F');
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(30, 64, 175);
  pdf.text('ASTUCE IMPORTANTE', margin + 5, yPosition + 8);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  const astuce = "Survolez toujours un lien avant de cliquer pour voir sa vraie destination. L'URL affichée peut être différente de l'URL réelle.";
  const astuceLines = pdf.splitTextToSize(astuce, pageWidth - 2 * margin - 10);
  pdf.text(astuceLines, margin + 5, yPosition + 18);

  // === PAGES 5-7: EXEMPLES CONCRETS ===
  const examples = [
    {
      title: "Fausse notification Google Chat",
      imagePath: "/exemple 2.JPG",
      email: "noreply@gpolge.com",
      link: "https://53e6af34.identityhorizon.com/?d=dflMacBxhDgMWyG5r0Jug",
      explanation: "Email de phishing imitant Google Chat. L'adresse 'gpolge.com' n'est pas Google, et le lien pointe vers un domaine frauduleux 'identityhorizon.com'."
    },
    {
      title: "Faux problème de connexion",
      imagePath: "/exemple 3.JPG",
      email: "noreply@gpolge.com",
      link: "https://53e6af34.identityhorizon.com/?d=dflMacBxhDgMWyG5r0Jug",
      explanation: "Tentative d'imitation d'un partage Google Drive. L'adresse 'goolge.com' (avec deux 'o') n'est pas le vrai domaine Google."
    },
    {
      title: "Fausse alerte de sécurité Google",
      imagePath: "/exemple 4.JPG",
      email: "noreply@gpolge.com",
      link: "https://53e6af34.identityhorizon.com/?d=dflMacBxhDgMWyG5r0Jug",
      explanation: "Email alarmiste prétendant détecter des problèmes de sécurité. Le domaine 'gpolge.com' est frauduleux."
    },
    {
      title: "Fausse notification de connexion",
      imagePath: "/exemple 5.JPG",
      email: "noreply@gpolge.com",
      link: "https://53e6af34.identityhorizon.com/?d=dflMacBxhDgMWyG5r0Jug",
      explanation: "Notification de connexion frauduleuse. Bien que le format ressemble aux vraies notifications Google, l'adresse d'expédition et le lien de consultation sont suspects."
    },
    {
      title: "Fausse alerte de sécurité avec urgence",
      imagePath: "/exemple 6.JPG",
      email: "noreply@gpolge.com",
      link: "https://53e6af34.identityhorizon.com/?d=dflMacBxhDgMWyG5r0Jug",
      explanation: "Email créant un sentiment d'urgence avec '2 problèmes de sécurité détectés'. Le ton alarmiste, l'adresse frauduleuse et le lien suspect sont des signaux d'alarme typiques du phishing."
    }
  ];

  for (let i = 0; i < examples.length; i++) {
    pdf.addPage();
    yPosition = margin;

    // En-tête de section
    pdf.setFillColor(249, 115, 22);
    pdf.rect(0, 0, pageWidth, 25, 'F');
    pdf.setFontSize(16);
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    if (i === 0) {
      pdf.text('3. EXEMPLES CONCRETS DE PHISHING', margin, 18);
    }

    yPosition = 40;

    // Titre de l'exemple
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Exemple ${i + 1}: ${examples[i].title}`, margin, yPosition);
    yPosition += 15;

    // Charger et insérer l'image avec redimensionnement
    try {
      const imageData = await getImageAsBase64(examples[i].imagePath);
      if (imageData) {
        // Centrer l'image
        const imgX = (pageWidth - imageData.width * 0.75) / 2;
        pdf.addImage(imageData.data, 'JPEG', imgX, yPosition, imageData.width * 0.75, imageData.height * 0.75);
        yPosition += imageData.height * 0.75 + 10;
      } else {
        // Si l'image ne peut pas être chargée, afficher un placeholder
        pdf.setFillColor(240, 240, 240);
        pdf.rect(margin, yPosition, pageWidth - 2 * margin, 60, 'F');
        pdf.setFontSize(12);
        pdf.setTextColor(100, 100, 100);
        pdf.text('[Image de l\'exemple de phishing]', pageWidth / 2, yPosition + 30, { align: 'center' });
        yPosition += 70;
      }
    } catch (error) {
      console.warn(`Impossible de charger l'image ${examples[i].imagePath}`);
      // Placeholder en cas d'erreur
      pdf.setFillColor(240, 240, 240);
      pdf.rect(margin, yPosition, pageWidth - 2 * margin, 60, 'F');
      pdf.setFontSize(12);
      pdf.setTextColor(100, 100, 100);
      pdf.text('[Image de l\'exemple de phishing]', pageWidth / 2, yPosition + 30, { align: 'center' });
      yPosition += 70;
    }

    // Éléments suspects
    pdf.setFillColor(254, 226, 226);
    pdf.rect(margin, yPosition, pageWidth - 2 * margin, 35, 'F');
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(185, 28, 28);
    pdf.text('ELEMENTS SUSPECTS IDENTIFIES :', margin + 5, yPosition + 8);
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Expéditeur : ${examples[i].email}`, margin + 5, yPosition + 18);
    
    const linkText = `Lien suspect : ${examples[i].link}`;
    const linkLines = pdf.splitTextToSize(linkText, pageWidth - 2 * margin - 10);
    pdf.text(linkLines, margin + 5, yPosition + 28);
    
    yPosition += 45;

    // Explication
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(37, 99, 235);
    pdf.text('Analyse :', margin, yPosition);
    yPosition += 8;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    const explanationLines = pdf.splitTextToSize(examples[i].explanation, pageWidth - 2 * margin);
    pdf.text(explanationLines, margin, yPosition);
    yPosition += explanationLines.length * 5 + 10;

    // Avertissement
    pdf.setFillColor(254, 243, 199);
    pdf.rect(margin, yPosition, pageWidth - 2 * margin, 20, 'F');
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(146, 64, 14);
    const warningText = "ATTENTION : Tous ces liens pointent vers le domaine frauduleux 'identityhorizon.com' qui n'a aucun rapport avec Google !";
    const warningLines = pdf.splitTextToSize(warningText, pageWidth - 2 * margin - 10);
    pdf.text(warningLines, margin + 5, yPosition + 8);
  }

  // === PAGE 8: RÉAGIR CORRECTEMENT ===
  pdf.addPage();
  yPosition = margin;

  // En-tête de section
  pdf.setFillColor(59, 130, 246);
  pdf.rect(0, 0, pageWidth, 25, 'F');
  pdf.setFontSize(16);
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.text('4. REAGIR CORRECTEMENT', margin, 18);

  yPosition = 40;

  // Procédure à suivre
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);
  pdf.setFont('helvetica', 'bold');
  pdf.text('En cas de doute, suivez cette procédure :', margin, yPosition);
  yPosition += 15;

  const procedures = [
    {
      step: "1",
      title: "Ne pas cliquer, ne pas répondre",
      description: "Résistez à l'urgence. Prenez le temps de réfléchir."
    },
    {
      step: "2", 
      title: "Vérifier avec l'IT / l'expéditeur par un autre canal",
      description: "Téléphone, chat interne, ou rencontre en personne."
    },
    {
      step: "3",
      title: "Signaler dans Gmail",
      description: "Utilisez le bouton 'Signaler un hameçonnage'."
    },
    {
      step: "4",
      title: "Supprimer l'email",
      description: "Éliminez la source de la menace."
    }
  ];

  procedures.forEach(proc => {
    pdf.setFillColor(248, 250, 252);
    pdf.rect(margin, yPosition, pageWidth - 2 * margin, 20, 'F');
    
    // Numéro d'étape
    pdf.setFillColor(255, 255, 255);
    pdf.circle(margin + 10, yPosition + 10, 6, 'F');
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(37, 99, 235);
    pdf.text(proc.step, margin + 10, yPosition + 13, { align: 'center' });
    
    // Titre et description
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text(proc.title, margin + 20, yPosition + 8);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(75, 85, 99);
    pdf.text(proc.description, margin + 20, yPosition + 16);
    
    yPosition += 25;
  });

  // Règle d'or
  yPosition += 10;
  pdf.setFillColor(254, 243, 199);
  pdf.rect(margin, yPosition, pageWidth - 2 * margin, 25, 'F');
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(146, 64, 14);
  pdf.text('REGLE D\'OR', margin + 5, yPosition + 8);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(11);
  const ruleText = "Mieux vaut perdre 5 minutes à vérifier qu'une semaine à réparer les dégâts d'une cyberattaque.";
  const ruleLines = pdf.splitTextToSize(ruleText, pageWidth - 2 * margin - 10);
  pdf.text(ruleLines, margin + 5, yPosition + 18);

  // === PAGE 9: RÉSULTATS DU QUIZ ===
  if (quizResult) {
    pdf.addPage();
    yPosition = margin;

    // En-tête de section
    pdf.setFillColor(168, 85, 247);
    pdf.rect(0, 0, pageWidth, 25, 'F');
    pdf.setFontSize(16);
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.text('5. RESULTATS DU QUIZ', margin, 18);

    yPosition = 40;

    // Résumé des résultats
    const percentage = Math.round((quizResult.score / quizResult.totalQuestions) * 100);
    const isPassed = percentage >= 70;

    pdf.setFontSize(18);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Résumé de vos performances', margin, yPosition);
    yPosition += 15;

    // Score principal
    pdf.setFillColor(isPassed ? 220 : 254, isPassed ? 252 : 226, isPassed ? 231 : 226);
    pdf.rect(margin, yPosition, pageWidth - 2 * margin, 30, 'F');
    
    pdf.setFontSize(24);
    pdf.setTextColor(isPassed ? 21 : 185, isPassed ? 128 : 28, isPassed ? 61 : 28);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${percentage}%`, pageWidth / 2, yPosition + 20, { align: 'center' });
    
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${quizResult.score}/${quizResult.totalQuestions} bonnes réponses`, pageWidth / 2, yPosition + 8, { align: 'center' });

    yPosition += 40;

    // Statut
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(isPassed ? 21 : 185, isPassed ? 128 : 28, isPassed ? 61 : 28);
    pdf.text(`Statut : ${isPassed ? 'FORMATION REUSSIE' : 'A AMELIORER'}`, margin, yPosition);
    yPosition += 15;

    // Message personnalisé
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    const message = isPassed 
      ? "Félicitations ! Vous maîtrisez bien les concepts de sécurité anti-phishing. Continuez à appliquer ces bonnes pratiques au quotidien."
      : "Nous recommandons de revoir la formation pour améliorer vos connaissances. La sécurité informatique est l'affaire de tous.";
    const messageLines = pdf.splitTextToSize(message, pageWidth - 2 * margin);
    pdf.text(messageLines, margin, yPosition);
    yPosition += messageLines.length * 5 + 15;

    // Graphique en camembert
    try {
      const chartImage = await createResultsChart(quizResult);
      if (chartImage) {
        pdf.addImage(chartImage, 'PNG', margin, yPosition, 80, 60);
      }
    } catch (error) {
      console.warn('Erreur lors de la création du graphique:', error);
    }

    // Graphique détaillé sur une nouvelle page
    pdf.addPage();
    yPosition = margin;

    pdf.setFontSize(16);
    pdf.setTextColor(37, 99, 235);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Analyse détaillée par question', margin, yPosition);
    yPosition += 20;

    try {
      const detailedChart = await createDetailedChart(quizResult);
      if (detailedChart) {
        pdf.addImage(detailedChart, 'PNG', margin, yPosition, pageWidth - 2 * margin, 80);
        yPosition += 90;
      }
    } catch (error) {
      console.warn('Erreur lors de la création du graphique détaillé:', error);
    }

    // Détail des réponses (première partie)
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Détail de vos réponses :', margin, yPosition);
    yPosition += 10;

    quizQuestions.slice(0, 8).forEach((question, index) => {
      if (yPosition > pageHeight - 40) {
        pdf.addPage();
        yPosition = margin;
      }

      const userAnswer = quizResult.answers[index];
      const isCorrect = userAnswer === question.correctAnswer;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      
      // Question
      const questionText = `Q${index + 1}: ${question.question}`;
      const questionLines = pdf.splitTextToSize(questionText, pageWidth - 2 * margin);
      pdf.text(questionLines, margin, yPosition);
      yPosition += questionLines.length * 4 + 3;

      // Réponse utilisateur
      pdf.setTextColor(isCorrect ? 21 : 185, isCorrect ? 128 : 28, isCorrect ? 61 : 28);
      pdf.text(`${isCorrect ? 'CORRECT' : 'INCORRECT'} - Votre réponse : ${question.options[userAnswer]}`, margin + 5, yPosition);
      yPosition += 5;

      // Bonne réponse si incorrect
      if (!isCorrect) {
        pdf.setTextColor(21, 128, 61);
        pdf.text(`Bonne réponse : ${question.options[question.correctAnswer]}`, margin + 5, yPosition);
        yPosition += 5;
      }

      yPosition += 8;
    });
  }

  // === PAGE FINALE: RECOMMANDATIONS ===
  pdf.addPage();
  yPosition = margin;

  // En-tête de section
  pdf.setFillColor(16, 185, 129);
  pdf.rect(0, 0, pageWidth, 25, 'F');
  pdf.setFontSize(16);
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.text('6. RECOMMANDATIONS FINALES', margin, 18);

  yPosition = 40;

  // Recommandations
  const recommendations = [
    "Vérifiez toujours l'expéditeur avant d'ouvrir un email",
    "Survolez les liens pour voir leur vraie destination",
    "En cas de doute, contactez l'expéditeur par un autre moyen",
    "Signalez immédiatement tout email suspect à votre IT",
    "Participez régulièrement aux formations de sécurité",
    "Maintenez vos logiciels à jour",
    "Utilisez des mots de passe forts et uniques",
    "Activez l'authentification à deux facteurs quand possible"
  ];

  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Bonnes pratiques à retenir :', margin, yPosition);
  yPosition += 15;

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');

  recommendations.forEach(rec => {
    const lines = pdf.splitTextToSize(`• ${rec}`, pageWidth - 2 * margin - 5);
    pdf.text(lines, margin, yPosition);
    yPosition += lines.length * 5 + 3;
  });

  yPosition += 15;

  // Message de conclusion
  pdf.setFillColor(219, 234, 254);
  pdf.rect(margin, yPosition, pageWidth - 2 * margin, 40, 'F');
  
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(30, 64, 175);
  pdf.text('MESSAGE FINAL', margin + 5, yPosition + 10);
  
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 0, 0);
  const finalMessage = "La sécurité informatique est l'affaire de tous. Chaque employé est un maillon essentiel dans la chaîne de protection de l'entreprise. Votre vigilance et l'application de ces bonnes pratiques contribuent directement à la sécurité de tous.";
  const finalLines = pdf.splitTextToSize(finalMessage, pageWidth - 2 * margin - 10);
  pdf.text(finalLines, margin + 5, yPosition + 20);

  // Pied de page sur toutes les pages
  const totalPages = pdf.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(128, 128, 128);
    
    // Ligne de séparation
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
    
    // Informations du pied de page
    pdf.text(
      `Formation Anti-Phishing - ${user.company}`,
      margin,
      pageHeight - 8
    );
    pdf.text(
      `${user.firstName} ${user.lastName} - Page ${i}/${totalPages}`,
      pageWidth - margin,
      pageHeight - 8,
      { align: 'right' }
    );
  }

  // Télécharger le PDF
  const filename = `support-formation-anti-phishing-${user.firstName}-${user.lastName}-${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(filename);
};