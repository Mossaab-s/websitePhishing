import { QuizResult } from '../types';

// Fonction pour convertir les résultats en CSV
export const exportToCSV = (results: QuizResult[]): string => {
  const headers = [
    'Prénom',
    'Nom',
    'Score',
    'Total Questions',
    'Pourcentage',
    'Date de completion',
    'Détail des réponses'
  ];

  const csvContent = [
    headers.join(','),
    ...results.map(result => [
      result.user.firstName,
      result.user.lastName,
      result.score.toString(),
      result.totalQuestions.toString(),
      `${Math.round((result.score / result.totalQuestions) * 100)}%`,
      new Date(result.completedAt).toLocaleString('fr-FR'),
      `"${result.answers.join(';')}"`
    ].join(','))
  ].join('\n');

  return csvContent;
};

// Fonction pour télécharger le fichier CSV
export const downloadCSV = (results: QuizResult[], filename: string = 'resultats-quiz-phishing.csv') => {
  const csvContent = exportToCSV(results);
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// Simulation d'une connexion à Google Sheets
export const saveQuizResult = async (result: QuizResult): Promise<boolean> => {
  try {
    console.log('Sauvegarde des résultats du quiz:', result);
    
    // Simulation d'un délai réseau
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Sauvegarde en localStorage pour la démo
    const existingResults = JSON.parse(localStorage.getItem('quiz-results') || '[]');
    const newResult = {
      ...result,
      id: Date.now(),
      timestamp: new Date().toISOString()
    };
    existingResults.push(newResult);
    localStorage.setItem('quiz-results', JSON.stringify(existingResults));
    
    // Sauvegarde automatique en CSV dans le navigateur
    const allResults = getStoredResults();
    if (allResults.length > 0) {
      // Optionnel : téléchargement automatique après chaque quiz
      // downloadCSV(allResults);
    }
    
    return true;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
    return false;
  }
};

export const getStoredResults = (): QuizResult[] => {
  try {
    return JSON.parse(localStorage.getItem('quiz-results') || '[]');
  } catch {
    return [];
  }
};

export const clearStoredResults = (): void => {
  localStorage.removeItem('quiz-results');
};

// Fonction pour exporter tous les résultats
export const exportAllResults = (): void => {
  const results = getStoredResults();
  if (results.length === 0) {
    alert('Aucun résultat à exporter');
    return;
  }
  
  const filename = `resultats-quiz-phishing-${new Date().toISOString().split('T')[0]}.csv`;
  downloadCSV(results, filename);
};