import React, { cloneElement, isValidElement, useEffect } from 'react';
import { FolderClock, Shield } from 'lucide-react';
import { KD_ACADEMY_TRACKS, KD_JOB_PROFILES, getQuestById, getTrackById } from '../../constants/kdAcademyCurriculum';
import { KD_ACADEMY_SPRITES } from '../../constants/kdAcademySprites';
import { useKdAcademyGameState } from '../../hooks/useKdAcademyGameState';
import KdPixelSprite from './kdacademy/KdPixelSprite';

const TABS = ['home', 'paths', 'workshop', 'profile'];
const TYPES = ['Beginner', 'Creative Builder', 'Freelancer', 'Student', 'Founder'];
const FOCUS = ['Landing Pages', 'AI Apps', 'Automation', 'Dashboards', 'APIs', 'Portfolio'];
const STYLES = ['guided', 'fast-track', 'experiment-first'];
const SWATCHES = {
  skin: ['#f6ddc5', '#e7c3a1', '#c99064', '#8d5a3b'],
  hair: ['#1f2937', '#5b3a29', '#7c3aed', '#0f766e'],
  outfit: ['#2563eb', '#16a34a', '#dc2626', '#f59e0b'],
  aura: ['#f5d000', '#38bdf8', '#a855f7', '#fb7185']
};

const bg = (() => {
  const { sky, far, mid, front } = KD_ACADEMY_SPRITES.backgrounds;
  return {
    backgroundColor: '#e8f0ff',
    backgroundImage: `url(${front}), url(${mid}), url(${far}), linear-gradient(180deg, rgba(249,251,255,0.98), rgba(229,239,255,0.96)), url(${sky})`,
    backgroundRepeat: 'repeat-x, repeat-x, repeat-x, no-repeat, repeat-x',
    backgroundPosition: 'bottom center, bottom center, bottom center, center, top center',
    backgroundSize: 'auto 140px, auto 180px, auto 220px, cover, cover'
  };
})();

const panel = (extra = {}) => ({
  background: 'rgba(255,255,255,0.93)',
  border: '1px solid rgba(15,23,42,0.12)',
  borderRadius: 18,
  boxShadow: '0 18px 40px rgba(15,23,42,0.08)',
  ...extra
});

const btn = (active, accent = '#0f172a', extra = {}) => ({
  border: active ? `1px solid ${accent}` : '1px solid rgba(15,23,42,0.14)',
  background: active ? accent : '#fff',
  color: active ? '#fff' : '#0f172a',
  borderRadius: 999,
  padding: '10px 14px',
  fontWeight: 800,
  cursor: 'pointer',
  ...extra
});

const cardBtn = (active, accent = '#0f172a', extra = {}) => ({
  width: '100%',
  border: active ? `2px solid ${accent}` : '1px solid rgba(15,23,42,0.12)',
  background: active ? `${accent}12` : '#fff',
  color: '#0f172a',
  borderRadius: 16,
  padding: 14,
  fontWeight: 700,
  textAlign: 'left',
  cursor: 'pointer',
  ...extra
});

function progress(track, completed) {
  const required = track.chapters.flatMap((c) => c.quests.filter((q) => q.required));
  const done = required.filter((q) => completed.includes(q.id)).length;
  return { done, total: required.length, percent: required.length ? Math.round((done / required.length) * 100) : 0 };
}

function Grid({ children, cols = 'repeat(2, minmax(0, 1fr))', style = {} }) {
  return <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 16, ...style }}>{children}</div>;
}

function Title({ title, kicker, right }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
      <div>
        <div style={{ fontSize: 12, fontWeight: 900, color: '#1d4ed8', letterSpacing: '0.16em', textTransform: 'uppercase' }}>{kicker}</div>
        <div style={{ marginTop: 6, fontSize: 30, fontWeight: 900, color: '#0f172a' }}>{title}</div>
      </div>
      {right}
    </div>
  );
}

function ScrollArea({ children }) {
  return <div style={{ minHeight: 0, overflowY: 'auto', display: 'grid', gap: 16 }}>{children}</div>;
}

function StatStrip({ items }) {
  return (
    <Grid cols="repeat(4, minmax(0, 1fr))">
      {items.map((item) => (
        <div key={item.label} style={panel({ padding: 16 })}>
          <div style={{ fontSize: 11, fontWeight: 900, color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{item.label}</div>
          <div style={{ marginTop: 8, fontSize: 26, fontWeight: 900, color: '#0f172a' }}>{item.value}</div>
        </div>
      ))}
    </Grid>
  );
}

function AvatarHero({ slot, userRank }) {
  const name = slot.playerProfile.displayName || 'Unnamed Adventurer';
  const job = KD_JOB_PROFILES[slot.assignedJobId];
  return (
    <div style={panel({ padding: 24, display: 'grid', gap: 16, justifyItems: 'center' })}>
      <div style={{ width: 150, height: 150, borderRadius: 32, display: 'grid', placeItems: 'center', background: `radial-gradient(circle at top, ${slot.playerProfile.aura}, #fff 58%)` }}>
        <KdPixelSprite spriteId={slot.playerProfile.spriteBaseId} size={96} label={name} />
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: '0.12em', color: '#64748b', textTransform: 'uppercase' }}>{userRank}</div>
        <div style={{ marginTop: 8, fontSize: 26, fontWeight: 900, color: '#0f172a' }}>{name}</div>
        <div style={{ marginTop: 8, color: '#475569', fontWeight: 700 }}>{job?.title || 'Unassigned Adventurer'}</div>
      </div>
    </div>
  );
}

export default function KrackedKdAcademy({ activeTab: externalTab, onTabChange, activeLesson, onOpenLesson, workshopPane, onOpenLiveSite, userRank, userVibes, completedLessonsCount, builderName }) {
  const { state, activeSlot, continueSlot, personalityTest, loadingPhase, loadingComplete, screen, onboardingStep, setScreen, startNewGame, continueGame, loadGame, resetToTitle, updateProfile, toggleFocusArea, setPersonalityAnswer, revealJob, finishOnboarding, advanceOnboarding, goBackOnboarding, chooseTrack, markQuestComplete, setCurrentQuest } = useKdAcademyGameState({ builderName, userVibes });

  useEffect(() => {
    if (!loadingComplete || !activeSlot?.onboardingCompleted) return;
    const next = externalTab === 'overview' ? 'home' : externalTab;
    if (TABS.includes(next)) setScreen(next);
  }, [activeSlot?.onboardingCompleted, externalTab, loadingComplete, setScreen]);

  useEffect(() => {
    if (activeSlot?.onboardingCompleted && onTabChange && TABS.includes(screen)) onTabChange(screen);
  }, [activeSlot?.onboardingCompleted, onTabChange, screen]);

  const track = activeSlot ? getTrackById(activeSlot.chosenTrackId) : getTrackById('builders_sprint');
  const questLookup = activeSlot?.currentQuestId ? getQuestById(activeSlot.currentQuestId) : null;
  const quest = questLookup?.quest;
  const job = activeSlot ? KD_JOB_PROFILES[activeSlot.assignedJobId] : null;
  const builders = activeSlot ? progress(getTrackById('builders_sprint'), activeSlot.completedQuestIds) : { done: 0, total: 0, percent: 0 };

  useEffect(() => {
    if (activeSlot?.onboardingCompleted && builders.total > 0 && builders.done === builders.total && screen !== 'ending') setScreen('ending');
  }, [activeSlot?.onboardingCompleted, builders.done, builders.total, screen, setScreen]);

  const openQuest = (nextQuest) => {
    setCurrentQuest(nextQuest.id);
    onOpenLesson(nextQuest.lessonId || activeLesson?.id);
    setScreen('workshop');
  };

  const workshop = isValidElement(workshopPane)
    ? cloneElement(workshopPane, {
        questTitle: quest?.title || '',
        questObjective: quest?.summary || '',
        questXpReward: quest?.xpReward || 0,
        jobTheme: job?.title || '',
        onMarkQuestComplete: quest ? () => markQuestComplete(quest.id) : undefined
      })
    : workshopPane;

  if (!loadingComplete) {
    return (
      <div style={{ height: '100%', display: 'grid', placeItems: 'center', padding: 28, ...bg }}>
        <div style={panel({ width: 'min(760px, 100%)', padding: 34, display: 'grid', gap: 16, textAlign: 'center' })}>
          <KdPixelSprite spriteId="fighter-local" size={104} label="KD Academy Hero" />
          <div style={{ fontSize: 14, fontWeight: 900, letterSpacing: '0.24em', color: '#0f172a', textTransform: 'uppercase' }}>KD Academy</div>
          <div style={{ fontSize: 34, fontWeight: 900, color: '#0f172a' }}>Entering the Vibecoding Realm</div>
          <div style={{ color: '#475569', lineHeight: 1.8 }}>{loadingPhase}</div>
        </div>
      </div>
    );
  }

  if (screen === 'title' || (!activeSlot && screen !== 'load')) {
    return (
      <div style={{ height: '100%', display: 'grid', placeItems: 'center', padding: 24, ...bg }}>
        <Grid cols="minmax(280px, 0.9fr) minmax(320px, 1.1fr)" style={{ width: 'min(980px, 100%)' }}>
          <div style={panel({ padding: 30, display: 'grid', gap: 18, alignContent: 'center' })}>
            <div style={{ display: 'flex', gap: 14 }}>
              <KdPixelSprite spriteId="fighter-local" size={88} label="Hero" />
              <KdPixelSprite spriteId="guildmaster-local" size={88} label="Guildmaster" />
            </div>
            <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: '0.18em', color: '#1d4ed8', textTransform: 'uppercase' }}>New Game+</div>
            <div style={{ fontSize: 40, lineHeight: 1, fontWeight: 900, color: '#0f172a' }}>KD Academy</div>
            <div style={{ fontSize: 18, lineHeight: 1.7, color: '#475569' }}>Create your avatar, discover your coder class, and clear the vibecoding campaign one quest at a time.</div>
            <div style={{ display: 'grid', gap: 12 }}>
              {continueSlot && <button type="button" onClick={continueGame} style={btn(true)}>Continue</button>}
              <button type="button" onClick={startNewGame} style={btn(true, '#2563eb', { background: '#2563eb' })}>Start New Game</button>
              <button type="button" onClick={() => setScreen('load')} style={btn(false)}>Load Game</button>
              <button type="button" onClick={onOpenLiveSite} style={btn(false)}>Open Live Academy</button>
            </div>
          </div>
          <div style={panel({ padding: 24, display: 'grid', gap: 14 })}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 900, color: '#64748b', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Save Slots</div>
                <div style={{ marginTop: 6, fontSize: 24, fontWeight: 900, color: '#0f172a' }}>Chronicle Archive</div>
              </div>
              <FolderClock size={18} color="#0f172a" />
            </div>
            {state.slots.map((slot, index) => (
              <div key={slot.id} style={panel({ padding: 16, display: 'grid', gap: 8, background: slot.updatedAt ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.72)' })}>
                <div style={{ fontSize: 11, fontWeight: 900, color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Slot {index + 1}</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: '#0f172a' }}>{slot.updatedAt ? slot.playerProfile.displayName || 'Unnamed Adventurer' : 'Empty Save'}</div>
                <div style={{ color: '#475569' }}>{slot.updatedAt ? `${KD_JOB_PROFILES[slot.assignedJobId]?.title || 'Unassigned'} • ${getTrackById(slot.chosenTrackId).title}` : 'Start a new game to create this chronicle.'}</div>
              </div>
            ))}
          </div>
        </Grid>
      </div>
    );
  }

  if (screen === 'load') {
    return (
      <div style={{ height: '100%', minHeight: 0, display: 'grid', gridTemplateRows: 'auto minmax(0, 1fr)', padding: 24, gap: 16, ...bg }}>
        <Title kicker="Load Game" title="Choose a Chronicle" right={<button type="button" onClick={resetToTitle} style={btn(false)}>Back</button>} />
        <ScrollArea>
          {state.slots.map((slot, index) => {
            const used = Boolean(slot.updatedAt);
            return (
              <div key={slot.id} style={panel({ padding: 18, display: 'grid', gap: 10, opacity: used ? 1 : 0.55 })}>
                <div style={{ fontSize: 11, fontWeight: 900, color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Slot {index + 1}</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: '#0f172a' }}>{used ? slot.playerProfile.displayName || 'Unnamed Adventurer' : 'Empty Save'}</div>
                <div style={{ color: '#475569' }}>{used ? `${KD_JOB_PROFILES[slot.assignedJobId]?.title || 'Unassigned'} • ${getTrackById(slot.chosenTrackId).title} • Lv ${slot.level}` : 'No data stored in this slot.'}</div>
                <div><button type="button" disabled={!used} onClick={() => loadGame(slot.id)} style={btn(used, '#0f172a', { opacity: used ? 1 : 0.5, cursor: used ? 'pointer' : 'not-allowed' })}>Load Slot</button></div>
              </div>
            );
          })}
        </ScrollArea>
      </div>
    );
  }

  if (screen === 'onboarding' && activeSlot) {
    const p = activeSlot.playerProfile;
    const answered = Object.keys(activeSlot.personalityAnswers || {}).length;
    const canAdvance = p.displayName?.trim() && p.focusAreas.length > 0;
    return (
      <div style={{ height: '100%', minHeight: 0, display: 'grid', gridTemplateRows: 'auto minmax(0, 1fr)', padding: 24, gap: 16, ...bg }}>
        <Title kicker="New Game" title="Forge Your Chronicle" right={<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{['Avatar', 'Test', 'Job', 'Track', 'Prologue'].map((label, index) => <div key={label} style={{ borderRadius: 999, padding: '8px 12px', fontSize: 12, fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase', color: index <= onboardingStep ? '#fff' : '#475569', background: index <= onboardingStep ? '#0f172a' : 'rgba(255,255,255,0.84)', border: '1px solid rgba(15,23,42,0.12)' }}>{label}</div>)}</div>} />
        <ScrollArea>
          {onboardingStep === 0 && (
            <Grid cols="minmax(280px, 0.9fr) minmax(320px, 1.1fr)">
              <div style={panel({ padding: 22, display: 'grid', gap: 16 })}>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#0f172a' }}>Create Your Pixel Hero</div>
                <div style={{ width: 180, height: 180, margin: '0 auto', borderRadius: 32, background: `radial-gradient(circle at top, ${p.aura}, #fff 58%)`, display: 'grid', placeItems: 'center' }}>
                  <KdPixelSprite spriteId={p.spriteBaseId} size={112} label={p.displayName || builderName || 'New Adventurer'} />
                </div>
                <Grid cols="repeat(3, minmax(0, 1fr))">
                  {KD_ACADEMY_SPRITES.playerBases.map((sprite) => (
                    <button key={sprite.id} type="button" onClick={() => updateProfile({ spriteBaseId: sprite.id })} style={cardBtn(p.spriteBaseId === sprite.id, '#2563eb', { display: 'grid', gap: 8, justifyItems: 'center' })}>
                      <KdPixelSprite spriteId={sprite.id} size={56} label={sprite.title} />
                      <div style={{ fontSize: 12, fontWeight: 800 }}>{sprite.title}</div>
                    </button>
                  ))}
                </Grid>
                {Object.entries(SWATCHES).map(([key, values]) => (
                  <div key={key}><div style={{ marginBottom: 8, fontSize: 11, fontWeight: 900, color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{key}</div><div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{values.map((value) => <button key={value} type="button" onClick={() => updateProfile({ [key]: value })} style={{ width: 28, height: 28, borderRadius: 999, background: value, border: p[key] === value ? '3px solid #0f172a' : '1px solid rgba(15,23,42,0.18)', cursor: 'pointer' }} />)}</div></div>
                ))}
              </div>
              <div style={panel({ padding: 22, display: 'grid', gap: 16 })}>
                <label style={{ display: 'grid', gap: 8 }}><span style={{ fontSize: 12, fontWeight: 800, color: '#475569' }}>Display Name</span><input value={p.displayName} onChange={(e) => updateProfile({ displayName: e.target.value })} placeholder="Enter your builder name" style={{ border: '1px solid rgba(15,23,42,0.14)', borderRadius: 14, padding: '12px 14px', fontWeight: 700, color: '#0f172a', background: '#fff' }} /></label>
                <Grid>{TYPES.map((type) => <button key={type} type="button" onClick={() => updateProfile({ learnerType: type })} style={cardBtn(p.learnerType === type, '#2563eb')}>{type}</button>)}</Grid>
                <Grid cols="repeat(3, minmax(0, 1fr))">{FOCUS.map((item) => <button key={item} type="button" onClick={() => toggleFocusArea(item)} style={cardBtn(p.focusAreas.includes(item), '#16a34a')}>{item}</button>)}</Grid>
                <Grid cols="repeat(3, minmax(0, 1fr))">{STYLES.map((item) => <button key={item} type="button" onClick={() => updateProfile({ learningStyle: item })} style={cardBtn(p.learningStyle === item, '#7c3aed')}>{item}</button>)}</Grid>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}><button type="button" disabled style={btn(false, '#0f172a', { opacity: 0.5, cursor: 'not-allowed' })}>Back</button><button type="button" disabled={!canAdvance} onClick={advanceOnboarding} style={btn(true, '#2563eb', { background: '#2563eb', opacity: canAdvance ? 1 : 0.5, cursor: canAdvance ? 'pointer' : 'not-allowed' })}>Continue</button></div>
              </div>
            </Grid>
          )}
          {onboardingStep === 1 && (
            <div style={panel({ padding: 22, display: 'grid', gap: 16 })}>
              {personalityTest.map((q, index) => (
                <div key={q.id} style={panel({ padding: 16, background: '#fff' })}>
                  <div style={{ fontSize: 12, fontWeight: 900, color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Question {index + 1}</div>
                  <div style={{ marginTop: 8, fontSize: 20, fontWeight: 900, color: '#0f172a' }}>{q.prompt}</div>
                  <Grid style={{ marginTop: 12 }}>{q.options.map((opt) => <button key={opt.id} type="button" onClick={() => setPersonalityAnswer(q.id, opt.id)} style={cardBtn(activeSlot.personalityAnswers?.[q.id] === opt.id)}>{opt.label}</button>)}</Grid>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}><button type="button" onClick={goBackOnboarding} style={btn(false)}>Back</button><button type="button" disabled={answered !== personalityTest.length} onClick={() => { revealJob(); advanceOnboarding(); }} style={btn(true, '#7c3aed', { background: '#7c3aed', opacity: answered === personalityTest.length ? 1 : 0.5, cursor: answered === personalityTest.length ? 'pointer' : 'not-allowed' })}>Reveal Job</button></div>
            </div>
          )}
          {onboardingStep === 2 && (
            <Grid cols="minmax(280px, 0.9fr) minmax(320px, 1.1fr)">
              <div style={panel({ padding: 24, display: 'grid', gap: 16, justifyItems: 'center' })}>
                <KdPixelSprite spriteId={p.spriteBaseId} size={120} label={p.displayName} />
                <div style={{ borderRadius: 999, padding: '8px 14px', background: job?.accent || '#0f172a', color: '#fff', fontSize: 12, fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Job Revealed</div>
                <div style={{ fontSize: 34, fontWeight: 900, color: '#0f172a' }}>{job?.title}</div>
                <div style={{ color: '#475569', lineHeight: 1.7, textAlign: 'center' }}>{job?.description}</div>
              </div>
              <div style={panel({ padding: 24, display: 'grid', gap: 16 })}>
                <div style={{ fontSize: 28, fontWeight: 900, color: '#0f172a' }}>{getTrackById(activeSlot.recommendedTrackId).title}</div>
                <div style={{ color: '#475569', lineHeight: 1.7 }}>{getTrackById(activeSlot.recommendedTrackId).summary}</div>
                {quest && <div style={panel({ padding: 16, background: '#fff' })}><div style={{ fontSize: 11, fontWeight: 900, color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Starter Quest</div><div style={{ marginTop: 8, fontSize: 20, fontWeight: 900, color: '#0f172a' }}>{quest.title}</div><div style={{ marginTop: 8, color: '#475569', lineHeight: 1.7 }}>{quest.summary}</div></div>}
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}><button type="button" onClick={goBackOnboarding} style={btn(false)}>Back</button><button type="button" onClick={advanceOnboarding} style={btn(true, job?.accent || '#0f172a', { background: job?.accent || '#0f172a' })}>Continue</button></div>
              </div>
            </Grid>
          )}
          {onboardingStep === 3 && (
            <div style={panel({ padding: 24, display: 'grid', gap: 16 })}>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#0f172a' }}>Choose Your Opening Campaign</div>
              <Grid>{KD_ACADEMY_TRACKS.map((item) => <button key={item.id} type="button" onClick={() => chooseTrack(item.id)} style={cardBtn(activeSlot.chosenTrackId === item.id, item.id === activeSlot.recommendedTrackId ? '#2563eb' : '#0f172a')}><div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}><span style={{ fontSize: 20, fontWeight: 900 }}>{item.title}</span>{item.id === activeSlot.recommendedTrackId && <span style={{ fontSize: 11, fontWeight: 900, color: '#1d4ed8', textTransform: 'uppercase' }}>Recommended</span>}</div><div style={{ marginTop: 8, color: '#475569', lineHeight: 1.7 }}>{item.summary}</div></button>)}</Grid>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}><button type="button" onClick={goBackOnboarding} style={btn(false)}>Back</button><button type="button" onClick={advanceOnboarding} style={btn(true)}>Read Prologue</button></div>
            </div>
          )}
          {onboardingStep === 4 && (
            <Grid cols="minmax(280px, 0.9fr) minmax(320px, 1.1fr)">
              <div style={panel({ padding: 24, display: 'grid', gap: 16, justifyItems: 'center' })}>
                <KdPixelSprite spriteId="guildmaster-local" size={116} label="Guildmaster" />
                <div style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', textAlign: 'center' }}>The Guild Calls You Forward</div>
              </div>
              <div style={panel({ padding: 24, display: 'grid', gap: 14 })}>
                <div style={{ color: '#334155', lineHeight: 1.8 }}>Unfinished ideas are decaying into dead projects across the realm. KD Academy trains builders who can turn intent into shipped software.</div>
                <div style={{ color: '#334155', lineHeight: 1.8 }}>Your first campaign is <strong style={{ color: '#0f172a' }}>{getTrackById(activeSlot.chosenTrackId).title}</strong>. The Workshop is your forge.</div>
                <div style={{ color: '#334155', lineHeight: 1.8 }}>Finish the required curriculum and you finish the game.</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}><button type="button" onClick={goBackOnboarding} style={btn(false)}>Back</button><button type="button" onClick={finishOnboarding} style={btn(true)}>Enter KD Academy</button></div>
              </div>
            </Grid>
          )}
        </ScrollArea>
      </div>
    );
  }

  if (screen === 'ending' && activeSlot) {
    return (
      <div style={{ height: '100%', display: 'grid', placeItems: 'center', padding: 24, ...bg }}>
        <div style={panel({ width: 'min(760px, 100%)', padding: 32, display: 'grid', gap: 18, textAlign: 'center' })}>
          <KdPixelSprite spriteId={activeSlot.playerProfile.spriteBaseId} size={120} label="Champion" />
          <div style={{ fontSize: 12, fontWeight: 900, color: '#64748b', letterSpacing: '0.16em', textTransform: 'uppercase' }}>Builders Sprint Complete</div>
          <div style={{ fontSize: 36, fontWeight: 900, color: '#0f172a' }}>The Chronicle Is Cleared</div>
          <div style={{ color: '#475569', lineHeight: 1.8 }}>You completed the required Builders Sprint campaign. Founder Lab, Junior Track, and Secondary Track remain available as expansion paths.</div>
          <div><button type="button" onClick={resetToTitle} style={btn(true)}>Return to Title</button></div>
        </div>
      </div>
    );
  }

  if (!activeSlot) return null;

  return (
    <div style={{ height: '100%', minHeight: 0, display: 'grid', gridTemplateRows: 'auto auto minmax(0, 1fr)', ...bg }}>
      <div style={{ padding: '20px 24px 14px', display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 900, color: '#1d4ed8', letterSpacing: '0.16em', textTransform: 'uppercase' }}>KD Academy</div>
          <div style={{ marginTop: 6, fontSize: 30, fontWeight: 900, color: '#0f172a' }}>The Guild of Vibecoders</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div style={panel({ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.88)' })}>
            <KdPixelSprite spriteId={activeSlot.playerProfile.spriteBaseId} size={40} label={activeSlot.playerProfile.displayName} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 900, color: '#0f172a' }}>{activeSlot.playerProfile.displayName || 'Unnamed Adventurer'}</div>
              <div style={{ fontSize: 11, color: '#64748b', fontWeight: 800 }}>{job?.title || 'Unassigned'} • Lv {activeSlot.level}</div>
            </div>
          </div>
          <button type="button" onClick={resetToTitle} style={btn(false)}>Title Screen</button>
        </div>
      </div>

      <div style={{ padding: '0 24px 16px', display: 'grid', gap: 12 }}>
        <div style={panel({ padding: 16, display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'center' })}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 900, color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Active Quest</div>
            <div style={{ marginTop: 6, fontSize: 20, fontWeight: 900, color: '#0f172a' }}>{quest?.title || 'Choose a quest'}</div>
            <div style={{ marginTop: 4, color: '#475569' }}>{track.title} • {builders.percent}% complete</div>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>{TABS.map((tab) => <button key={tab} type="button" onClick={() => setScreen(tab)} style={btn(screen === tab, '#0f172a', { background: screen === tab ? '#0f172a' : '#fff' })}>{tab[0].toUpperCase() + tab.slice(1)}</button>)}</div>
        </div>
      </div>

      {screen === 'home' && (
        <div style={{ minHeight: 0, overflowY: 'auto', padding: '0 24px 24px', display: 'grid', gap: 16 }}>
          <Grid cols="minmax(280px, 0.85fr) minmax(320px, 1.15fr)">
            <AvatarHero slot={activeSlot} userRank={userRank} />
            <div style={panel({ padding: 24, display: 'grid', gap: 14 })}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div><div style={{ fontSize: 12, fontWeight: 900, color: '#64748b', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Current Campaign</div><div style={{ marginTop: 6, fontSize: 30, fontWeight: 900, color: '#0f172a' }}>{track.title}</div></div><Shield size={18} color={job?.accent || '#0f172a'} /></div>
              <div style={{ color: '#475569', lineHeight: 1.8 }}>{track.summary}</div>
              <div style={panel({ padding: 14, background: '#fff' })}><div style={{ fontSize: 11, fontWeight: 900, color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Current Quest</div><div style={{ marginTop: 8, fontSize: 22, fontWeight: 900, color: '#0f172a' }}>{quest?.title || 'No active quest'}</div><div style={{ marginTop: 8, color: '#475569', lineHeight: 1.7 }}>{quest?.summary || 'Choose a track and start a quest.'}</div></div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>{quest && <button type="button" onClick={() => openQuest(quest)} style={btn(true)}>Continue Quest</button>}<button type="button" onClick={() => setScreen('paths')} style={btn(false)}>Browse Tracks</button><button type="button" onClick={() => setScreen('profile')} style={btn(false)}>View Profile</button></div>
              <div style={{ display: 'grid', gap: 8 }}><div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 900, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em' }}><span>Builders Sprint Progress</span><span>{builders.percent}%</span></div><div style={{ height: 12, borderRadius: 999, background: '#dbeafe', overflow: 'hidden' }}><div style={{ height: '100%', width: `${builders.percent}%`, background: 'linear-gradient(90deg, #2563eb, #0f172a)' }} /></div></div>
            </div>
          </Grid>
          <StatStrip items={[{ label: 'Level', value: `Lv ${activeSlot.level}` }, { label: 'XP', value: activeSlot.xp + userVibes }, { label: 'Quest Clears', value: activeSlot.completedQuestIds.length + completedLessonsCount }, { label: 'Job', value: job?.title || 'Unknown' }]} />
        </div>
      )}

      {screen === 'paths' && (
        <div style={{ minHeight: 0, overflowY: 'auto', padding: '0 24px 24px', display: 'grid', gap: 16 }}>
          {KD_ACADEMY_TRACKS.map((item) => {
            const meta = progress(item, activeSlot.completedQuestIds);
            return (
              <section key={item.id} style={panel({ padding: 22, display: 'grid', gap: 14 })}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                  <div><div style={{ fontSize: 12, fontWeight: 900, color: '#64748b', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{item.completionMode}</div><div style={{ marginTop: 8, fontSize: 28, fontWeight: 900, color: '#0f172a' }}>{item.title}</div><div style={{ marginTop: 8, color: '#475569', lineHeight: 1.7 }}>{item.summary}</div></div>
                  <button type="button" onClick={() => chooseTrack(item.id)} style={btn(activeSlot.chosenTrackId === item.id, '#0f172a', { background: activeSlot.chosenTrackId === item.id ? '#0f172a' : '#fff' })}>{activeSlot.chosenTrackId === item.id ? 'Selected' : 'Choose Track'}</button>
                </div>
                <div style={{ display: 'grid', gap: 8 }}><div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 900, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em' }}><span>Required Progress</span><span>{meta.done}/{meta.total}</span></div><div style={{ height: 10, borderRadius: 999, background: '#e2e8f0', overflow: 'hidden' }}><div style={{ height: '100%', width: `${meta.percent}%`, background: 'linear-gradient(90deg, #22c55e, #2563eb)' }} /></div></div>
                {item.chapters.map((chapter) => <Grid key={chapter.id}>{chapter.quests.map((q) => <div key={q.id} style={panel({ padding: 16, display: 'grid', gap: 12, background: '#fff' })}><div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}><div><div style={{ fontSize: 11, fontWeight: 900, color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{item.title} • {chapter.title}</div><div style={{ marginTop: 8, fontSize: 20, fontWeight: 900, color: '#0f172a' }}>{q.title}</div></div><div style={{ borderRadius: 999, padding: '7px 10px', fontSize: 11, fontWeight: 900, background: activeSlot.completedQuestIds.includes(q.id) ? '#dcfce7' : '#eff6ff', color: activeSlot.completedQuestIds.includes(q.id) ? '#166534' : '#1d4ed8' }}>{activeSlot.completedQuestIds.includes(q.id) ? 'Cleared' : `${q.xpReward} XP`}</div></div><div style={{ color: '#475569', lineHeight: 1.7 }}>{q.summary}</div><div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}><button type="button" onClick={() => openQuest(q)} style={btn(true)}>Open Quest</button><button type="button" onClick={() => markQuestComplete(q.id)} style={btn(false)}>Mark Complete</button></div></div>)}</Grid>)}</section>
            );
          })}
        </div>
      )}

      {screen === 'workshop' && (
        <div style={{ minHeight: 0, padding: '0 24px 24px', overflow: 'hidden', display: 'grid', gridTemplateRows: 'auto minmax(0, 1fr)', gap: 12 }}>
          <div style={panel({ padding: 18, display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'center' })}>
            <div><div style={{ fontSize: 11, fontWeight: 900, color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Workshop Quest</div><div style={{ marginTop: 8, fontSize: 24, fontWeight: 900, color: '#0f172a' }}>{quest?.title || 'No quest selected'}</div><div style={{ marginTop: 6, color: '#475569', lineHeight: 1.7 }}>{quest?.summary || 'Select a quest from Tracks.'}</div></div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>{quest && <button type="button" onClick={() => markQuestComplete(quest.id)} style={btn(false)}>Mark Quest Complete</button>}<div style={panel({ padding: '10px 12px', background: '#fff' })}><div style={{ fontSize: 11, fontWeight: 900, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Reward</div><div style={{ marginTop: 4, fontWeight: 900, color: '#0f172a' }}>{quest?.xpReward || 0} XP</div></div></div>
          </div>
          <div style={{ minHeight: 0, overflow: 'hidden', borderRadius: 18 }}>{workshop}</div>
        </div>
      )}

      {screen === 'profile' && (
        <div style={{ minHeight: 0, overflowY: 'auto', padding: '0 24px 24px', display: 'grid', gap: 16 }}>
          <Grid cols="minmax(280px, 0.85fr) minmax(320px, 1.15fr)">
            <AvatarHero slot={activeSlot} userRank={userRank} />
            <div style={{ display: 'grid', gap: 16 }}>
              <div style={panel({ padding: 22, display: 'grid', gap: 12 })}>
                <div style={{ fontSize: 12, fontWeight: 900, color: '#64748b', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Builder Profile</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: '#0f172a' }}>{activeSlot.playerProfile.displayName || 'Unnamed Adventurer'}</div>
                <div style={{ color: '#475569', lineHeight: 1.8 }}>{activeSlot.playerProfile.learnerType} • {activeSlot.playerProfile.learningStyle} • {activeSlot.playerProfile.focusAreas.join(' • ') || 'No focus selected'}</div>
                <div style={{ color: '#475569', lineHeight: 1.8 }}>Assigned Job: <strong style={{ color: '#0f172a' }}>{job?.title || 'Unknown'}</strong></div>
                <div style={{ color: '#475569', lineHeight: 1.8 }}>Active Track: <strong style={{ color: '#0f172a' }}>{track.title}</strong></div>
              </div>
              <StatStrip items={[{ label: 'Level', value: `Lv ${activeSlot.level}` }, { label: 'Total XP', value: activeSlot.xp + userVibes }, { label: 'Quests', value: activeSlot.completedQuestIds.length + completedLessonsCount }, { label: 'Save Slot', value: activeSlot.id.replace('slot-', '#') }]} />
              <div style={panel({ padding: 18, display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'center' })}><div style={{ color: '#475569', lineHeight: 1.7 }}>Last saved: {activeSlot.updatedAt ? new Date(activeSlot.updatedAt).toLocaleString() : 'Not saved yet'}</div><button type="button" onClick={resetToTitle} style={btn(false)}>Return to Title Screen</button></div>
            </div>
          </Grid>
        </div>
      )}
    </div>
  );
}
