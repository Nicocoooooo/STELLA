import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import '../styles/App.css';
import Home from '../pages/Home';
import About from '../pages/About';
import Quiz from '../pages/Quiz';
import Questions from '../pages/Questions';
import BudgetQuestions from '../pages/BudgetQuestions';
import PreferencesQuestions from '../pages/PreferencesQuestions';




// Composant de navigation (facultatif, mais utile pour naviguer)
import { Link } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">

        {/* Configuration des Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/quiz/questions" element={<Questions />} />
          <Route path="/quiz/budget" element={<BudgetQuestions />} /> 
          <Route path="/quiz/preferences" element={<PreferencesQuestions />} />
          

        </Routes>
      </div>
    </Router>
  );
}

export default App;
