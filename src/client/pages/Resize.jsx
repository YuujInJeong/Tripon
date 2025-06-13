import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ImageUploader from '../components/ImageUploader';
import '../styles/Resize.css';

const Resize = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const imageCount = location.state?.imageCount || 4;

  const handleImagesProcessed = (processedImages) => {
    navigate('/collage', { state: { images: processedImages } });
  };

  return (
    <div className="resize-container">
      <h2>이미지 크기 조정</h2>
      <ImageUploader 
        onImagesProcessed={handleImagesProcessed}
        maxImages={imageCount}
      />
    </div>
  );
};

export default Resize;