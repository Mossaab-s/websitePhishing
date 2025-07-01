import React, { useState } from 'react';
import { User, Shield, UserCheck, Building } from 'lucide-react';

interface LoginFormProps {
  onLogin: (user: { firstName: string; lastName: string; company: 'C2S' | 'JCC' }) => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [company, setCompany] = useState<'C2S' | 'JCC' | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !company) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onLogin({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      company: company as 'C2S' | 'JCC'
    });
    
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Formation Anti-Phishing
            </h1>
            <p className="text-gray-600">
              Reconnaître et éviter les pièges du phishing
            </p>
            <div className="inline-flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mt-3">
              <UserCheck className="w-4 h-4 mr-1" />
              Durée : 1h00
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                Entreprise
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCompany('C2S')}
                  className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                    company === 'C2S'
                      ? 'border-blue-500 bg-blue-50 text-blue-900'
                      : 'border-gray-300 hover:border-gray-400 bg-white text-gray-700'
                  }`}
                >
                  <Building className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-medium">C2S</div>
                </button>
                <button
                  type="button"
                  onClick={() => setCompany('JCC')}
                  className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                    company === 'JCC'
                      ? 'border-blue-500 bg-blue-50 text-blue-900'
                      : 'border-gray-300 hover:border-gray-400 bg-white text-gray-700'
                  }`}
                >
                  <Building className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-medium">JCC</div>
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                Prénom
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pl-11"
                  placeholder="Votre prénom"
                  required
                />
                <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                Nom
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pl-11"
                  placeholder="Votre nom"
                  required
                />
                <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={!firstName.trim() || !lastName.trim() || !company || isSubmitting}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Connexion...
                </div>
              ) : (
                "Commencer la formation"
              )}
            </button>
          </form>

          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start">
              <Shield className="w-5 h-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Public cible :</p>
                <p>Utilisateurs Google Workspace (niveau débutant à intermédiaire)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}