"use client"

import { useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESSTOKEN!;

interface MapProps {
  currentLocation: [number, number] | null;
}

export const Map = ({ currentLocation }: MapProps) => {
  useEffect(() => {
    if (currentLocation) {
      const map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v11",
        center: currentLocation,
        zoom: 15,
      });

      map.addControl(new mapboxgl.NavigationControl());

      return () => map.remove();
    }
  }, [currentLocation]);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <div id="map" style={{ width: "100%", height: "100%" }} />
    </div>
  );
};