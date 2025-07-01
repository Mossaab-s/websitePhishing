import React, { useState, useEffect } from 'react';
import { Download, Trash2, Users, BarChart3, Calendar, Trophy } from 'lucide-react';
import { getStoredResults, exportAllResults, clearStoredResults } from '../services/googleSheets';
import { QuizResult } from '../types';

export default function AdminPanel() {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = () => {
    const storedResults = getStoredResults();
    setResults(storedResults);
  };

  const handleExport = () => {
    exportAllResults();
  };

  const handleClearResults = () => {
    clearStoredResults();
    setResults([]);
    setShowConfirmClear(false);
  };

  const getStats = () => {
    if (results.length === 0) return { total: 0, avgScore: 0, passRate: 0 };
    
    const totalScore = results.reduce((sum, result) => sum + result.score, 0);
    const avgScore = Math.round((totalScore / results.length) * 100) / 100;
    const passCount = results.filter(result => (result.score / result.totalQuestions) >= 0.7).length;
    const passRate = Math.round((passCount / results.length) * 100);
    
    return {
      total: results.length,
      avgScore,
      passRate
    };
  };

  const stats = getStats();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <BarChart3 className="w-6 h-6 mr-2 text-blue-600" />
          Panneau d'administration
        </h2>
        <div className="flex space-x-3">
          <button
            onClick={handleExport}
            disabled={results.length === 0}
            className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <Download className="w-4 h-4 mr-2" />
            Exporter CSV
          </button>
          <button
            onClick={() => setShowConfirmClear(true)}
            disabled={results.length === 0}
            className="flex items-center bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Vider
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-blue-900">{stats.total}</div>
              <div className="text-sm text-blue-700">Participants</div>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <Trophy className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-green-900">{stats.avgScore}</div>
              <div className="text-sm text-green-700">Score moyen</div>
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center">
            <BarChart3 className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-purple-900">{stats.passRate}%</div>
              <div className="text-sm text-purple-700">Taux de réussite</div>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des résultats */}
      {results.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 font-medium text-gray-700">Participant</th>
                <th className="text-left py-3 px-2 font-medium text-gray-700">Score</th>
                <th className="text-left py-3 px-2 font-medium text-gray-700">Pourcentage</th>
                <th className="text-left py-3 px-2 font-medium text-gray-700">Date</th>
                <th className="text-left py-3 px-2 font-medium text-gray-700">Statut</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => {
                const percentage = Math.round((result.score / result.totalQuestions) * 100);
                const isPassed = percentage >= 70;
                
                return (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2">
                      <div className="font-medium text-gray-900">
                        {result.user.firstName} {result.user.lastName}
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      {result.score}/{result.totalQuestions}
                    </td>
                    <td className="py-3 px-2">
                      <span className={`font-medium ${isPassed ? 'text-green-600' : 'text-red-600'}`}>
                        {percentage}%
                      </span>
                    </td>
                    <td className="py-3 px-2 text-gray-600">
                      {new Date(result.completedAt).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-3 px-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        isPassed 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {isPassed ? '✅ Réussi' : '❌ Échec'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>Aucun résultat de quiz disponible</p>
        </div>
      )}

      {/* Modal de confirmation pour vider les résultats */}
      {showConfirmClear && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Confirmer la suppression</h3>
            <p className="text-gray-700 mb-6">
              Êtes-vous sûr de vouloir supprimer tous les résultats ? Cette action est irréversible.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmClear(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors duration-200"
              >
                Annuler
              </button>
              <button
                onClick={handleClearResults}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors duration-200"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}