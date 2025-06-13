import React from 'react';
import { useNavigate } from 'react-router-dom';

const ImageCountModal = ({ onClose }) => {
  const navigate = useNavigate();

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    modal: {
      width: '320px',
      background: 'white',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
    },
    emoji: {
      textAlign: 'center',
      fontSize: '32px',
      marginBottom: '16px',
    },
    title: {
      textAlign: 'center',
      marginBottom: '24px',
      color: '#5B5A5D',
      fontSize: '16px',
      lineHeight: '1.5',
    },
    buttonContainer: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'center',
    },
    button: {
      width: '130px',
      height: '40px',
      borderRadius: '8px',
      border: 'none',
      fontSize: '14px',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    fourButton: {
      backgroundColor: '#C6F0FF',
      color: '#5B5A5D',
      '&:hover': {
        backgroundColor: '#B0E0FF',
      },
    },
    eightButton: {
      backgroundColor: '#006185',
      color: '#FFFFFF',
      '&:hover': {
        backgroundColor: '#004D66',
      },
    },
  };

  const handleImageCount = (count) => {
    navigate('/resize', { state: { imageCount: count } });
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={styles.emoji}>😎</div>
        <div style={styles.title}>
          추가할 <span style={{ color: '#150731', fontWeight: '700' }}>이미지의 개수</span>를<br />
          선택해주세요
        </div>
        <div style={styles.buttonContainer}>
          <button 
            style={{...styles.button, ...styles.fourButton}}
            onClick={() => handleImageCount(4)}
          >
            4장
          </button>
          <button 
            style={{...styles.button, ...styles.eightButton}}
            onClick={() => handleImageCount(8)}
          >
            8장
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCountModal;