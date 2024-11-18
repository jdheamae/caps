import React from 'react'; // Include useRef if it's being used
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/home'; // Adjust the path if necessary
import Manage from './components/mana';
import ManageRequest from './components/manaReq'
import ReportItem from './components/report';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mana" element={<Manage />} />
          <Route path="manaReq" element={<ManageRequest />} />
          <Route path="report" element={<ReportItem />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;