import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './GuideNavbar.css';
 
const GuideNavbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
 
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
 
  return (
    <div className="navbar">
      <h1><Link to="/home" style={{ color: 'white', textDecoration: 'none' }}>Travel Tales</Link></h1>
      <div className="nav-links">
        <Link to="/home">Home</Link>
        <span className="dropdown-link" onMouseEnter={toggleDropdown} onMouseLeave={toggleDropdown}>Place
          {isDropdownOpen && (
            <div className="dropdown-content">
              <Link to="/addPlace">Add Place</Link>
              <Link to="/viewPlace">View Place</Link>
            </div>
          )}
        </span>
      </div>
    </div>
  );
};
 
export default GuideNavbar;  