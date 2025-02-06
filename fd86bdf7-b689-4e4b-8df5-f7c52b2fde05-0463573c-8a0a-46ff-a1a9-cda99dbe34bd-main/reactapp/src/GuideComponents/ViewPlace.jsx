
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ViewPlace.css';
 
const ViewPlace = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [placeToDelete, setPlaceToDelete] = useState(null);
  const navigate = useNavigate();
 
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await axios.get(`https://8080-dfcafccbcabccaddbecaaffaacdadbebd.premiumproject.examly.io/api/places`);
        console.log('Fetched places:', response.data);
        setPlaces(response.data);
      } catch (error) {
        console.error('Error fetching place data', error);
        setError('Error fetching place data');
      } finally {
        setLoading(false);
      }
    };
 
    fetchPlaces();
  }, []);
 
  const handleEdit = (id) => {
    navigate(`/edit/${id}`);
  };
 
  const handleDeleteClick = (id) => {
    setPlaceToDelete(id);
    setShowModal(true);
  };
 
  const confirmDelete = async () => {
    console.log(`Deleting place with id: ${placeToDelete}`);
    if (!placeToDelete) {
      console.error('Invalid place ID:', placeToDelete);
      setError('Invalid place ID');
      setShowModal(false);
      return;
    }
    try {
      const response = await axios.delete(`https://8080-dfcafccbcabccaddbecaaffaacdadbebd.premiumproject.examly.io/api/places/${placeToDelete}`);
      if (response.status === 200 || response.status === 204) {
        setPlaces(places.filter(place => place.placeId !== placeToDelete));
      } else {
        setError(`Error deleting place: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting place:', error);
      if (error.response) {
        console.error('Server responded with:', error.response.data);
        setError(`Error deleting place: ${error.response.data.message}`);
      } else if (error.request) {
        console.error('No response received:', error.request);
        setError('Error deleting place: No response from server.');
      } else {
        console.error('Error:', error.message);
        setError(`Error deleting place: ${error.message}`);
      }
    } finally {
      setShowModal(false);
      setPlaceToDelete(null);
    }
  };
 
  if (loading) {
    return <p>Loading...</p>;
  }
 
  if (error) {
    return <p>{error}</p>;
  }
 
  if (places.length === 0) {
    return (
      <div className="container">
        <p>Oops! No places found.</p>
      </div>
    );
  }
 
  return (
    <div className="container">
      <h2>Places</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Best Time to Visit</th>
            <th>Location</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {places.map((place) => (
            <tr key={place.placeId}>
              <td><img src={place.placeImage} alt={place.name} className="img-small" /></td>
              <td>{place.name}</td>
              <td>{place.category}</td>
              <td>{place.bestTimeToVisit}</td>
              <td>{place.location}</td>
              <td>
                <button onClick={() => handleEdit(place.placeId)} className="button-edit">Edit</button>
                <button onClick={() => handleDeleteClick(place.placeId)} className="button-delete">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Are you sure you want to delete this place?</p>
            <button onClick={confirmDelete} className="button-confirm">Yes</button>
            <button onClick={() => setShowModal(false)} className="button-cancel">No</button>
          </div>
        </div>
      )}
    </div>
  );
};
 
export default ViewPlace;
