import React, { useMemo } from 'react';
import { Bot, ShieldCheck, Wrench, Rocket, Search } from 'lucide-react';
import KrackedPixelObserver from './KrackedPixelObserver';

const AGENT_CARDS = [
  { id: 'master', label: 'Master Agent', icon: Bot, color: '#22c55e' },
  { id: 'analyst', label: 'Analyst', icon: Search, color: '#f5d000' },
  { id: 'engineer', label: 'Engineer', icon: Wrench, color: '#bfdbfe' },
  { id: 'security', label: 'Security', icon: ShieldCheck, color: '#ef4444' },
  { id: 'devops', label: 'DevOps', icon: Rocket, color: '#fb923c' }
];

const stageLabels = [
  'Discovery',
  'Brainstorm',
  'Requirements',
  'Architecture',
  'Implementation',
  'Quality',
  'Deployment',
  'Release'
];

export default function KrackedMissionConsole({
  currentUser,
  userRank,
  userVibes,
  completedLessonsCount,
  totalLessons,
  focusedWindowLabel,
  openWindowsCount,
  missionEvents = [],
  latestMissionEvent = null
}) {
  const completionPct = totalLessons > 0 ? Math.round((completedLessonsCount / totalLessons) * 100) : 0;
  const activeStageCount = Math.max(1, Math.min(stageLabels.length, Math.ceil((completionPct / 100) * stageLabels.length)));
  const activeStages = stageLabels.slice(0, activeStageCount);

  const statusText = useMemo(() => {
    if (completionPct >= 100) return 'Mission complete. Ready for release cycle.';
    if (completionPct >= 70) return 'Execution stable. Prepare quality and deployment.';
    if (completionPct >= 40) return 'Core build in progress. Keep shipping.';
    return 'Bootstrapping mission track. Start with discovery.';
  }, [completionPct]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '14px', height: '100%', minHeight: 0 }}>
      <div style={{ background: '#0b1220', border: '2px solid #1f2937', borderRadius: '12px', padding: '14px', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <div style={{ fontSize: '11px', letterSpacing: '0.08em', color: '#22c55e', fontWeight: 900, marginBottom: '6px' }}>MISSION BRIEF</div>
        <div style={{ fontSize: '20px', color: '#f8fafc', fontWeight: 900 }}>{currentUser?.name || 'Local Builder'}</div>
        <div style={{ fontSize: '12px', color: '#86efac', marginTop: '2px' }}>{userRank} · {userVibes} vibes</div>

        <div style={{ marginTop: '12px', background: '#111827', border: '1px solid #334155', borderRadius: '10px', padding: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#cbd5e1', marginBottom: '8px' }}>
            <span>Progress</span>
            <span>{completionPct}%</span>
          </div>
          <div style={{ height: '10px', background: '#1e293b', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{ width: `${completionPct}%`, height: '100%', background: 'linear-gradient(90deg, #22c55e, #86efac)' }} />
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '8px' }}>{completedLessonsCount}/{totalLessons} learning modules complete</div>
        </div>

        <div style={{ marginTop: '12px', fontSize: '11px', color: '#f5d000', fontWeight: 900 }}>ACTIVE TRACK</div>
        <div style={{ marginTop: '8px', display: 'grid', gap: '6px', overflowY: 'auto', paddingRight: '4px' }}>
          {activeStages.map((stage) => (
            <div key={stage} style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.35)', borderRadius: '8px', padding: '8px 10px', color: '#d1fae5', fontSize: '12px', fontWeight: 700 }}>
              {stage}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateRows: 'auto auto 1fr auto auto', gap: '12px', minHeight: 0 }}>
        <div style={{ background: '#0b1220', border: '2px solid #1f2937', borderRadius: '12px', padding: '12px' }}>
          <div style={{ fontSize: '11px', color: '#f5d000', fontWeight: 900, marginBottom: '5px' }}>SYSTEM TELEMETRY</div>
          <div style={{ fontSize: '12px', color: '#cbd5e1' }}>Focused window: <span style={{ color: '#bfdbfe', fontWeight: 700 }}>{focusedWindowLabel || 'Desktop'}</span></div>
          <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '3px' }}>Open windows: <span style={{ color: '#86efac', fontWeight: 700 }}>{openWindowsCount}</span></div>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '7px' }}>{statusText}</div>
        </div>

        <KrackedPixelObserver
          focusedWindowLabel={focusedWindowLabel}
          completionPct={completionPct}
          latestEvent={latestMissionEvent}
        />

        <div style={{ background: '#0b1220', border: '2px solid #1f2937', borderRadius: '12px', padding: '12px', minHeight: 0, overflowY: 'auto' }}>
          <div style={{ fontSize: '11px', color: '#22c55e', fontWeight: 900, marginBottom: '8px' }}>AGENT ROSTER</div>
          <div style={{ display: 'grid', gap: '8px' }}>
            {AGENT_CARDS.map((agent) => {
              const Icon = agent.icon;
              return (
                <div key={agent.id} style={{ border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#111827' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Icon size={14} color={agent.color} />
                    <span style={{ color: '#e2e8f0', fontSize: '12px', fontWeight: 700 }}>{agent.label}</span>
                  </div>
                  <span style={{ color: '#86efac', fontSize: '11px', fontWeight: 700 }}>ONLINE</span>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ background: '#0b1220', border: '2px solid #1f2937', borderRadius: '12px', padding: '10px', minHeight: 0 }}>
          <div style={{ fontSize: '11px', color: '#f5d000', fontWeight: 900, marginBottom: '7px' }}>LIVE EVENTS</div>
          <div style={{ display: 'grid', gap: '6px', maxHeight: '94px', overflowY: 'auto', paddingRight: '2px' }}>
            {missionEvents.slice(0, 5).map((evt) => (
              <div key={evt.id} style={{ border: '1px solid #334155', borderRadius: '7px', background: '#111827', padding: '6px 8px' }}>
                <div style={{ fontSize: '10px', color: '#86efac', fontWeight: 700, marginBottom: '2px' }}>{evt.type.toUpperCase()}</div>
                <div style={{ fontSize: '11px', color: '#e2e8f0' }}>{evt.message}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: '#0b1220', border: '2px solid #1f2937', borderRadius: '12px', padding: '10px 12px', fontSize: '11px', color: '#f8fafc' }}>
          KRACKED_OS Mission Console: keep one active objective, ship in small verified increments.
        </div>
      </div>
    </div>
  );
}
