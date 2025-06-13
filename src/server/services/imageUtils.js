import Resizer from 'react-image-file-resizer';
import imageCompression from 'browser-image-compression';

// 이미지 압축 함수
export const compressImage = async (file) => {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true
  };
  
  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error('이미지 압축 실패:', error);
    throw error;
  }
};

// 이미지 리사이징 함수
export const resizeImage = (file) => {
  return new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      800, // maxWidth
      800, // maxHeight
      'JPEG',
      80, // quality
      0,
      (uri) => {
        resolve(uri);
      },
      'base64'
    );
  });
};

// base64를 Blob으로 변환
export const base64ToBlob = (base64) => {
  const byteString = atob(base64.split(',')[1]);
  const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  
  return new Blob([ab], { type: mimeString });
};

// S3 업로드를 위한 presigned URL 가져오기
export const getPresignedUrl = async (filename) => {
  try {
    const response = await fetch(
      `https://m177rqs76i.execute-api.ap-northeast-2.amazonaws.com/dev/api/presign?filename=${encodeURIComponent(filename)}`
    );
    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Presigned URL 가져오기 실패:', error);
    throw error;
  }
};

// S3에 이미지 업로드
export const uploadToS3 = async (file) => {
  try {
    const url = await getPresignedUrl(file.name);
    await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type
      },
      body: file
    });
    return url.split('?')[0]; // S3 최종 URL 반환
  } catch (error) {
    console.error('S3 업로드 실패:', error);
    throw error;
  }
}; 