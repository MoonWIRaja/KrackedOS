import React, { useEffect, useMemo, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import BugSquash from '../../../components/game/BugSquash';

const LOCAL_GAME_KEY = 'ijamos_game_state';

const DEFAULT_GAME_STATE = {
  vibes: 0,
  total_vibes_earned: 0,
  level: 1,
  xp: 0,
  last_idle_claim: new Date().toISOString()
};

const getLevel = (xp) => {
  if (xp >= 2500) return 7;
  if (xp >= 1500) return 6;
  if (xp >= 1000) return 5;
  if (xp >= 600) return 4;
  if (xp >= 300) return 3;
  if (xp >= 100) return 2;
  return 1;
};

export default function BuilderStudioLocal() {
  const [loading, setLoading] = useState(true);
  const [playingBugSquash, setPlayingBugSquash] = useState(false);
  const [gameState, setGameState] = useState(DEFAULT_GAME_STATE);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_GAME_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setGameState({ ...DEFAULT_GAME_STATE, ...parsed });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem(LOCAL_GAME_KEY, JSON.stringify(gameState));
    }
  }, [gameState, loading]);

  const stats = useMemo(() => {
    const level = getLevel(gameState.xp || 0);
    return {
      level,
      toNext: Math.max(0, (level * 150) - (gameState.xp || 0))
    };
  }, [gameState.xp]);

  const handleBugSquashComplete = (score) => {
    setPlayingBugSquash(false);
    if (score <= 0) return;

    setGameState((prev) => {
      const nextXp = (prev.xp || 0) + score;
      const nextLevel = getLevel(nextXp);
      return {
        ...prev,
        vibes: (prev.vibes || 0) + score,
        total_vibes_earned: (prev.total_vibes_earned || 0) + score,
        xp: nextXp,
        level: nextLevel,
        last_idle_claim: new Date().toISOString()
      };
    });
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
        <RefreshCw size={32} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
        <div>Loading Local Studio...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', minHeight: '100%', background: '#111827', color: '#f9fafb' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '16px' }}>
        <div style={{ background: '#0f172a', border: '2px solid #f5d000', borderRadius: '10px', padding: '12px' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 800 }}>LEVEL</div>
          <div style={{ fontSize: '24px', color: '#f5d000', fontWeight: 900 }}>{stats.level}</div>
        </div>
        <div style={{ background: '#0f172a', border: '2px solid #22c55e', borderRadius: '10px', padding: '12px' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 800 }}>VIBES</div>
          <div style={{ fontSize: '24px', color: '#22c55e', fontWeight: 900 }}>{gameState.vibes || 0}</div>
        </div>
        <div style={{ background: '#0f172a', border: '2px solid #38bdf8', borderRadius: '10px', padding: '12px' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 800 }}>XP</div>
          <div style={{ fontSize: '24px', color: '#38bdf8', fontWeight: 900 }}>{gameState.xp || 0}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button
          className="btn"
          onClick={() => setPlayingBugSquash(true)}
          style={{ background: '#f5d000', color: '#0b1220', border: '2px solid #0b1220', fontWeight: 900 }}
        >
          PLAY BUG SQUASH
        </button>
        <button
          className="btn"
          onClick={() => setGameState(DEFAULT_GAME_STATE)}
          style={{ background: '#ef4444', color: '#fff', border: '2px solid #7f1d1d', fontWeight: 900 }}
        >
          RESET LOCAL STATS
        </button>
      </div>

      <div style={{ marginTop: '16px', fontSize: '12px', color: '#94a3b8', fontFamily: 'monospace' }}>
        Local-only arcade mode active. Progress is saved in browser storage.
      </div>

      {playingBugSquash && (
        <BugSquash
          onComplete={handleBugSquashComplete}
          onClose={() => setPlayingBugSquash(false)}
        />
      )}
    </div>
  );
}
