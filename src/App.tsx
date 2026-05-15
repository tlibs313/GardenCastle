import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { config } from './game/config';
import { WeatherHUD } from './components/WeatherHUD';
import { EvolutionHub } from './components/EvolutionHub';
import { useGameStore } from './store/useGameStore';

function App() {
  const gameRef = useRef<Phaser.Game | null>(null);
  const { isHubOpen, setHubOpen } = useGameStore();

  useEffect(() => {
    if (!gameRef.current) {
      gameRef.current = new Phaser.Game(config);
    }
    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (gameRef.current) {
      if (isHubOpen) {
        gameRef.current.scene.scenes.forEach(scene => {
          scene.scene.pause();
        });
      } else {
        gameRef.current.scene.scenes.forEach(scene => {
          scene.scene.resume();
        });
      }
    }
  }, [isHubOpen]);

  return (
    <div className="App" style={{ position: 'relative', height: '100vh', width: '100vw', backgroundColor: '#1a1a1a', overflow: 'hidden' }}>
      <header style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '1rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', zIndex: 1001 }}>
        <h1 style={{ margin: '0 1rem 0 0', color: 'white', fontSize: '1.5rem', fontWeight: '900', textTransform: 'uppercase', fontStyle: 'italic' }}>GardenCastle</h1>
        <button 
          onClick={() => {
            console.log("Opening Hub...");
            setHubOpen(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 pointer-events-auto"
        >
          Evolution Hub
        </button>
      </header>
      
      <div id="game-container" style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}></div>
      
      <WeatherHUD />

      {isHubOpen && (
        <EvolutionHub onClose={() => setHubOpen(false)} />
      )}
    </div>
  );
}

export default App;
