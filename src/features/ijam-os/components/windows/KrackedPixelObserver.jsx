import React, { useEffect, useMemo, useRef } from 'react';

const TILE = 16;
const COLS = 20;
const ROWS = 12;
const SCALE = 2;

const ZONES = [
  { id: 'guild', x0: 0, x1: 7, color: '#12301f' },
  { id: 'darkops', x0: 8, x1: 13, color: '#1f2436' },
  { id: 'frontier', x0: 14, x1: 19, color: '#243619' }
];

const ROLE_COLORS = {
  master: '#22c55e',
  analyst: '#f5d000',
  engineer: '#93c5fd',
  security: '#ef4444',
  devops: '#fb923c'
};

const AGENT_BLUEPRINT = [
  { id: 'master', name: 'Moon', role: 'master', zone: 'guild' },
  { id: 'analyst', name: 'Ara', role: 'analyst', zone: 'frontier' },
  { id: 'engineer', name: 'Ezra', role: 'engineer', zone: 'guild' },
  { id: 'security', name: 'Sari', role: 'security', zone: 'darkops' },
  { id: 'devops', name: 'Dian', role: 'devops', zone: 'darkops' }
];

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function zoneRange(zoneId) {
  const z = ZONES.find((zone) => zone.id === zoneId) || ZONES[0];
  return {
    minX: z.x0 + 0.7,
    maxX: z.x1 + 0.3,
    minY: 1.5,
    maxY: ROWS - 1.5
  };
}

function pickTarget(zoneId) {
  const r = zoneRange(zoneId);
  return { tx: rand(r.minX, r.maxX), ty: rand(r.minY, r.maxY) };
}

function createAgents() {
  return AGENT_BLUEPRINT.map((agent) => {
    const r = zoneRange(agent.zone);
    const x = rand(r.minX, r.maxX);
    const y = rand(r.minY, r.maxY);
    const target = pickTarget(agent.zone);
    return {
      ...agent,
      x,
      y,
      tx: target.tx,
      ty: target.ty,
      speed: rand(0.005, 0.01)
    };
  });
}

export default function KrackedPixelObserver({ focusedWindowLabel, completionPct, latestEvent = null }) {
  const canvasRef = useRef(null);
  const agentsRef = useRef(createAgents());
  const frameRef = useRef(null);
  const lastTsRef = useRef(0);
  const pulseRef = useRef(0);
  const focusedWindowRef = useRef(focusedWindowLabel || '');
  const latestEventRef = useRef(null);
  const bubbleRef = useRef('');
  const bubbleUntilRef = useRef(0);

  const missionBubble = useMemo(() => {
    if (completionPct >= 90) return 'Release window armed';
    if (completionPct >= 60) return 'Quality gates in progress';
    if (completionPct >= 30) return 'Implementation active';
    return 'Discovery booting';
  }, [completionPct]);

  useEffect(() => {
    focusedWindowRef.current = focusedWindowLabel || '';
  }, [focusedWindowLabel]);

  useEffect(() => {
    if (!latestEvent || latestEventRef.current?.id === latestEvent.id) return;
    latestEventRef.current = latestEvent;
    const roleHint = latestEvent.meta?.roleHint;
    const target = agentsRef.current.find((agent) => agent.role === roleHint) || agentsRef.current[0];
    if (target) {
      const next = pickTarget(target.zone);
      agentsRef.current = agentsRef.current.map((agent) =>
        agent.id === target.id ? { ...agent, tx: next.tx, ty: next.ty } : agent
      );
    }
    bubbleRef.current = latestEvent.message || missionBubble;
    bubbleUntilRef.current = performance.now() + 5000;
  }, [latestEvent, missionBubble]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const width = COLS * TILE * SCALE;
    const height = ROWS * TILE * SCALE;
    canvas.width = width;
    canvas.height = height;

    const drawGrid = () => {
      ctx.fillStyle = '#0b1220';
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.scale(SCALE, SCALE);
      ctx.imageSmoothingEnabled = false;

      ZONES.forEach((zone) => {
        ctx.fillStyle = zone.color;
        ctx.fillRect(zone.x0 * TILE, 0, (zone.x1 - zone.x0 + 1) * TILE, ROWS * TILE);
      });

      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x <= COLS; x += 1) {
        ctx.beginPath();
        ctx.moveTo(x * TILE, 0);
        ctx.lineTo(x * TILE, ROWS * TILE);
        ctx.stroke();
      }
      for (let y = 0; y <= ROWS; y += 1) {
        ctx.beginPath();
        ctx.moveTo(0, y * TILE);
        ctx.lineTo(COLS * TILE, y * TILE);
        ctx.stroke();
      }

      ctx.restore();
    };

    const drawAgent = (agent, pulse) => {
      const px = agent.x * TILE * SCALE;
      const py = agent.y * TILE * SCALE;
      const body = 10 + pulse;
      ctx.fillStyle = ROLE_COLORS[agent.role] || '#93c5fd';
      ctx.fillRect(px - body / 2, py - body / 2, body, body);

      ctx.strokeStyle = '#020617';
      ctx.lineWidth = 2;
      ctx.strokeRect(px - body / 2, py - body / 2, body, body);

      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(15,23,42,0.85)';
      const textW = ctx.measureText(agent.name).width + 8;
      ctx.fillRect(px - textW / 2, py - 18, textW, 12);
      ctx.fillStyle = '#e2e8f0';
      ctx.fillText(agent.name, px, py - 8);
    };

    const drawBubble = (ts) => {
      const text = ts < bubbleUntilRef.current && bubbleRef.current
        ? `EVENT> ${bubbleRef.current}`
        : `MASTER> ${missionBubble}`;
      const x = 12;
      const y = height - 30;
      ctx.font = '11px monospace';
      const w = Math.min(width - 24, ctx.measureText(text).width + 16);
      ctx.fillStyle = 'rgba(15,23,42,0.9)';
      ctx.fillRect(x, y, w, 18);
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, w, 18);
      ctx.fillStyle = '#86efac';
      ctx.fillText(text, x + w / 2, y + 12);
    };

    const tick = (ts) => {
      if (!lastTsRef.current) lastTsRef.current = ts;
      const dt = ts - lastTsRef.current;
      lastTsRef.current = ts;
      pulseRef.current += dt * 0.01;
      const pulse = Math.sin(pulseRef.current) > 0 ? 1 : 0;

      agentsRef.current = agentsRef.current.map((agent) => {
        const dx = agent.tx - agent.x;
        const dy = agent.ty - agent.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 0.15) {
          const next = pickTarget(agent.zone);
          return { ...agent, tx: next.tx, ty: next.ty };
        }
        const step = agent.speed * dt;
        return {
          ...agent,
          x: agent.x + (dx / dist) * step,
          y: agent.y + (dy / dist) * step
        };
      });

      drawGrid();
      agentsRef.current
        .slice()
        .sort((a, b) => a.y - b.y)
        .forEach((agent) => drawAgent(agent, pulse));
      drawBubble(ts);

      if (focusedWindowRef.current) {
        ctx.font = '10px monospace';
        ctx.fillStyle = '#f5d000';
        ctx.fillText(`FOCUS: ${focusedWindowRef.current}`, width - 92, 14);
      }

      frameRef.current = window.requestAnimationFrame(tick);
    };

    frameRef.current = window.requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
    };
  }, [missionBubble]);

  return (
    <div style={{ border: '2px solid #1f2937', borderRadius: '10px', overflow: 'hidden', background: '#020617' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: 'auto', display: 'block' }} />
    </div>
  );
}
