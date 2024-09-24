"use client";
import { useEffect } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = 'pk.eyJ1Ijoid2FzYWJpamlybyIsImEiOiJjbTFnMmpkamIyeWc1Mm5zY2o2eGozYzVjIn0.eLUyA4ljoK5mxKXN8XZZFw'; // ここにMapboxのアクセストークンを入力

const MapPage = () => {
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: "map", // mapを描画するためのHTML要素のID
      style: "mapbox://styles/mapbox/streets-v11", // 地図のスタイル
      center: [127.03009780865155, 37.49197084725775], // 初期表示位置（経度, 緯度）東京
      zoom: 15, // 初期ズームレベル
    });

    // 地図にズームコントロールを追加する
    map.addControl(new mapboxgl.NavigationControl());

    return () => map.remove(); // クリーンアップ
  }, []);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <div id="map" style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default MapPage;


