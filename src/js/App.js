import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QuizProvider } from '../context/QuizContext';
import '../styles/App.css';
import SupabaseTest from '../components/SupabaseTest';


// Import des pages
import Home from '../pages/Home';
import About from '../pages/About';
import Quiz from '../pages/Quiz';
import Questions from '../pages/Questions';
import BudgetQuestions from '../pages/BudgetQuestions';
import PreferencesQuestions from '../pages/PreferencesQuestions';
import QuizConfirmation from '../pages/QuizConfirmation';
// Composant de chargement
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9557fa]"></div>
  </div>
);

function App() {
  return (
    <Router>
      <QuizProvider>
        <Suspense fallback={<LoadingFallback />}>
          <div className="App">
            <Routes>
              {/* Routes principales */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              
              {/* Routes du questionnaire */}
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/quiz/questions" element={<Questions />} />
              <Route path="/quiz/budget" element={<BudgetQuestions />} />
              <Route path="/quiz/preferences" element={<PreferencesQuestions />} />
              <Route path="/test" element={<SupabaseTest />} />
              <Route path="/quiz/confirmation" element={<QuizConfirmation />} />

            </Routes>
          </div>
        </Suspense>
      </QuizProvider>
    </Router>
  );
}

export default App;