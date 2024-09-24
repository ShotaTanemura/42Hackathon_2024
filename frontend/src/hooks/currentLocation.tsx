import { useState, useEffect } from 'react';

export const useCurrentLocation = () => {
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCurrentLocation([position.coords.longitude, position.coords.latitude]);
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }, []);

  return currentLocation;
};
