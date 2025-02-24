import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import '../styles/App.css';
import Home from '../pages/Home';
import About from '../pages/About';
import Faq from '../pages/Faq';
import Ask from '../pages/Ask';
import Help from '../pages/Help';
import Contact from '../pages/Contact';
import LegalMentions from '../pages/LegalMentions';



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
          <Route path="/faq" element={<Faq />} />
          <Route path="/ask" element={<Ask />} />
          <Route path="/help" element={<Help />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/legalmentions" element={<LegalMentions />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
