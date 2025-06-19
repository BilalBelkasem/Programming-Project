import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo Erasmus.png';
import '../Css/Speeddates.css';


const CompanySpeeddates = () => {
    const [timeSlots, setTimeSlots] = useState([]);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const navigate = useNavigate();

    const API_BASE_URL = 'http://localhost:5000'; // Your backend URL

    const getAuthToken = () => {
        return localStorage.getItem('token');
    };

const fetchCompanySlots = async () => {
    try {
        const token = localStorage.getItem('token');
        console.log("Token being sent:", token); // Debug log

        const response = await axios.get(`${API_BASE_URL}/api/company/speeddates`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        setTimeSlots(response.data);
    } catch (error) {
        console.error('Error fetching slots:', error);
        if (error.response?.status === 401) {
            handleLogout();
        }
    }
};

    useEffect(() => {
        fetchCompanySlots();
    }, []);

    const generateTimeSlots = async () => {
        if (!startTime || !endTime) {
            alert('Please fill in both start and end times');
            return;
        }

        setIsGenerating(true);
        try {
            const token = getAuthToken();
            await axios.post(`${API_BASE_URL}/api/company/speeddates`, 
                { startTime, endTime },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            fetchCompanySlots();
        } catch (error) {
            console.error('Error creating slots:', error);
            if (error.response?.status === 401) {
                handleLogout();
            } else {
                alert(error.response?.data?.error || 'Error creating slots');
            }
        } finally {
            setIsGenerating(false);
        }
    };

    const deleteSlot = (slotId) => {
        const token = getAuthToken();
        axios.delete(`${API_BASE_URL}/api/company/speeddates/${slotId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(() => fetchCompanySlots())
        .catch(err => {
            console.error('Error deleting slot:', err);
            if (err.response?.status === 401) {
                handleLogout();
            }
        });
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    const formatDate = (dateString) => {
        const d = new Date(dateString);
        return d.toLocaleDateString('nl-NL', {
            weekday: 'long', 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric'
        });
    };

    return (
        <div className="speeddates-container">
            {/* Your existing JSX remains the same */}
            {/* Just update the API calls as shown above */}
        </div>
    );
};

export default CompanySpeeddates;