import React, { useState, useCallback } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { compressImage, resizeImage, base64ToBlob, uploadToS3 } from '../utils/imageUtils';

const ImageUploader = ({ onImagesProcessed, maxImages }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [processedImages, setProcessedImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [crop, setCrop] = useState();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > maxImages) {
      setError(`최대 ${maxImages}장의 이미지만 선택할 수 있습니다.`);
      return;
    }
    setSelectedFiles(files);
    setCurrentImageIndex(0);
  };

  const handleCropComplete = useCallback(async (croppedArea, croppedAreaPixels) => {
    if (!selectedFiles[currentImageIndex]) return;

    try {
      setIsProcessing(true);
      setError(null);

      // 1. 이미지 압축
      const compressedFile = await compressImage(selectedFiles[currentImageIndex]);
      
      // 2. 이미지 리사이징
      const resizedImage = await resizeImage(compressedFile);
      
      // 3. base64를 Blob으로 변환
      const blob = base64ToBlob(resizedImage);
      
      // 4. S3 업로드
      const uploadedUrl = await uploadToS3(blob);

      // 5. 처리된 이미지 저장
      const newProcessedImages = [...processedImages, uploadedUrl];
      setProcessedImages(newProcessedImages);

      // 6. 다음 이미지로 이동 또는 완료
      if (currentImageIndex < selectedFiles.length - 1) {
        setCurrentImageIndex(currentImageIndex + 1);
      } else {
        onImagesProcessed(newProcessedImages);
      }
    } catch (err) {
      setError('이미지 처리 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  }, [currentImageIndex, selectedFiles, processedImages, onImagesProcessed]);

  return (
    <div className="image-uploader">
      {selectedFiles.length === 0 ? (
        <div className="upload-area">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            id="file-input"
          />
          <label htmlFor="file-input" className="upload-button">
            이미지 선택하기
          </label>
        </div>
      ) : (
        <div className="crop-area">
          <ReactCrop
            crop={crop}
            onChange={c => setCrop(c)}
            onComplete={handleCropComplete}
          >
            <img
              src={URL.createObjectURL(selectedFiles[currentImageIndex])}
              alt={`Image ${currentImageIndex + 1}`}
            />
          </ReactCrop>
          <div className="progress">
            {currentImageIndex + 1} / {selectedFiles.length}
          </div>
        </div>
      )}
      
      {error && <div className="error-message">{error}</div>}
      {isProcessing && <div className="processing-message">이미지 처리 중...</div>}
    </div>
  );
};

export default ImageUploader; 