import React, { useState } from 'react';
import { Mail, AlertTriangle, CheckCircle, X, ExternalLink } from 'lucide-react';

interface RealEmailExampleProps {
  imagePath: string;
  title: string;
  suspiciousEmail: string;
  suspiciousLink: string;
  explanation: string;
}

export default function RealEmailExample({ 
  imagePath, 
  title, 
  suspiciousEmail, 
  suspiciousLink, 
  explanation 
}: RealEmailExampleProps) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [userGuess, setUserGuess] = useState<boolean | null>(null);

  const handleGuess = (guess: boolean) => {
    setUserGuess(guess);
    setShowAnswer(true);
  };

  const isCorrect = userGuess === true; // Ces exemples sont tous du phishing

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden mb-6">
      <div className="bg-gray-50 p-4 border-b border-gray-300">
        <div className="flex items-center space-x-2">
          <Mail className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-gray-900">{title}</span>
        </div>
      </div>
      
      <div className="p-4 bg-white">
        {/* Image de l'email réel */}
        <div className="mb-4">
          <img 
            src={imagePath} 
            alt={title}
            className="w-full border border-gray-200 rounded-lg shadow-sm"
          />
        </div>

        {/* Analyse des éléments suspects */}
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="font-semibold text-red-800 mb-2 flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Éléments suspects identifiés :
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-start">
              <span className="font-medium text-red-700 mr-2">📧 Expéditeur :</span>
              <span className="font-mono text-red-600 bg-red-100 px-2 py-1 rounded">{suspiciousEmail}</span>
            </div>
            <div className="flex items-start">
              <span className="font-medium text-red-700 mr-2">🔗 Lien suspect :</span>
              <span className="font-mono text-red-600 bg-red-100 px-2 py-1 rounded break-all">{suspiciousLink}</span>
            </div>
          </div>
        </div>

        {!showAnswer ? (
          <div className="space-y-3">
            <p className="font-medium text-gray-900">Cet email est-il légitime ou s'agit-il de phishing ?</p>
            <div className="flex space-x-3">
              <button
                onClick={() => handleGuess(false)}
                className="flex-1 bg-green-100 text-green-700 py-2 px-4 rounded-lg hover:bg-green-200 transition-colors duration-200 font-medium"
              >
                ✅ Légitime
              </button>
              <button
                onClick={() => handleGuess(true)}
                className="flex-1 bg-red-100 text-red-700 py-2 px-4 rounded-lg hover:bg-red-200 transition-colors duration-200 font-medium"
              >
                ⚠️ Phishing
              </button>
            </div>
          </div>
        ) : (
          <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-center mb-2">
              {isCorrect ? (
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              ) : (
                <X className="w-5 h-5 text-red-600 mr-2" />
              )}
              <span className={`font-medium ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                {isCorrect ? 'Correct !' : 'Incorrect'}
              </span>
            </div>
            
            <div className="mb-3">
              <span className="font-medium text-red-800">
                ⚠️ Il s'agit bien de PHISHING
              </span>
            </div>
            
            <div className="text-sm text-gray-700">
              <strong>Explication :</strong> {explanation}
            </div>

            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-sm text-yellow-800">
                <strong>⚠️ Attention :</strong> Tous ces liens pointent vers le domaine frauduleux 
                <span className="font-mono bg-yellow-100 px-1 rounded ml-1">identityhorizon.com</span> 
                qui n'a aucun rapport avec Google !
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}