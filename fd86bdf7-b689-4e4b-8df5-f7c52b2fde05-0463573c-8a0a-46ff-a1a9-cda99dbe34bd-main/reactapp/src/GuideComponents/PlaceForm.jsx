import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './PlaceForm.css';
 
const PlaceForm = ({ onSubmit }) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [bestTimeToVisit, setBestTimeToVisit] = useState('');
    const [location, setLocation] = useState('');
    const [image, setImage] = useState('');
    const [previewImage, setPreviewImage] = useState('');
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();
    const mode = id ? 'edit' : 'add';
    const fileInputRef = useRef(null);
 
    useEffect(() => {
        if (mode === 'edit' && id) {
            const fetchData = async () => {
                try {
                    const { data } = await axios.get(`https://8080-dfcafccbcabccaddbecaaffaacdadbebd.premiumproject.examly.io/api/places/${id}`);
                    console.log(data);
                    setName(data.name);
                    setCategory(data.category);
                    setBestTimeToVisit(data.bestTimeToVisit);
                    setLocation(data.location);
                    setImage(data.placeImage)
                    setPreviewImage(data.placeImage);
                } catch (err) {
                    setErrors({ form: 'Error fetching place data' });
                }
            };
            fetchData();
        }
    }, [mode, id]);
 
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
 
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setErrors({});
        try {
            const formData = {
                name,
                category,
                bestTimeToVisit,
                location,
                placeImage: image,
            };
            if (mode === 'add') {
                const response = await axios.post(`https://8080-dfcafccbcabccaddbecaaffaacdadbebd.premiumproject.examly.io/api/places`, formData, {
                    headers: {
                        'Content-type': 'application/json',
                    },
                });
                setSuccessMessage('Place Added Successfully');
                onSubmit({ id: response.data.id, ...formData });
                showModal();
                resetForm();
            } else if (mode === 'edit') {
                const { data } = await axios.put(`https://8080-dfcafccbcabccaddbecaaffaacdadbebd.premiumproject.examly.io/api/places/${id}`, formData, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                setSuccessMessage('Place updated Successfully!');
                onSubmit({ id: data.id, category, bestTimeToVisit, placeImage: data.image, location });
                showModal();
                resetForm();
                setTimeout(() => navigate('/viewPlace'), 2000); // Delay navigation by 2 seconds
            }
        } catch (error) {
            console.error('Error during POST/PUT request', error.response || error.message);
            setErrors({ form: 'Error creating place' });
        }
    };
 
    const validateForm = () => {
        const newErrors = {};
        if (!name) newErrors.name = 'Name is required';
        if (!category) newErrors.category = 'Category is required';
        if (!bestTimeToVisit) newErrors.bestTimeToVisit = 'Best time to visit is required';
        if (!location) newErrors.location = 'Location is required';
        if (!image) newErrors.image = 'Image is required';
        if (mode !== 'edit' && !image) newErrors.image = 'Image is required';
 
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
 
    const resetForm = () => {
        setName('');
        setCategory('');
        setBestTimeToVisit('');
        setLocation('');
        setImage('');
        setPreviewImage('');
        setTimeout(() => setSuccessMessage(''), 3000);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };
 
    const showModal = () => {
        setIsModalVisible(true);
    };
 
    const closeModal = () => {
        setIsModalVisible(false);
    };
 
    return (
        <div className="form-background">
           <image src='/home/coder/project/workspace/reactapp/public/mountains-6544522.jpg' />
            <div className="form-container">
                <div className="header">
                    <button onClick={() => window.history.back()}>Back</button>
                    <h2>{mode === 'edit' ? 'Edit Place' : 'Create New Place'}</h2>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Name<span style={{ color: 'red' }}>*</span></label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        {errors.name && <p>{errors.name}</p>}
                    </div>
 
                    <div className="form-group">
                        <label htmlFor="category">Category<span style={{ color: 'red' }}>*</span></label>
                        <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} >
                            <option value="">Select a category</option>
                            <option value="nature">Nature</option>
                            <option value="historical">Historical</option>
                            <option value="cultural">Cultural</option>
                            <option value="adventure">Adventure</option>
                        </select>
                        {errors.category && <p>{errors.category}</p>}
                    </div>
 
                    <div className="form-group">
                        <label htmlFor="bestTimeToVisit">Best Time to Visit<span style={{ color: 'red' }}>*</span></label>
                        <input
                            type="text"
                            id="bestTimeToVisit"
                            name="bestTimeToVisit"
                            value={bestTimeToVisit}
                            onChange={(e) => setBestTimeToVisit(e.target.value)}
                        />
                        {errors.bestTimeToVisit && <p>{errors.bestTimeToVisit}</p>}
                    </div>
 
                    <div className="form-group">
                        <label htmlFor="location">Location<span style={{ color: 'red' }}>*</span></label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                        {errors.location && <p>{errors.location}</p>}
                    </div>
 
                    <div className="form-group">
                        <label htmlFor="image">Place Image<span style={{ color: 'red' }}>*</span></label>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            onChange={handleImageChange}
                            ref={fileInputRef}
                        />
                        {previewImage && <img src={previewImage} alt="Preview" className="preview-image" height={80} width={120} />}
                        {errors.image && <p>{errors.image}</p>}
                    </div>
 
                    <button type="submit">{mode === 'edit' ? 'Update Place' : 'Add Place'}</button>
                </form>
                {errors.form && <p>{errors.form}</p>}
                {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            </div>
 
            {/* Modal Overlay */}
            {isModalVisible && (
                <div className="modal-overlay" id="successModal">
                    <div className="modal-container">
                        <div className="modal-message">{successMessage}</div>
                        <button className="close-button" onClick={closeModal}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};
 
export default PlaceForm;