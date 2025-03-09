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
import SignUp from '../pages/SignUp';
import SignUp2 from '../pages/SignUp2';
import SignUp3 from '../pages/SignUp3';
import Login from '../pages/Login';
import PastTrips from '../pages/PastTrips'; // Import de la page Mes Anciens Voyages
import TripDetail from '../pages/TripDetail'; // Import de la page Détail du Voyage
import DashboardProvisoire from '../pages/DashboardProvisoire'; // Import de la page Dashboard Provisoire

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

              {/* Routes d'inscription et connexion */}
              <Route path="/signup" element={<SignUp />} />
              <Route path="/signup2" element={<SignUp2 />} />
              <Route path="/signup3" element={<SignUp3 />} />
              <Route path="/login" element={<Login />} />

              {/* Nouvelles routes */}
              <Route path="/past-trips" element={<PastTrips />} />
              <Route path="/trip-detail/:tripId" element={<TripDetail />} />
              <Route path="/past-trips" element={<PastTrips />} />
              <Route path="/dashboard-provisoire" element={<DashboardProvisoire />} />
            </Routes>
          </div>
        </Suspense>
      </QuizProvider>
    </Router>
  );
}

export default App;