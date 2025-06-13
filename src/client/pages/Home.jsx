import React, { useState } from 'react';
import LocationAnalysis from './LocationAnalysis';

const API_CONFIG = {
  MODEL: "gpt-4o",
  MAX_TOKENS: 300,
  ENDPOINT: 'https://api.openai.com/v1/chat/completions'
};

const ERROR_MESSAGES = {
  API_KEY_MISSING: 'API 키가 설정되지 않았습니다.',
  API_KEY_INVALID: 'API 키가 유효하지 않습니다.',
  API_RATE_LIMIT: '요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.',
  API_ERROR: '서비스에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
  PARSE_ERROR: '응답을 처리하는 중 오류가 발생했습니다.',
  INVALID_RESPONSE: '올바르지 않은 응답이 반환되었습니다.',
  NO_FILE: '사진을 먼저 선택해주세요.'
};

const TripOnPage = () => {
  const [files, setFiles] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);

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
    logo: {
      width: '150px',
      height: 'auto',
      marginBottom: '1rem'
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
    uploadPlaceholder: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
      cursor: 'pointer'
    },
    plusIcon: {
      width: '5rem',
      height: '5rem',
      backgroundColor: 'white',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      color: '#8CD3E8',
      marginBottom: '1rem'
    },
    uploadText: {
      color: 'white',
      fontSize: '1rem',
      marginBottom: '0.3rem'
    },
    uploadLimit: {
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: '0.9rem',
      margin:'0'
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
      transition: 'background-color 0.2s',
      opacity: isAnalyzing ? 0.7 : 1
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
    },
    loadingText: {
      color: '#666',
      fontSize: '0.9rem',
      textAlign: 'center',
      margin: '2rem'
    },
    errorText: {
      color: '#e53e3e',
      fontSize: '0.9rem',
      textAlign: 'center',
      marginTop: '1rem',
      padding: '1rem',
      backgroundColor: '#fed7d7',
      borderRadius: '8px'
    },
    serviceUnavailableText: {
      color: '#666',
      fontSize: '1rem',
      textAlign: 'center',
      marginTop: '1rem',
      padding: '1.5rem',
      backgroundColor: '#f7fafc',
      borderRadius: '8px',
      border: '1px solid #e2e8f0'
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const analyzeImageWithChatGPT = async (base64Image) => {
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    
    console.log('API Key 확인:', apiKey ? '있음' : '없음');
    console.log('API Key 길이:', apiKey ? apiKey.length : 0);
    console.log('API Key 앞부분:', apiKey ? apiKey.substring(0, 7) + '...' : '없음');
    
    if (!apiKey) {
      console.error('API Key가 설정되지 않았습니다');
      throw new Error('API_KEY_MISSING');
    }

    try {
      
      const requestBody = {
        model: API_CONFIG.MODEL,
        messages: [{
          role: "user",
          content: [{
            type: "text",
            text: "이 여행 사진을 보고 촬영된 국가와 도시를 추론해주세요. 응답은 반드시 다음 JSON 형식으로만 해주세요: {\"country\": \"국가명\", \"city\": \"도시명\", \"confidence\": \"신뢰도(1-10)\"}. 국가명과 도시명은 한글로 작성해주세요. 예시: {\"country\": \"프랑스\", \"city\": \"파리\", \"confidence\": \"8\"}"
          }, {
            type: "image_url",
            image_url: { url: base64Image }
          }]
        }],
        max_tokens: API_CONFIG.MAX_TOKENS
      };
      

      const response = await fetch(API_CONFIG.ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestBody)
      });

      console.log('API 요청 내용:', requestBody);
      console.log('API 응답 상태:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API 응답 에러:', {
          status: response.status,
          statusText: response.statusText,
          errorBody: errorText
        });
        
        if (response.status === 401) {
          console.error('인증 실패: API Key가 잘못되었습니다');
          throw new Error('API_KEY_INVALID');
        } else if (response.status === 429) {
          console.error('요청 한도 초과');
          throw new Error('API_RATE_LIMIT');
        } else {
          console.error('기타 API 오류:', response.status);
          throw new Error('API_ERROR');
        }
      }

      const data = await response.json();
      console.log('✅ API 응답 성공:', data);
      
      const content = data.choices[0].message.content;
      
      try {
        const cleanContent = content.replace(/```json\n|\n```/g, '').trim();
        const result = JSON.parse(cleanContent);
        
        if (!result.country || !result.city) {
          throw new Error('INVALID_RESPONSE');
        }
        
        return result;
      } catch (parseError) {
        console.error('JSON 파싱 실패:', parseError);
        console.error('원본 응답:', content);
        throw new Error('PARSE_ERROR');
      }
    } catch (error) {
      console.error('💥 분석 중 오류 발생:', error);
      console.error('오류 메시지:', error.message);
      
      if (error.message === 'API_KEY_MISSING' || 
          error.message === 'API_KEY_INVALID' || 
          error.message === 'API_RATE_LIMIT' || 
          error.message === 'API_ERROR' || 
          error.message === 'PARSE_ERROR' || 
          error.message === 'INVALID_RESPONSE') {
        setError('현재 서비스 준비중입니다');
      } else {
        setError('현재 서비스 준비중입니다');
      }
    } finally {
      console.log('🏁 분석 종료');
      setIsAnalyzing(false);
    }
  };

  const handleAddPhoto = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.multiple = false;
    fileInput.onchange = (e) => {
      if (e.target.files.length > 0) {
        setFiles(Array.from(e.target.files));
        setAnalysisResult(null);
        setError(null);
      }
    };
    fileInput.click();
  };

  const handleReset = () => {
    setFiles([]);
    setAnalysisResult(null);
    setError(null);
  };

  const handleConfirm = async () => {
    if (files.length === 0) {
      setError(ERROR_MESSAGES.NO_FILE);
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const base64Image = await convertToBase64(files[0]);
      
      const result = await analyzeImageWithChatGPT(base64Image);
      
      setAnalysisResult({
        ...result,
        imageUrl: URL.createObjectURL(files[0])
      });
    } catch (error) {
      console.error('💥 분석 중 오류 발생:', error);
      console.error('오류 메시지:', error.message);
      
      if (error.message === 'API_KEY_MISSING' || 
          error.message === 'API_KEY_INVALID' || 
          error.message === 'API_RATE_LIMIT' || 
          error.message === 'API_ERROR' || 
          error.message === 'PARSE_ERROR' || 
          error.message === 'INVALID_RESPONSE') {
        setError('현재 서비스 준비중입니다');
      } else {
        setError('현재 서비스 준비중입니다');
      }
    } finally {
      console.log('🏁 분석 종료');
      setIsAnalyzing(false);
    }
  };

  if (analysisResult) {
    return (
      <LocationAnalysis 
        analysisResult={analysisResult}
        onBack={() => setAnalysisResult(null)}
      />
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.titleContainer}>
        <p style={styles.titleHighlight}>✨ 당신의 여행 사진 속엔</p>
        <p style={styles.titleQuestion}>어떤 성격이 숨어있을까요?</p>
      </div>
      
      <div style={styles.uploadContainer}>
        <div style={styles.uploadCard}>
          {files.length === 0 ? (
            <div style={styles.uploadPlaceholder} onClick={handleAddPhoto}>
              <div style={styles.plusIcon}>+</div>
              <p style={styles.uploadText}>여행사진을 1장 선택해주세요</p>
              <p style={styles.uploadLimit}>(3:4 권장)</p>
            </div>
          ) : (
            <div style={styles.previewContainer}>
              <img src={URL.createObjectURL(files[0])} alt="Preview" style={styles.imagePreview} />
            </div>
          )}
        </div>
      </div>
      
      <div style={styles.instructionContainer}>
        <p style={styles.instructionText}>
          AI가 사진 속 장소를 추측하고,
          <br />
          당신만의 여행 캐릭터까지 분석해드려요.
        </p>
      </div>
      
      {error && (
        <div style={error === ERROR_MESSAGES.API_ERROR ? styles.serviceUnavailableText : styles.errorText}>
          {error}
        </div>
      )}
      
      {isAnalyzing && (
        <div style={styles.loadingText}>
          🤖 AI가 사진을 분석하고 있어요...
        </div>
      )}
      
      <div style={styles.buttonContainer}>
        <button 
          style={styles.secondaryButton} 
          onClick={handleReset}
          disabled={isAnalyzing}
        >
          다시 선택
        </button>
        <button 
          style={styles.primaryButton} 
          onClick={handleConfirm}
          disabled={isAnalyzing || files.length === 0}
        >
          {isAnalyzing ? '분석 중...' : '분석하기'}
        </button>
      </div>
    </div>
  );
};

export default TripOnPage;