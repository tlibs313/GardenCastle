import React from 'react';
import { useGameStore } from '../store/useGameStore';

export const WeatherHUD: React.FC = () => {
  const { timeOfDay, forecast } = useGameStore();

  return (
    <div style={{
      position: 'absolute',
      top: '10px',
      right: '10px',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      color: 'white',
      padding: '15px',
      borderRadius: '8px',
      fontFamily: 'monospace',
      pointerEvents: 'none',
      zIndex: 500
    }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#4caf50' }}>Weather Station</h3>
      <div>Time: <span style={{ color: timeOfDay === 'day' ? '#ffeb3b' : '#9c27b0' }}>{timeOfDay.toUpperCase()}</span></div>
      <div style={{ marginTop: '10px' }}>
        <strong>Forecast:</strong>
        <div style={{ fontSize: '0.9em', marginTop: '5px' }}>
          Day 1: {forecast[0]}% Rain<br />
          Day 2: {forecast[1]}% Rain<br />
          Day 3: {forecast[2]}% Rain
        </div>
      </div>
    </div>
  );
};
