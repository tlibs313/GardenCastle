import React from 'react';
import { useCareerStore } from '../store/useCareerStore';
import { RESEARCH_TREES, ResearchNode } from '../game/config/researchTrees';

interface EvolutionHubProps {
  onClose: () => void;
}

export const EvolutionHub: React.FC<EvolutionHubProps> = ({ onClose }) => {
  const { totalRP, unlockedNodes, unlockNode, stats } = useCareerStore();

  const isUnlocked = (nodeId: string) => unlockedNodes.includes(nodeId);

  const canAfford = (cost: number) => totalRP >= cost;

  const isAvailable = (node: ResearchNode) => {
    if (isUnlocked(node.id)) return false;
    if (!node.prerequisiteId) return true;
    return isUnlocked(node.prerequisiteId);
  };

  const handlePurchase = (node: ResearchNode) => {
    if (isAvailable(node) && canAfford(node.cost)) {
      unlockNode(node.id, node.cost);
    }
  };

  const renderNode = (node: ResearchNode) => {
    const unlocked = isUnlocked(node.id);
    const available = isAvailable(node);
    const affordable = canAfford(node.cost);

    let statusText = 'Locked';
    let backgroundColor = '#374151'; // bg-gray-700
    let textColor = '#9ca3af'; // text-gray-400

    if (unlocked) {
      statusText = 'Purchased';
      backgroundColor = '#059669'; // bg-green-600
      textColor = 'white';
    } else if (available) {
      statusText = affordable ? `Buy (${node.cost} RP)` : `Need ${node.cost} RP`;
      backgroundColor = affordable ? '#2563eb' : '#7f1d1d'; // bg-blue-600 or bg-red-900
      textColor = 'white';
    }

    return (
      <div 
        key={node.id}
        style={{
          padding: '1rem',
          borderRadius: '0.5rem',
          border: `2px solid ${unlocked ? '#4ade80' : '#4b5563'}`,
          marginBottom: '1rem',
          backgroundColor: '#1f2937'
        }}
      >
        <h4 style={{ fontWeight: 'bold', fontSize: '1.125rem', margin: '0 0 0.5rem 0', color: 'white' }}>{node.title}</h4>
        <p style={{ fontSize: '0.875rem', color: '#d1d5db', marginBottom: '0.5rem' }}>{node.description}</p>
        <button
          disabled={unlocked || !available || !affordable}
          onClick={() => handlePurchase(node)}
          style={{
            padding: '0.25rem 1rem',
            borderRadius: '0.25rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            backgroundColor,
            color: textColor,
            border: 'none',
            cursor: unlocked || !available || !affordable ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s'
          }}
        >
          {statusText}
        </button>
      </div>
    );
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '2rem'
    }}>
      <div style={{
        backgroundColor: '#1f2937',
        width: '100%',
        maxWidth: '1000px',
        height: '100%',
        maxHeight: '90vh',
        borderRadius: '1rem',
        border: '4px solid #6366f1',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        color: 'white'
      }}>
        {/* Header */}
        <div style={{ padding: '1.5rem', backgroundColor: '#312e81', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.875rem', fontWeight: '900', margin: 0, fontStyle: 'italic', textTransform: 'uppercase' }}>Evolution Hub</h2>
            <p style={{ margin: 0, color: '#c7d2fe', fontFamily: 'monospace' }}>
              Current Research Points: <span style={{ color: '#facc15', fontWeight: 'bold' }}>{totalRP} RP</span>
            </p>
          </div>
          <button 
            onClick={onClose}
            style={{
              backgroundColor: '#dc2626',
              color: 'white',
              padding: '0.5rem 1.5rem',
              borderRadius: '9999px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Back to Garden
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '1.5rem' }}>
          {/* Stats Dashboard */}
          <div style={{ backgroundColor: '#111827', padding: '1.5rem', borderRadius: '0.75rem', border: '2px solid #4338ca', height: 'fit-content' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#818cf8', marginBottom: '1rem', borderBottom: '1px solid #4338ca', paddingBottom: '0.5rem' }}>Career Stats</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontFamily: 'monospace' }}>
              <div>
                <p style={{ color: '#9ca3af', fontSize: '0.75rem', margin: 0 }}>Pests Popped</p>
                <p style={{ fontSize: '1.5rem', margin: 0 }}>{stats.pestsPopped}</p>
              </div>
              <div>
                <p style={{ color: '#9ca3af', fontSize: '0.75rem', margin: 0 }}>Plants Harvested</p>
                <p style={{ fontSize: '1.5rem', margin: 0 }}>{stats.plantsHarvested}</p>
              </div>
              <div>
                <p style={{ color: '#9ca3af', fontSize: '0.75rem', margin: 0 }}>Max Difficulty</p>
                <p style={{ fontSize: '1.5rem', margin: 0 }}>x{stats.highestDifficultyCleared.toFixed(1)}</p>
              </div>
            </div>
          </div>

          {/* Research Trees */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {/* Water Tree */}
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#60a5fa', textAlign: 'center', textTransform: 'uppercase', backgroundColor: 'rgba(30, 58, 138, 0.3)', padding: '0.5rem', borderRadius: '0.25rem', marginBottom: '1rem' }}>Water Tech</h3>
              {RESEARCH_TREES.water.map(renderNode)}
            </div>

            {/* Tool Tree */}
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#fb923c', textAlign: 'center', textTransform: 'uppercase', backgroundColor: 'rgba(124, 45, 18, 0.3)', padding: '0.5rem', borderRadius: '0.25rem', marginBottom: '1rem' }}>Defense Tools</h3>
              {RESEARCH_TREES.tool.map(renderNode)}
            </div>

            {/* Biology Tree */}
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#4ade80', textAlign: 'center', textTransform: 'uppercase', backgroundColor: 'rgba(20, 83, 45, 0.3)', padding: '0.5rem', borderRadius: '0.25rem', marginBottom: '1rem' }}>Bio Lab</h3>
              {RESEARCH_TREES.biology.map(renderNode)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};