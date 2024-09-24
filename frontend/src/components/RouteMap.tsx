"use client";

import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
// @ts-ignore
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESSTOKEN!;

type MapProps = {
  currentLocation: [number, number] | null;
};

export const RouteMap = ({ currentLocation }: MapProps) => {
  useEffect(() => {
    if (currentLocation) {
      const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: currentLocation,
        zoom: 12,
      });

      const marker = new mapboxgl.Marker({
        color: 'blue',
      })
        .setLngLat(currentLocation)
        .addTo(map);

      const directions = new MapboxDirections({
        accessToken: mapboxgl.accessToken,
        unit: 'metric',
        profile: 'mapbox/driving',
        controls: {
          inputs: false,
          instructions: false,
          profileSwitcher: false,
        },
      });

      map.addControl(directions, 'top-left');

      directions.setOrigin(currentLocation);
      directions.setDestination([127.030724, 37.554653]);

      return () => {
        map.remove();
        marker.remove();
      };
    }
  }, [currentLocation]);

  return <div id="map" style={{ width: '100%', height: '100%' }} />;
};

