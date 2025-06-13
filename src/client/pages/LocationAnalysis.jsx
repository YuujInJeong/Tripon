import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageCountModal from './modal';

const LocationAnalysis = ({ analysisResult, onBack }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '1.5rem',
      maxWidth: '450px',
      margin: '0 auto',
      height: '100vh',
      fontFamily: '"Noto Sans KR", sans-serif'
    },
    titleContainer: {
      textAlign: 'center',
      marginBottom: '2rem',
      width: '100%'
    },
    titleHighlight: {
      color: '#888',
      fontSize: '1.1rem',
      marginBottom: '0.5rem'
    },
    titleQuestion: {
      color: '#333',
      fontSize: '1.5rem',
      fontWeight: '700',
      margin: '0'
    },
    uploadContainer: {
      width: '100%',
      marginBottom: '2rem'
    },
    uploadCard: {
      backgroundColor: '#8CD3E8',
      borderRadius: '12px',
      height: '30rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
    },
    previewContainer: {
      width: '100%',
      height: '100%'
    },
    imagePreview: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    },
    instructionContainer: {
      textAlign: 'center',
      marginBottom: '2rem'
    },
    instructionText: {
      color: '#666',
      fontSize: '1rem',
      lineHeight: '1.5'
    },
    locationText: {
      fontSize: '1.1rem',
      color: '#333',
      marginTop: '0.2rem'
    },
    highlightText: {
      color: '#40E0D0',
      fontWeight: 'bold',
      fontSize: '1.2rem'
    },
    confidenceText: {
      fontSize: '0.8rem',
      color: '#999',
      marginTop: '0.5rem',
      fontStyle: 'italic'
    },
    buttonContainer: {
      display: 'flex',
      width: '100%',
      gap: '1rem'
    },
    primaryButton: {
      flex: '1',
      backgroundColor: '#039BE5',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '1rem',
      fontSize: '1rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    secondaryButton: {
      flex: '1',
      backgroundColor: 'white',
      color: '#666',
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '1rem',
      fontSize: '1rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    }
  };

  if (!analysisResult) {
    return (
      <div style={styles.container}>
        <div style={styles.instructionContainer}>
          <p style={styles.instructionText}>분석 결과를 불러올 수 없습니다.</p>
          <button style={styles.primaryButton} onClick={onBack}>
            다시 시도하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {showModal && <ImageCountModal onClose={() => setShowModal(false)} />}
      <div style={styles.titleContainer}>
        <p style={styles.titleHighlight}>✨ 분석 결과</p>
        <p style={styles.titleQuestion}>이 장소가 맞나요?</p>
      </div>
      
      <div style={styles.uploadContainer}>
        <div style={styles.uploadCard}>
          <div style={styles.previewContainer}>
            <img src={analysisResult.imageUrl} alt="Analysis" style={styles.imagePreview} />
          </div>
        </div>
      </div>
      
      <div style={styles.instructionContainer}>
        <p style={styles.locationText}>
          이 나라는 <span style={styles.highlightText}>{analysisResult.country}</span>입니다.
        </p>
        <p style={styles.locationText}>
          <span style={styles.highlightText}>{analysisResult.city}</span> 같아요!
        </p>
        {analysisResult.confidence && (
          <p style={styles.confidenceText}>
            신뢰도: {analysisResult.confidence}/10
          </p>
        )}
      </div>
      
      <div style={styles.buttonContainer}>
        <button 
          style={styles.secondaryButton} 
          onClick={() => navigate('/feedback', { state: { isCorrect: false } })}
        >
          틀렸어요
        </button>
        <button 
          style={styles.primaryButton} 
          onClick={() => setShowModal(true)}
        >
          맞췄어요
        </button>
      </div>
    </div>
  );
};

export default LocationAnalysis;