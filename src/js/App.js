import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import '../styles/App.css';
import Home from '../pages/Home';
import About from '../pages/About';
import SignUp from '../pages/SignUp'; // 🔹 Import de la page SignUp
import SignUp2 from '../pages/SignUp2'; 

function App() {
  return (
    <Router>
      <div className="App">
        {/* Configuration des Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/signup" element={<SignUp />} /> {/* 🔹 Ajout de la route */}
          <Route path="/signup2" element={<SignUp2 />} />
          <Route path="/signup3" element={<SignUp3/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;