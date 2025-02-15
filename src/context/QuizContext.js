// src/context/QuizContext.js
import React, { createContext, useContext, useState } from 'react';

const QuizContext = createContext();

export function QuizProvider({ children }) {
  const [quizData, setQuizData] = useState({
    // Données de base
    departure_date: null,
    return_date: null,
    number_of_travelers: 0,
    number_of_rooms: 0,
    destination: '',
    
    // Avec qui on voyage
    travel_with: [],
    
    // Budget et préférences
    budget_allocation: {
      hebergement: 5,
      transport: 5,
      restaurant: 5,
      activites: 5
    },
    
    // Types d'hébergement et activités
    accommodation_preferences: [],
    activity_preferences: [],
    
    // Préférences de voyage
    day_intensity_preference: 5,
    comfort_preference: 5,
    
    // Restrictions et spécificités
    dietary_restrictions: [],
    specific_activities: [],
    
    // Progression
    completion_status: 'in_progress',
    current_step: 1
  });

  const updateQuizData = (newData) => {
    setQuizData(prev => ({
      ...prev,
      ...newData
    }));
  };

  return (
    <QuizContext.Provider value={{ quizData, updateQuizData }}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}