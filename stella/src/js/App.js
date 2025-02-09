import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';

// Importation des pages
import Home from './pages/Home';
import About from './pages/About';

// Composant de navigation (facultatif, mais utile pour naviguer)
import { Link } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>Edit <code>src/App.js</code> and save to reload.</p>

          {/* Navigation */}
          <nav>
            <Link to="/" className="App-link">Home</Link>
            <Link to="/about" className="App-link">About</Link>
          </nav>
        </header>

        {/* Configuration des Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
