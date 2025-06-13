import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import './Resize.css';

const Resize = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const imageCount = location.state?.imageCount || 4;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [processedImages, setProcessedImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [crop, setCrop] = useState();
  const [imgRef, setImgRef] = useState(null);
  const fileInputRef = useRef(null);

  const aspectRatio = imageCount === 8 ? 16/9 : 3/4;

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        aspectRatio,
        width,
        height
      ),
      width,
      height
    );
    setCrop(crop);
  };

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async () => {
    if (!imgRef || !crop) return;

    const canvas = document.createElement('canvas');
    const scaleX = imgRef.naturalWidth / imgRef.width;
    const scaleY = imgRef.naturalHeight / imgRef.height;
    
    // 크롭된 이미지의 크기 계산
    const cropWidth = crop.width * scaleX;
    const cropHeight = crop.height * scaleY;
    
    // 캔버스 크기를 크롭된 이미지의 비율에 맞게 설정
    canvas.width = cropWidth;
    canvas.height = cropHeight;
    
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      imgRef,
      crop.x * scaleX,
      crop.y * scaleY,
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight
    );

    const croppedImage = canvas.toDataURL('image/jpeg', 0.95);
    
    // 크롭된 이미지를 Blob으로 변환
    const blob = await (await fetch(croppedImage)).blob();
    const croppedFile = new File([blob], `cropped_${currentImageIndex}.jpg`, { type: 'image/jpeg' });
    
    // 로컬 스토리지에 임시 저장
    const reader = new FileReader();
    reader.onload = (e) => {
      const newImages = [...processedImages];
      newImages[currentImageIndex] = e.target.result;
      setProcessedImages(newImages);
      setSelectedImage(null);
    };
    reader.readAsDataURL(croppedFile);
  };

  const handleNext = () => {
    if (currentImageIndex < imageCount - 1) {
      setCurrentImageIndex(prev => prev + 1);
      if (!processedImages[currentImageIndex + 1]) {
        fileInputRef.current?.click();
      }
    }
  };

  const handlePrevious = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    }
  };

  const handleEdit = () => {
    if (selectedImage) {
      handleCropComplete();
    } else if (processedImages[currentImageIndex]) {
      setSelectedImage(processedImages[currentImageIndex]);
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleComplete = () => {
    navigate('/collage', { state: { images: processedImages } });
  };

  return (
    <div className="resize-container">
      <h2>이미지 크기 조정</h2>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageSelect}
        accept="image/*"
        style={{ display: 'none' }}
      />

      <div className="image-container">
        <div className="image-indicator">
          {Array.from({ length: imageCount }).map((_, index) => (
            <div
              key={index}
              className={`indicator-dot ${index === currentImageIndex ? 'active' : ''} ${
                processedImages[index] ? 'has-image' : ''
              }`}
              onClick={() => {
                setCurrentImageIndex(index);
                if (!processedImages[index]) {
                  fileInputRef.current?.click();
                }
              }}
            />
          ))}
        </div>

        {selectedImage ? (
          <div className="crop-container">
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              aspect={aspectRatio}
              className="crop-area"
            >
              <img
                ref={setImgRef}
                src={selectedImage}
                onLoad={onImageLoad}
                alt="Crop me"
                className="crop-image"
              />
            </ReactCrop>
          </div>
        ) : (
          <div className="image-preview" style={{ aspectRatio: aspectRatio }}>
            {processedImages[currentImageIndex] ? (
              <div className="preview-wrapper">
                <img 
                  src={processedImages[currentImageIndex]} 
                  alt={`Processed ${currentImageIndex + 1}`}
                  className="preview-image"
                />
                <button 
                  className="replace-button"
                  onClick={() => fileInputRef.current?.click()}
                >
                  사진 교체
                </button>
              </div>
            ) : (
              <div className="upload-placeholder" onClick={() => fileInputRef.current?.click()}>
                <p>이미지를 선택해주세요</p>
                <p className="aspect-ratio-text">비율: {imageCount === 8 ? '16:9' : '3:4'}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="control-buttons">
        <button 
          onClick={handlePrevious}
          disabled={currentImageIndex === 0}
          className="nav-button"
        >
          이전
        </button>
        <button 
          onClick={handleEdit}
          className="edit-button"
        >
          {selectedImage ? '크롭 완료' : '편집'}
        </button>
        <button 
          onClick={handleNext}
          disabled={currentImageIndex === imageCount - 1 && processedImages.length === imageCount}
          className="nav-button"
        >
          다음
        </button>
      </div>

      {processedImages.length === imageCount && (
        <button 
          onClick={handleComplete}
          className="complete-button"
        >
          완료
        </button>
      )}
    </div>
  );
};

export default Resize;