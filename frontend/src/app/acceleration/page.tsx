// app/page.js
"use client";

import DataCollector from '@/components/DataCollector';

export default function Home() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>CarbonToken Mock: Eco-friendly Delivery Tracker</h1>
      <DataCollector />
    </main>
  );
}
