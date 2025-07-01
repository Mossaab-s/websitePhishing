import React, { useState } from 'react';
import { CheckCircle, X, Trophy, RefreshCw } from 'lucide-react';
import { QuizQuestion, User, QuizResult } from '../types';

interface QuizProps {
  questions: QuizQuestion[];
  user: User;
  onComplete: (result: QuizResult) => void;
}

export default function Quiz({ questions, user, onComplete }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setUserAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowResult(false);
    } else {
      completeQuiz();
    }
  };

  const handleShowResult = () => {
    setShowResult(true);
  };

  const completeQuiz = () => {
    const score = userAnswers.reduce((acc, answer, index) => {
      return answer === questions[index].correctAnswer ? acc + 1 : acc;
    }, 0);

    const result: QuizResult = {
      user,
      score,
      totalQuestions: questions.length,
      answers: userAnswers,
      completedAt: new Date().toISOString()
    };

    setQuizCompleted(true);
    onComplete(result);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setUserAnswers([]);
    setShowResult(false);
    setQuizCompleted(false);
  };

  const currentQuestionData = questions[currentQuestion];
  const isAnswered = userAnswers[currentQuestion] !== undefined;
  const isCorrect = userAnswers[currentQuestion] === currentQuestionData?.correctAnswer;
  const score = userAnswers.reduce((acc, answer, index) => {
    return answer === questions[index]?.correctAnswer ? acc + 1 : acc;
  }, 0);

  if (quizCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    const isPassed = percentage >= 70;

    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 ${
          isPassed ? 'bg-green-100' : 'bg-orange-100'
        }`}>
          <Trophy className={`w-10 h-10 ${isPassed ? 'text-green-600' : 'text-orange-600'}`} />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Quiz terminé !
        </h2>
        
        <div className="text-6xl font-bold mb-4 text-blue-600">
          {percentage}%
        </div>
        
        <p className="text-lg text-gray-700 mb-6">
          Vous avez obtenu <strong>{score}/{questions.length}</strong> bonnes réponses
        </p>
        
        <div className={`p-4 rounded-lg mb-6 ${
          isPassed 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-orange-50 border border-orange-200 text-orange-800'
        }`}>
          {isPassed ? (
            <p className="font-medium">
              🎉 Félicitations ! Vous maîtrisez bien les concepts de sécurité anti-phishing.
            </p>
          ) : (
            <p className="font-medium">
              📚 Nous recommandons de revoir la formation pour améliorer vos connaissances.
            </p>
          )}
        </div>

        <div className="text-sm text-gray-600 mb-6">
          <p>Participant : <strong>{user.firstName} {user.lastName}</strong></p>
          <p>Date : {new Date().toLocaleDateString('fr-FR', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
        </div>
        
        <button
          onClick={resetQuiz}
          className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Refaire le quiz
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-blue-600 text-white p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Quiz Final</h2>
          <span className="text-blue-100">
            Question {currentQuestion + 1} / {questions.length}
          </span>
        </div>
        <div className="w-full bg-blue-500 rounded-full h-2">
          <div
            className="bg-white h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">
          {currentQuestionData?.question}
        </h3>

        <div className="space-y-3 mb-6">
          {currentQuestionData?.options.map((option, index) => {
            const isSelected = userAnswers[currentQuestion] === index;
            const isCorrectAnswer = index === currentQuestionData.correctAnswer;
            
            let buttonClass = "w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ";
            
            if (!showResult) {
              buttonClass += isSelected 
                ? "border-blue-500 bg-blue-50 text-blue-900" 
                : "border-gray-300 hover:border-gray-400 bg-white text-gray-900";
            } else {
              if (isCorrectAnswer) {
                buttonClass += "border-green-500 bg-green-50 text-green-900";
              } else if (isSelected && !isCorrectAnswer) {
                buttonClass += "border-red-500 bg-red-50 text-red-900";
              } else {
                buttonClass += "border-gray-300 bg-gray-50 text-gray-600";
              }
            }

            return (
              <button
                key={index}
                onClick={() => !showResult && handleAnswer(index)}
                className={buttonClass}
                disabled={showResult}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {showResult && (
                    <div className="flex items-center">
                      {isCorrectAnswer && <CheckCircle className="w-5 h-5 text-green-600" />}
                      {isSelected && !isCorrectAnswer && <X className="w-5 h-5 text-red-600" />}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {showResult && (
          <div className={`p-4 rounded-lg mb-6 ${
            isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
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
            <p className="text-sm text-gray-700">
              <strong>Explication :</strong> {currentQuestionData?.explanation}
            </p>
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Score actuel : {score}/{currentQuestion + (showResult ? 1 : 0)}
          </div>
          
          <div className="space-x-3">
            {isAnswered && !showResult && (
              <button
                onClick={handleShowResult}
                className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-medium hover:bg-blue-200 transition-colors duration-200"
              >
                Voir la réponse
              </button>
            )}
            
            {showResult && (
              <button
                onClick={handleNext}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
              >
                {currentQuestion < questions.length - 1 ? 'Question suivante' : 'Terminer le quiz'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}