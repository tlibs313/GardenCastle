import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { config } from './game/config';
import { WeatherHUD } from './components/WeatherHUD';

function App() {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!gameRef.current) {
      gameRef.current = new Phaser.Game(config);
    }
    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return (
    <div className="App" style={{ position: 'relative' }}>
      <h1 style={{ textAlign: 'center' }}>GardenCastle</h1>
      <div id="game-container" style={{ display: 'flex', justifyContent: 'center' }}></div>
      <WeatherHUD />
    </div>
  );
}

export default App;
