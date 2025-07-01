import React, { useState } from 'react';
import { Mail, AlertTriangle, CheckCircle, X } from 'lucide-react';

interface EmailExampleProps {
  from: string;
  subject: string;
  content: string;
  isPhishing: boolean;
  explanation: string;
}

export default function EmailExample({ from, subject, content, isPhishing, explanation }: EmailExampleProps) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [userGuess, setUserGuess] = useState<boolean | null>(null);

  const handleGuess = (guess: boolean) => {
    setUserGuess(guess);
    setShowAnswer(true);
  };

  const isCorrect = userGuess === isPhishing;

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden mb-4">
      <div className="bg-gray-50 p-4 border-b border-gray-300">
        <div className="flex items-center space-x-2">
          <Mail className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-gray-900">Exemple d'email</span>
        </div>
      </div>
      
      <div className="p-4 bg-white">
        <div className="mb-3">
          <div className="text-sm text-gray-600 mb-1">De :</div>
          <div className="font-mono text-sm bg-gray-100 p-2 rounded">{from}</div>
        </div>
        
        <div className="mb-3">
          <div className="text-sm text-gray-600 mb-1">Sujet :</div>
          <div className="font-medium">{subject}</div>
        </div>
        
        <div className="mb-4">
          <div className="text-sm text-gray-600 mb-1">Contenu :</div>
          <div className="p-3 bg-gray-50 rounded border-l-4 border-blue-500 whitespace-pre-line">
            {content}
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
              <span className="font-medium">
                Réponse : {isPhishing ? '⚠️ Il s\'agit de PHISHING' : '✅ Email LÉGITIME'}
              </span>
            </div>
            
            <div className="text-sm text-gray-700">
              <strong>Explication :</strong> {explanation}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}