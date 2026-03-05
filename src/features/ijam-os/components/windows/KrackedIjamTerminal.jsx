import React, { useMemo } from 'react';
import KrackedIJAMChat from './KrackedIJAMChat';

function buildTerminalContextPrompt(terminalLog) {
  const excerpt = terminalLog
    .slice(-6)
    .map((entry) => `${entry.role.toUpperCase()}: ${entry.text}`)
    .join('\n');

  return `Jelaskan output terminal ini dan cadangkan next step yang paling sesuai:\n\n${excerpt}`;
}

export default function KrackedIjamTerminal({
  terminalLog,
  terminalBusy,
  terminalInput,
  setTerminalInput,
  executeTerminalCommand,
  terminalOutputRef,
  userRank,
  userVibes,
  chatPrefill,
  onChatPrefill,
  onChatPrefillConsumed,
  questTitle = '',
  questObjective = '',
  questXpReward = 0,
  jobTheme = '',
  onMarkQuestComplete
}) {
  const lastAssistantEntry = useMemo(
    () => [...terminalLog].reverse().find((entry) => entry.role === 'assistant' || entry.role === 'system'),
    [terminalLog]
  );

  return (
    <div
      style={{
        height: '100%',
        display: 'grid',
        gridTemplateColumns: 'minmax(320px, 1.15fr) minmax(320px, 0.95fr)',
        gap: '16px',
        padding: '16px',
        background: '#eef4fb'
      }}
    >
      <section
        style={{
          minHeight: 0,
          display: 'grid',
          gridTemplateRows: questTitle ? 'auto auto minmax(0, 1fr) auto' : 'auto minmax(0, 1fr) auto',
          gap: '12px'
        }}
      >
        {questTitle && (
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #dbe4ef',
              borderRadius: '12px',
              padding: '14px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '12px',
              flexWrap: 'wrap'
            }}
          >
            <div>
              <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.08em', color: '#64748b', textTransform: 'uppercase' }}>
                {jobTheme || 'Academy Quest'}
              </div>
              <div style={{ marginTop: '6px', fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>{questTitle}</div>
              {questObjective && <div style={{ marginTop: '6px', color: '#475569', lineHeight: 1.6, fontSize: '13px' }}>{questObjective}</div>}
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ padding: '8px 10px', borderRadius: '999px', background: '#eff6ff', color: '#1d4ed8', fontSize: '12px', fontWeight: 800 }}>
                {questXpReward} XP
              </div>
              {onMarkQuestComplete && (
                <button
                  type="button"
                  onClick={onMarkQuestComplete}
                  style={{
                    padding: '9px 12px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#0f172a',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Complete Quest
                </button>
              )}
            </div>
          </div>
        )}

        <div
          style={{
            background: '#ffffff',
            border: '1px solid #dbe4ef',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}
        >
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', color: '#64748b', textTransform: 'uppercase' }}>
              Terminal Workspace
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
              Live command stream
            </div>
          </div>
          <button
            type="button"
            onClick={() => onChatPrefill(buildTerminalContextPrompt(terminalLog))}
            style={{
              padding: '10px 14px',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#0f172a',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Ask IJAM About Latest Output
          </button>
        </div>

        <div
          style={{
            minHeight: 0,
            background: '#ffffff',
            border: '1px solid #dbe4ef',
            borderRadius: '12px',
            overflow: 'hidden',
            display: 'grid',
            gridTemplateRows: 'auto minmax(0, 1fr)'
          }}
        >
          <div
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '10px',
              background: '#f8fafc'
            }}
          >
            <div style={{ color: '#334155', fontSize: '13px', fontWeight: 700 }}>
              {`${userRank} | ${userVibes}`} synced with terminal session
            </div>
            {lastAssistantEntry && (
              <button
                type="button"
                onClick={() => onChatPrefill(`Terangkan mesej terminal ini dengan ringkas:\n\n${lastAssistantEntry.text}`)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#0f172a',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Explain Last Line
              </button>
            )}
          </div>

          <div
            ref={terminalOutputRef}
            style={{
              padding: '16px',
              overflowY: 'auto',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
              fontSize: '12px',
              lineHeight: 1.6,
              background: '#f8fafc'
            }}
          >
            {terminalLog.map((entry, idx) => (
              <div key={`${entry.role}-${idx}`} style={{ marginBottom: '10px', whiteSpace: 'pre-wrap' }}>
                {entry.role !== 'system' && (
                  <span style={{ color: entry.role === 'assistant' ? '#0f766e' : '#166534', fontWeight: 800 }}>
                    {entry.role === 'assistant' ? 'KRACKED_BOT>' : `[${userRank} | ${userVibes}] YOU>`}
                  </span>
                )}
                {entry.role !== 'system' && ' '}
                <span style={{ color: entry.role === 'system' ? '#475569' : '#0f172a', fontStyle: entry.role === 'system' ? 'italic' : 'normal' }}>
                  {entry.text}
                </span>
              </div>
            ))}
            {terminalBusy && (
              <div>
                <span style={{ color: '#0f766e', fontWeight: 800 }}>KRACKED_BOT&gt;</span> processing...
              </div>
            )}
          </div>
        </div>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const command = terminalInput;
            setTerminalInput('');
            await executeTerminalCommand(command);
          }}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: '10px',
            padding: '14px',
            background: '#ffffff',
            border: '1px solid #dbe4ef',
            borderRadius: '12px'
          }}
        >
          <input
            value={terminalInput}
            onChange={(e) => setTerminalInput(e.target.value)}
            placeholder="Type a command or request..."
            style={{
              border: '1px solid #cbd5e1',
              borderRadius: '10px',
              background: '#ffffff',
              color: '#0f172a',
              padding: '12px 14px',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
              fontWeight: 700,
              minWidth: 0,
              width: '100%'
            }}
          />
          <button
            type="submit"
            disabled={terminalBusy}
            style={{
              padding: '12px 18px',
              borderRadius: '10px',
              border: 'none',
              background: '#16a34a',
              color: '#ffffff',
              fontWeight: 800,
              cursor: terminalBusy ? 'not-allowed' : 'pointer',
              opacity: terminalBusy ? 0.5 : 1
            }}
          >
            Run
          </button>
        </form>
      </section>

      <section style={{ minHeight: 0 }}>
        <KrackedIJAMChat
          compact
          prefillMessage={chatPrefill}
          onPrefillConsumed={onChatPrefillConsumed}
        />
      </section>
    </div>
  );
}
