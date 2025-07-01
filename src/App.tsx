import React, { useState } from 'react';
import { 
  Shield, 
  Mail, 
  Target, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  ExternalLink,
  FileText,
  Clock,
  Trophy,
  Settings,
  Download
} from 'lucide-react';

import LoginForm from './components/LoginForm';
import TrainingSection from './components/TrainingSection';
import EmailExample from './components/EmailExample';
import RealEmailExample from './components/RealEmailExample';
import Quiz from './components/Quiz';
import ProgressBar from './components/ProgressBar';
import AdminPanel from './components/AdminPanel';

import { quizQuestions } from './data/quizData';
import { saveQuizResult } from './services/googleSheets';
import { generateTrainingPDF } from './services/pdfExport';
import { User, QuizResult, TrainingSection as TSectionType } from './types';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const sections: TSectionType[] = [
    { id: 1, title: "Contexte & Introduction", duration: "10 min", completed: false },
    { id: 2, title: "Reconnaître un email de phishing", duration: "15 min", completed: false },
    { id: 3, title: "Exemples concrets & mise en situation", duration: "15 min", completed: false },
    { id: 4, title: "Réagir correctement", duration: "10 min", completed: false },
    { id: 5, title: "Quiz de fin", duration: "10 min", completed: false }
  ];

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleSectionComplete = (sectionId: number) => {
    setCompletedSections(prev => new Set([...prev, sectionId]));
    if (sectionId < 5) {
      setCurrentStep(sectionId);
    }
  };

  const handleQuizComplete = async (result: QuizResult) => {
    setQuizResult(result);
    
    // Sauvegarder les résultats
    const saved = await saveQuizResult(result);
    if (saved) {
      console.log('Résultats sauvegardés avec succès');
    }
    
    setCompletedSections(prev => new Set([...prev, 5]));
  };

  const handleExportPDF = async () => {
    if (user) {
      setIsGeneratingPDF(true);
      try {
        await generateTrainingPDF(user, quizResult || undefined);
      } catch (error) {
        console.error('Erreur lors de la génération du PDF:', error);
        alert('Erreur lors de la génération du PDF. Veuillez réessayer.');
      } finally {
        setIsGeneratingPDF(false);
      }
    }
  };

  // Mode administrateur (accessible via un raccourci clavier)
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        setShowAdmin(!showAdmin);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showAdmin]);

  if (showAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <button
              onClick={() => setShowAdmin(false)}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200"
            >
              ← Retour à la formation
            </button>
          </div>
          <AdminPanel />
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm onLogin={handleLogin} />;
  }

  const totalSections = sections.length;
  const completedCount = completedSections.size;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Formation Anti-Phishing
                </h1>
                <p className="text-sm text-gray-600">
                  Bienvenue, {user.firstName} {user.lastName} ({user.company})
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleExportPDF}
                disabled={isGeneratingPDF}
                className="flex items-center bg-green-600 text-white px-3 py-2 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-sm"
                title="Télécharger le support de formation complet en PDF"
              >
                {isGeneratingPDF ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                    Génération...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-1" />
                    Support PDF
                  </>
                )}
              </button>
              <button
                onClick={() => setShowAdmin(true)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                title="Panneau d'administration (Ctrl+Shift+A)"
              >
                <Settings className="w-5 h-5" />
              </button>
              <div className="text-right">
                <div className="text-sm text-gray-600 mb-1">Progression</div>
                <div className="text-lg font-bold text-blue-600">
                  {completedCount}/{totalSections}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <ProgressBar current={completedCount} total={totalSections} />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Section 1: Contexte & Introduction */}
        {currentStep >= 0 && (
          <TrainingSection
            sectionNumber={1}
            title="Contexte & Introduction"
            duration="10 min"
            isCompleted={completedSections.has(1)}
            onComplete={() => handleSectionComplete(1)}
          >
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-green-600" />
                  Qu'est-ce que le phishing ?
                </h3>
                <p className="text-gray-700 mb-4">
                  Le phishing (ou hameçonnage) est une attaque qui consiste à se faire passer pour un tiers de confiance 
                  (Google, un collègue, un fournisseur) afin de vous pousser à :
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Fournir vos identifiants/mots de passe</li>
                  <li>Cliquer sur un lien piégé</li>
                  <li>Ouvrir une pièce jointe infectée</li>
                  <li>Réaliser une action (virement, changement RIB...)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-orange-600" />
                  Pourquoi est-ce utilisé ?
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Accès aux comptes professionnels (Drive, Gmail, etc.)</li>
                  <li>Usurpation d'identité pour piéger d'autres employés ou partenaires</li>
                  <li>Vol de données sensibles (clients, fournisseurs, projets)</li>
                  <li>Rançongiciels / sabotages</li>
                </ul>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-red-800 mb-3 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Risques pour l'entreprise
                </h3>
                <ul className="list-disc list-inside space-y-2 text-red-700 ml-4">
                  <li>Perte ou vol de données</li>
                  <li>Blocage de services</li>
                  <li>Dommages à l'image</li>
                  <li>Sanctions RGPD</li>
                  <li>Pertes financières (fraude, rançon, escroquerie)</li>
                </ul>
              </div>
            </div>
          </TrainingSection>
        )}

        {/* Section 2: Reconnaître un email de phishing */}
        {currentStep >= 1 && (
          <TrainingSection
            sectionNumber={2}
            title="Reconnaître un email de phishing"
            duration="15 min"
            isCompleted={completedSections.has(2)}
            onComplete={() => handleSectionComplete(2)}
          >
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Analyse comparative : email légitime vs frauduleux
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Bon email Google
                    </h4>
                    <div className="font-mono text-sm bg-white p-2 rounded border">
                      noreply@google.com
                    </div>
                  </div>
                  
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-800 mb-2 flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      Faux email
                    </h4>
                    <div className="font-mono text-sm bg-white p-2 rounded border">
                      noreplv@goog1e-sec.com
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Points de vigilance à observer :
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    'Adresse d\'expéditeur',
                    'Liens (vérifier avant de cliquer)',
                    'Ton alarmiste ou urgent',
                    'Pièces jointes inattendues',
                    'Demandes inhabituelles ou pressées',
                    'Fautes d\'orthographe ou de grammaire'
                  ].map((point, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-gray-700">{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">💡 Astuce importante</h4>
                <p className="text-blue-700">
                  Survolez toujours un lien avant de cliquer pour voir sa vraie destination. 
                  L'URL affichée peut être différente de l'URL réelle.
                </p>
              </div>
            </div>
          </TrainingSection>
        )}

        {/* Section 3: Exemples concrets & mise en situation */}
        {currentStep >= 2 && (
          <TrainingSection
            sectionNumber={3}
            title="Exemples concrets & mise en situation"
            duration="15 min"
            isCompleted={completedSections.has(3)}
            onComplete={() => handleSectionComplete(3)}
          >
            <div className="space-y-6">
              <p className="text-gray-700">
                Analysez ces vrais exemples de phishing. Tous ces emails pointent vers le même domaine frauduleux 
                <span className="font-mono bg-red-100 text-red-800 px-2 py-1 rounded ml-1">identityhorizon.com</span>
              </p>

              {/* Vrais exemples de phishing avec les images fournies */}
              <RealEmailExample
                imagePath="/exemple 2.JPG"
                title="Fausse notification Google Chat"
                suspiciousEmail="noreply@gpolge.com"
                suspiciousLink="https://53e6af34.identityhorizon.com/?d=dflMacBxhDgMWyG5r0Jug"
                explanation="Email de phishing imitant Google Chat. L'adresse 'gpolge.com' n'est pas Google, et le lien pointe vers un domaine frauduleux 'identityhorizon.com'. Google n'envoie jamais de notifications de cette manière."
              />

              <RealEmailExample
                imagePath="/exemple 3.JPG"
                title="Faux problème de connexion "
                suspiciousEmail="noreply@gpolge.com"
                suspiciousLink="https://53e6af34.identityhorizon.com/?d=dflMacBxhDgMWyG5r0Jug"
                explanation="Tentative d'imitation d'un partage Google Drive. L'adresse 'goolge.com' (avec deux 'o') n'est pas le vrai domaine Google. Le bouton 'Ouvrir' redirige vers le site malveillant."
              />

              <RealEmailExample
                imagePath="/exemple 4.JPG"
                title="Fausse alerte de sécurité Google"
                suspiciousEmail="noreply@gpolge.com"
                suspiciousLink="https://53e6af34.identityhorizon.com/?d=dflMacBxhDgMWyG5r0Jug"
                explanation="Email alarmiste prétendant détecter des problèmes de sécurité. Le domaine 'gpolge.com' est frauduleux, et le lien de 'vérification' mène vers le site de phishing. Google utilise des processus de sécurité différents."
              />

              <RealEmailExample
                imagePath="/exemple 5.JPG"
                title="Fausse notification de connexion"
                suspiciousEmail="noreply@gpolge.com"
                suspiciousLink="https://53e6af34.identityhorizon.com/?d=dflMacBxhDgMWyG5r0Jug"
                explanation="Notification de connexion frauduleuse. Bien que le format ressemble aux vraies notifications Google, l'adresse d'expédition et le lien de consultation sont suspects. Toujours vérifier dans votre compte Google directement."
              />

              <RealEmailExample
                imagePath="/exemple 6.JPG"
                title="Fausse alerte de sécurité avec urgence"
                suspiciousEmail="noreply@gpolge.com"
                suspiciousLink="https://53e6af34.identityhorizon.com/?d=dflMacBxhDgMWyG5r0Jug"
                explanation="Email créant un sentiment d'urgence avec '2 problèmes de sécurité détectés'. Le ton alarmiste, l'adresse frauduleuse et le lien suspect sont des signaux d'alarme typiques du phishing."
              />

              {/* Exemples fictifs pour compléter */}
              <EmailExample
                from="noreply@google.com"
                subject="Nouveau document partagé dans Google Drive"
                content={`Bonjour,

Jean Dupont a partagé un document avec vous :

"Rapport mensuel - Mars 2024"

Accéder au document :
https://drive.google.com/file/d/1BxR7YQEa8vNyH4mK9/view

Ce lien expirera dans 7 jours.

Google Drive - ne pas répondre à cet email`}
                isPhishing={false}
                explanation="Email légitime de Google Drive. L'adresse est correcte, le lien pointe vers drive.google.com, et le format correspond aux notifications habituelles de partage Google Drive."
              />

              <EmailExample
                from="it-support@votre-entreprise.com"
                subject="Maintenance système - Confirmation mot de passe requise"
                content={`Bonjour,

Suite à la maintenance système de cette nuit, nous devons vérifier tous les comptes utilisateurs.

Veuillez confirmer votre mot de passe Google Workspace en répondant à cet email avec :
- Votre nom d'utilisateur
- Votre mot de passe actuel

Cette vérification est obligatoire avant 17h aujourd'hui.

Équipe IT`}
                isPhishing={true}
                explanation="PHISHING ! Un vrai service IT ne demande JAMAIS les mots de passe par email. C'est une règle absolue de sécurité. Toujours contacter l'IT par téléphone pour vérifier."
              />
            </div>
          </TrainingSection>
        )}

        {/* Section 4: Réagir correctement */}
        {currentStep >= 3 && (
          <TrainingSection
            sectionNumber={4}
            title="Réagir correctement"
            duration="10 min"
            isCompleted={completedSections.has(4)}
            onComplete={() => handleSectionComplete(4)}
          >
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-blue-600" />
                  En cas de doute, suivez cette procédure :
                </h3>
                
                <div className="space-y-4">
                  {[
                    {
                      step: 1,
                      title: "Ne pas cliquer, ne pas répondre",
                      description: "Résistez à l'urgence. Prenez le temps de réfléchir.",
                      icon: <AlertTriangle className="w-5 h-5 text-red-600" />
                    },
                    {
                      step: 2,
                      title: "Vérifier avec l'IT / l'expéditeur par un autre canal",
                      description: "Téléphone, chat interne, ou rencontre en personne.",
                      icon: <Users className="w-5 h-5 text-blue-600" />
                    },
                    {
                      step: 3,
                      title: "Signaler dans Gmail",
                      description: "Utilisez le bouton 'Signaler un hameçonnage' (⚠️).",
                      icon: <Mail className="w-5 h-5 text-orange-600" />
                    },
                    {
                      step: 4,
                      title: "Supprimer l'email",
                      description: "Éliminez la source de la menace.",
                      icon: <CheckCircle className="w-5 h-5 text-green-600" />
                    }
                  ].map((item) => (
                    <div key={item.step} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full border-2 border-gray-300 font-bold text-gray-700">
                        {item.step}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 flex items-center">
                          {item.icon}
                          <span className="ml-2">{item.title}</span>
                        </h4>
                        <p className="text-gray-600 mt-1">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2 flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Règle d'or
                </h4>
                <p className="text-yellow-700">
                  <strong>Mieux vaut perdre 5 minutes à vérifier qu'une semaine à réparer les dégâts d'une cyberattaque.</strong>
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Comment signaler un email suspect dans Gmail :
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                  <li>Ouvrez l'email suspect (sans cliquer sur les liens)</li>
                  <li>Cliquez sur les trois points (⋮) en haut à droite</li>
                  <li>Sélectionnez "Signaler un hameçonnage"</li>
                  <li>Gmail analysera l'email et protégera d'autres utilisateurs</li>
                </ol>
              </div>
            </div>
          </TrainingSection>
        )}

        {/* Section 5: Quiz */}
        {currentStep >= 4 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                5. Quiz de fin
              </h2>
              <p className="text-gray-600">
                Testez vos connaissances avec ce quiz de 15 questions
              </p>
            </div>

            <Quiz
              questions={quizQuestions}
              user={user}
              onComplete={handleQuizComplete}
            />
          </div>
        )}

        {/* Completion Summary */}
        {completedSections.size === totalSections && quizResult && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-green-800 mb-2">
              Formation terminée avec succès !
            </h2>
            <p className="text-green-700 mb-4">
              Vous avez complété tous les modules et obtenu {quizResult.score}/{quizResult.totalQuestions} au quiz final.
            </p>
            <div className="bg-white rounded-lg p-4 inline-block mb-4">
              <p className="text-sm text-gray-600">
                Vos résultats ont été sauvegardés automatiquement
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Les administrateurs peuvent exporter les données en CSV
              </p>
            </div>
            <button
              onClick={handleExportPDF}
              disabled={isGeneratingPDF}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center mx-auto"
            >
              {isGeneratingPDF ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Génération du support...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 mr-2" />
                  Télécharger le support complet PDF
                </>
              )}
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Shield className="w-4 h-4" />
              <span>Formation Anti-Phishing - Google Workspace</span>
            </div>
            <div className="text-sm text-gray-500">
              © 2024 - Sécurité Informatique
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;