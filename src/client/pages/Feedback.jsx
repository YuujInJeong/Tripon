import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Autocomplete from 'react-google-autocomplete';
import ImageCountModal from './modal';

const Feedback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isCorrect = location.state?.isCorrect;
  const [showModal, setShowModal] = useState(false);
  const [selectedCity, setSelectedCity] = useState('');

  const handleContinue = () => {
    setShowModal(true);
  };

  const handlePlaceSelect = (place) => {
    if (place) {
      setSelectedCity(place.formatted_address);
    }
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem',
      textAlign: 'center',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)',
    },
    content: {
      maxWidth: '500px',
      width: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      padding: '3rem',
      borderRadius: '24px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
      backdropFilter: 'blur(10px)',
    },
    emoji: {
      fontSize: '3rem',
      marginBottom: '1.5rem',
    },
    message: {
      fontSize: '1.4rem',
      color: '#2d3436',
      marginBottom: '2.5rem',
      lineHeight: '1.6',
      fontWeight: '500',
    },
    inputContainer: {
      marginBottom: '2.5rem',
      width: '100%',
    },
    inputLabel: {
      fontSize: '1.1rem',
      color: '#636e72',
      marginBottom: '1rem',
      fontWeight: '500',
    },
    input: {
      width: '100%',
      height: '52px',
      padding: '0 1.5rem',
      borderRadius: '12px',
      border: '2px solid #dfe6e9',
      fontSize: '1.1rem',
      marginBottom: '1rem',
      transition: 'all 0.3s ease',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      boxSizing: 'border-box',
      '&:focus': {
        borderColor: '#74b9ff',
        outline: 'none',
        boxShadow: '0 0 0 3px rgba(116, 185, 255, 0.2)',
      },
    },
    button: {
      backgroundColor: '#0984e3',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      padding: '1.2rem 2.5rem',
      fontSize: '1.2rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      width: '100%',
      '&:hover': {
        backgroundColor: '#0873c4',
        transform: 'translateY(-2px)',
        boxShadow: '0 5px 15px rgba(9, 132, 227, 0.3)',
      },
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.emoji}>
          {isCorrect ? '✨' : '🌍'}
        </div>
        <p style={styles.message}>
          {isCorrect 
            ? "여행 네컷으로\n추억을 남겨볼까요?" 
            : "이 사진이 찍힌\n도시를 알려주세요"}
        </p>
        {!isCorrect && (
          <div style={styles.inputContainer}>
            <Autocomplete
              apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
              onPlaceSelected={handlePlaceSelect}
              options={{
                types: ['(cities)'],
                fields: ['formatted_address', 'geometry', 'name']
              }}
              style={styles.input}
              placeholder="도시 이름을 검색해보세요"
            />
          </div>
        )}
        <button 
          style={styles.button}
          onClick={handleContinue}
        >
          {isCorrect ? "여행 네컷 만들기" : "콜라주 만들기"}
        </button>
      </div>
      {showModal && <ImageCountModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default Feedback;