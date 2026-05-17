import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { useCareerStore } from '../store/useCareerStore';

export const Dashboard: React.FC = () => {
  const { 
    waveNumber, 
    pestsKilled, 
    pestsToSpawn, 
    incomingPests, 
    plantCount, 
    plantLimit 
  } = useGameStore();
  
  const { totalRP } = useCareerStore();

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: '800px',
    backgroundColor: 'rgba(31, 41, 55, 0.9)',
    borderBottom: '4px solid #6366f1',
    borderLeft: '4px solid #6366f1',
    borderRight: '4px solid #6366f1',
    borderBottomLeftRadius: '1rem',
    borderBottomRightRadius: '1rem',
    padding: '0.75rem 1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: 'white',
    zIndex: 1000,
    fontFamily: 'monospace',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
  };

  const sectionStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.25rem'
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    color: '#9ca3af',
    fontWeight: 'bold'
  };

  const valueStyle: React.CSSProperties = {
    fontSize: '1.25rem',
    fontWeight: '900'
  };

  const incomingLabelStyle: React.CSSProperties = {
    fontSize: '0.7rem',
    color: '#818cf8',
    maxWidth: '200px',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  };

  const incomingText = Object.entries(incomingPests)
    .map(([type, count]) => `${type.replace('_', ' ')} x${count}`)
    .join(', ');

  const capacityColor = plantCount >= plantLimit ? '#ef4444' : plantCount >= plantLimit * 0.8 ? '#f59e0b' : '#10b981';

  return (
    <div style={containerStyle}>
      {/* Wave Info */}
      <div style={sectionStyle}>
        <span style={labelStyle}>Wave</span>
        <span style={valueStyle}>{waveNumber}</span>
      </div>

      {/* Kill Progress */}
      <div style={sectionStyle}>
        <span style={labelStyle}>Pests Popped</span>
        <span style={{ ...valueStyle, color: '#fbbf24' }}>
          {pestsKilled} / {pestsToSpawn}
        </span>
        <div style={incomingLabelStyle} title={incomingText}>
          Next: {incomingText || 'None'}
        </div>
      </div>

      {/* Plant Capacity */}
      <div style={sectionStyle}>
        <span style={labelStyle}>Garden Capacity</span>
        <span style={{ ...valueStyle, color: capacityColor }}>
          {plantCount} / {plantLimit}
        </span>
      </div>

      {/* Resources */}
      <div style={sectionStyle}>
        <span style={labelStyle}>Research Points</span>
        <span style={{ ...valueStyle, color: '#facc15' }}>{totalRP} RP</span>
      </div>
    </div>
  );
};