import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CollageGrid from '../components/CollageGrid';
import AnalysisCard from '../components/AnalysisCard';
import '../styles/Collage.css';
import Indicator from '../components/Indicator';
import html2canvas from 'html2canvas';

const Collage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const totalPages = 2;
  const touchStartX = useRef(null);
  const collageRef = useRef(null);

  // 이미지가 없으면 이전 페이지로 리다이렉트
  useEffect(() => {
    if (!location.state?.images) {
      navigate('/');
    }
  }, [location.state, navigate]);

  const handleSave = async () => {
    if (!collageRef.current) return;

    try {
      setIsProcessing(true);
      setError(null);

      const canvas = await html2canvas(collageRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null
      });

      const link = document.createElement('a');
      link.download = 'tripon_collage.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      setError('이미지 저장 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleShare = async () => {
    if (!collageRef.current) return;

    try {
      setIsProcessing(true);
      setError(null);

      const canvas = await html2canvas(collageRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null
      });

      canvas.toBlob(async (blob) => {
        const file = new File([blob], 'tripon.png', { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'TRIP:ON 여행 네컷',
            text: '여행 네컷을 확인해보세요',
          });
        } else {
          // 공유가 지원되지 않는 경우 다운로드로 대체
          handleSave();
        }
      });
    } catch (err) {
      setError('이미지 공유 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - endX;

    if (diff > 50 && page < totalPages - 1) setPage(page + 1);
    if (diff < -50 && page > 0) setPage(page - 1);
  };

  return (
    <div 
      className="collage-container" 
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <img src="/asset/logo.png" alt="logo" className="logo" />

      <div className="collage-wrapper" ref={collageRef}>
        {page === 0 ? (
          <CollageGrid images={location.state?.images} />
        ) : (
          <AnalysisCard />
        )}
        <Indicator total={totalPages} current={page} onClick={setPage} />
      </div>

      <div className="collage-controls">
        <button 
          onClick={handleSave}
          disabled={isProcessing}
          className={isProcessing ? 'processing' : ''}
        >
          <img src="/asset/download.png" alt="download" className='download' />
        </button>
        <button 
          onClick={handleShare}
          disabled={isProcessing}
          className={isProcessing ? 'processing' : ''}
        >
          <img src="/asset/kakao.png" alt="kakao" className='kakao' />
        </button>
        <button 
          onClick={handleShare}
          disabled={isProcessing}
          className={isProcessing ? 'processing' : ''}
        >
          <img src="/asset/instagram.png" alt="instagram" className='instagram' />
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {isProcessing && <div className="processing-overlay">처리 중...</div>}
    </div>
  );
};

export default Collage;
