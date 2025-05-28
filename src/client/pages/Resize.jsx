import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Resize = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [images, setImages] = useState(location.state?.files || []);

  const handleResize = () => {
    // 이미지 리사이징 처리
    const resizedImages = images.map(image => {
      // 여기에 실제 리사이징 로직 추가
      return image;
    });
    setImages(resizedImages);
    // Loading 페이지로 이동
    navigate('/loading');
  };

  return (
    <div className="resize-container">
      <h2>이미지 크기 조정</h2>
      <div className="image-preview">
        {images.map((image, index) => (
          <div key={index} className="preview-item">
            <img src={URL.createObjectURL(image)} alt={`Preview ${index}`} />
            <div className="resize-controls">
              {/* 리사이징 컨트롤 추가 */}
            </div>
          </div>
        ))}
      </div>
      <button onClick={handleResize}>분석 시작</button>
    </div>
  );
};

export default Resize;