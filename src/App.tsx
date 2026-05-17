import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { config } from './game/config';
import { WeatherHUD } from './components/WeatherHUD';
import { EvolutionHub } from './components/EvolutionHub';
import { Dashboard } from './components/Dashboard';
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
      <Dashboard />

      <header style={{ position: 'absolute', top: '4rem', left: 0, right: 0, padding: '1rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', zIndex: 1001 }}>
        <button 
          onClick={() => {
            console.log("Opening Hub...");
            setHubOpen(true);
          }}
          style={{
            backgroundColor: '#4f46e5',
            color: 'white',
            fontWeight: 'bold',
            padding: '0.5rem 1.5rem',
            borderRadius: '9999px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            pointerEvents: 'auto'
          }}
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
