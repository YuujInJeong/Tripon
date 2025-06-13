import React from 'react';
import '../styles/CollageGrid.css';

const CollageGrid = ({ images = [] }) => {
  const imageCount = images.length;
  const isEight = imageCount > 4;

  // 이미지가 없을 경우 로딩 상태 표시
  if (images.length === 0) {
    return (
      <div className="collage-grid loading">
        <div className="loading-spinner"></div>
        <p>이미지 로딩 중...</p>
      </div>
    );
  }

  return (
    <div className={`collage-grid ${isEight ? 'grid-8' : 'grid-4'}`}>
      {images.map((src, index) => (
        <div key={index} className="collage-cell">
          <img 
            src={src} 
            alt={`uploaded ${index}`} 
            className="collage-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/asset/placeholder.png';
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default CollageGrid;