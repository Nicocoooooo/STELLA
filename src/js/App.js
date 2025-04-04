import React, { Suspense } from "react";
import { Analytics } from "@vercel/analytics/react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { QuizProvider } from "../context/QuizContext";
import "../styles/App.css";
import SupabaseTest from "../components/SupabaseTest";

// Import des pages
import Home from "../pages/Home";
import About from "../pages/About";
import Quiz from "../pages/Quiz";
import Questions from "../pages/Questions";
import BudgetQuestions from "../pages/BudgetQuestions";
import PreferencesQuestions from "../pages/PreferencesQuestions";
import QuizConfirmation from "../pages/QuizConfirmation";
import SignUp from "../pages/SignUp";
import SignUp2 from "../pages/SignUp2";
import SignUp3 from "../pages/SignUp3";
import Login from "../pages/Login";
import PastTrips from "../pages/PastTrips"; // Import de la page Mes Anciens Voyages
import Dashboard from "../pages/Dashboard";
import PastTripDetail from "../pages/PastTripDetail"; // Import de la page Détail de l'ancien Voyage
import ProtectedRoute from "../components/ProtectedRoute"; // Import du composant ProtectedRoute
import DestinationDetail from "../pages/DestinationDetail";
import UserProfil from "../pages/UserProfil";
import Help from "../pages/Help";
import Contact from "../pages/Contact";
import LegalMentions from "../pages/LegalMentions";
import FAQ from "../pages/Faq";
import Ask from "../pages/Ask";

import ComposeVoyage from "../pages/ComposeVoyage";
import HotelsPage from "../pages/HotelsPage";
import PlanningPage1 from "../pages/planning_test";

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
              {/* Routes publiques */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/help" element={<Help />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/ask" element={<Ask />} />
              <Route path="/legalmentions" element={<LegalMentions />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/quiz/questions" element={<Questions />} />
              <Route path="/quiz/budget" element={<BudgetQuestions />} />
              <Route
                path="/quiz/preferences"
                element={<PreferencesQuestions />}
              />
              <Route path="/test" element={<SupabaseTest />} />
              <Route path="/quiz/confirmation" element={<QuizConfirmation />} />
              <Route path="/destination/:id" element={<DestinationDetail />} />

              {/* Routes Composez Voyage*/}
              <Route path="/ComposeVoyage" element={<ComposeVoyage />} />
              <Route path="/HotelsPage" element={<HotelsPage />} />
              <Route path="/PlanningPage1" element={<PlanningPage1 />} />

              {/* Routes d'inscription et connexion */}
              <Route path="/signup" element={<SignUp />} />
              <Route path="/signup2" element={<SignUp2 />} />
              <Route path="/signup3" element={<SignUp3 />} />
              <Route path="/login" element={<Login />} />
              <Route path="/user-profil" element={<UserProfil />} />

              {/* Routes protégées */}
              <Route
                path="/past-trips"
                element={
                  <ProtectedRoute>
                    <PastTrips />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/past-trips/:id"
                element={
                  <ProtectedRoute>
                    <PastTripDetail />
                  </ProtectedRoute>
                }
              />
            </Routes>
            {/* Composant d'analyse de Vercel Analytics */}
            <Analytics />
          </div>
        </Suspense>
      </QuizProvider>
    </Router>
  );
}

export default App;
