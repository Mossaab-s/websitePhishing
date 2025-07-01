import React from 'react';
import { CheckCircle, Clock, AlertTriangle, Shield, Users, Target } from 'lucide-react';

interface TrainingSectionProps {
  sectionNumber: number;
  title: string;
  duration: string;
  children: React.ReactNode;
  isCompleted: boolean;
  onComplete: () => void;
}

export default function TrainingSection({ 
  sectionNumber, 
  title, 
  duration, 
  children, 
  isCompleted, 
  onComplete 
}: TrainingSectionProps) {
  const getSectionIcon = (num: number) => {
    switch (num) {
      case 1: return <Shield className="w-6 h-6" />;
      case 2: return <AlertTriangle className="w-6 h-6" />;
      case 3: return <Target className="w-6 h-6" />;
      case 4: return <Users className="w-6 h-6" />;
      default: return <Shield className="w-6 h-6" />;
    }
  };

  const getSectionColor = (num: number) => {
    switch (num) {
      case 1: return 'bg-green-600';
      case 2: return 'bg-yellow-600';
      case 3: return 'bg-orange-600';
      case 4: return 'bg-blue-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className={`${getSectionColor(sectionNumber)} text-white p-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 bg-white bg-opacity-20 rounded-lg">
              {getSectionIcon(sectionNumber)}
            </div>
            <div>
              <h2 className="text-xl font-bold">
                {sectionNumber}. {title}
              </h2>
              <div className="flex items-center mt-1">
                <Clock className="w-4 h-4 mr-1" />
                <span className="text-sm opacity-90">{duration}</span>
                {isCompleted && (
                  <div className="ml-3 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    <span className="text-sm">Terminé</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {children}
        
        {!isCompleted && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={onComplete}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
            >
              Marquer comme terminé
            </button>
          </div>
        )}
      </div>
    </div>
  );
}