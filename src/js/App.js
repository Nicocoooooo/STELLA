import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import '../styles/App.css';
import Home from '../pages/Home';
import About from '../pages/About';
import Quiz from '../pages/Quiz';
import Questions from '../pages/Questions';



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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
