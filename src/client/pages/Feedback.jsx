import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Feedback = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchLocation = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=10`,
        {
          headers: {
            'Accept-Language': 'ko'
          }
        }
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error('위치 검색에 실패했습니다:', error);
      setError('위치 검색 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    searchLocation(value);
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setSearchTerm(location.display_name);
    setSearchResults([]);
  };

  const handleContinue = () => {
    if (selectedLocation) {
      navigate('/collage', { state: { location: selectedLocation } });
    }
  };

  return (
    <div style={{width: 402, height: 874, position: 'relative', background: '#F7F4F1', overflow: 'hidden'}}>
      <img 
        style={{width: 103, height: 103, left: 140, top: 2, position: 'absolute'}} 
        src="https://placehold.co/103x103" 
        alt="로고"
      />
      <div style={{width: 283, height: 44, left: 60, top: 112, position: 'absolute', background: 'rgba(255, 255, 255, 0.16)', borderRadius: 10, border: '2px rgba(13, 158, 209, 0.78) solid'}}>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="국가 / 도시명을 검색해주세요"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            background: 'transparent',
            padding: '0 15px',
            color: 'rgba(13, 158, 209, 0.40)',
            fontSize: 18,
            fontFamily: 'Inter',
            fontWeight: '700',
            outline: 'none'
          }}
        />
      </div>
      
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: 166,
          left: 60,
          width: 283,
          padding: '10px',
          textAlign: 'center',
          color: 'rgba(13, 158, 209, 0.78)'
        }}>
          검색 중...
        </div>
      )}
      
      {error && (
        <div style={{
          position: 'absolute',
          top: 166,
          left: 60,
          width: 283,
          padding: '10px',
          textAlign: 'center',
          color: 'red',
          background: 'rgba(255, 0, 0, 0.1)',
          borderRadius: 5
        }}>
          {error}
        </div>
      )}
      
      {searchResults.length > 0 && (
        <div style={{
          position: 'absolute',
          top: 166,
          left: 60,
          width: 283,
          maxHeight: 300,
          background: 'white',
          borderRadius: 10,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          overflowY: 'auto'
        }}>
          {searchResults.map((location) => (
            <div
              key={location.place_id}
              style={{
                padding: '10px 15px',
                borderBottom: '1px solid #eee',
                cursor: 'pointer'
              }}
              onClick={() => handleLocationSelect(location)}
            >
              {location.display_name}
            </div>
          ))}
        </div>
      )}

      {selectedLocation && (
        <button
          onClick={handleContinue}
          style={{
            position: 'absolute',
            bottom: 40,
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '12px 24px',
            background: 'rgba(13, 158, 209, 0.78)',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            fontSize: 16,
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          콜라주 만들기
        </button>
      )}
    </div>
  );
};

export default Feedback;