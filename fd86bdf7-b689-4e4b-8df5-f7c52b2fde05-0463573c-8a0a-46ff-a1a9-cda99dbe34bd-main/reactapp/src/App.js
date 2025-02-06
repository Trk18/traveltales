import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import GuideNavbar from './GuideComponents/GuideNavbar';
import HomePage from './Components/HomePage';
import ViewPlace from './GuideComponents/ViewPlace';
import PlaceForm from './GuideComponents/PlaceForm';
import ErrorPage from './Components/ErrorPage';
 
const App = () => {
  const [places, setPlaces] = useState([]);
 
  const handlePlaceSubmit = (formData) => {
    if (formData.id) {
      setPlaces(places.map(place => place.id === formData.id ? formData : place));
    } else {
      setPlaces([...places, formData]);
    }
  };
 
 
  return (
<Router>
<GuideNavbar />
<Routes>
<Route path="/" element={<Navigate to="/home" />} />
<Route path="/home" element={<HomePage />} />
<Route path="/addPlace" element={<PlaceForm onSubmit={handlePlaceSubmit} />} />
<Route path="/viewPlace" element={<ViewPlace />} />
<Route path="/edit/:id" element={<PlaceForm onSubmit={handlePlaceSubmit} />} />
<Route path="*" element={<ErrorPage />} />
</Routes>
</Router>
  );
};
 
export default App;