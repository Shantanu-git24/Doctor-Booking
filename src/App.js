import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DoctorSelection from './components/DoctorSelection';
import DateTimePicker from './components/DateTimePicker';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DoctorSelection />} />
        <Route path="/book" element={<DateTimePicker />} />
      </Routes>
    </Router>
  );
};

export default App;
