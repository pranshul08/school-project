import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import "./assets/styles/app.css";
import AddSchool from './pages/AddSchool';
import ShowSchools from './pages/ShowSchool';

const App = () => (
  <Router>
    <nav style={{ display: 'flex', justifyContent: 'center', gap: '2rem', margin: '2rem 0' }}>
      <Link to="/">Add School</Link>
      <Link to="/schools">Show Schools</Link>
    </nav>
    <Routes>
      <Route path="/" element={<AddSchool />} />
      <Route path="/schools" element={<ShowSchools />} />
    </Routes>
  </Router>
);

export default App;
