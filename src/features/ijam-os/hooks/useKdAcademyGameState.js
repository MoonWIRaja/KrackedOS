import { useEffect, useMemo, useState } from 'react';
import { KD_JOB_PROFILES, getFirstQuestForTrack, getQuestById } from '../constants/kdAcademyCurriculum';

const STORAGE_KEY = 'kdacademy_game_state_v2';
const SLOT_COUNT = 3;

const PERSONALITY_TEST = [
  {
    id: 'q1',
    prompt: 'Which task pulls you in first?',
    options: [
      { id: 'a', label: 'Make the interface beautiful', weights: { spellcrafter: 2, promptblade: 1 } },
      { id: 'b', label: 'Figure out the app logic', weights: { runesmith: 2, flowkeeper: 1 } },
      { id: 'c', label: 'Write the perfect prompt', weights: { promptblade: 2, spellcrafter: 1 } },
      { id: 'd', label: 'Get it live quickly', weights: { launchwarden: 2, flowkeeper: 1 } }
    ]
  },
  {
    id: 'q2',
    prompt: 'When you hit a blocker, what do you do?',
    options: [
      { id: 'a', label: 'Experiment and iterate visually', weights: { spellcrafter: 2 } },
      { id: 'b', label: 'Trace the system and debug carefully', weights: { runesmith: 2, flowkeeper: 1 } },
      { id: 'c', label: 'Ask AI to map the next move', weights: { promptblade: 2 } },
      { id: 'd', label: 'Find the fastest path to shipping', weights: { launchwarden: 2 } }
    ]
  },
  {
    id: 'q3',
    prompt: 'What feels most satisfying?',
    options: [
      { id: 'a', label: 'A polished user experience', weights: { spellcrafter: 2 } },
      { id: 'b', label: 'A clean backend/data flow', weights: { runesmith: 2 } },
      { id: 'c', label: 'A crystal-clear plan', weights: { promptblade: 2, flowkeeper: 1 } },
      { id: 'd', label: 'A product people can actually use today', weights: { launchwarden: 2 } }
    ]
  },
  {
    id: 'q4',
    prompt: 'How do you prefer to learn?',
    options: [
      { id: 'a', label: 'By seeing examples and remixing them', weights: { spellcrafter: 1, promptblade: 1 } },
      { id: 'b', label: 'By understanding systems deeply', weights: { runesmith: 2 } },
      { id: 'c', label: 'By getting guided steps from AI', weights: { promptblade: 2 } },
      { id: 'd', label: 'By building end to end immediately', weights: { flowkeeper: 2, launchwarden: 1 } }
    ]
  },
  {
    id: 'q5',
    prompt: 'What kind of project would you start first?',
    options: [
      { id: 'a', label: 'Landing page or portfolio', weights: { spellcrafter: 2 } },
      { id: 'b', label: 'API or automation tool', weights: { runesmith: 2 } },
      { id: 'c', label: 'AI copilot or prompt workflow', weights: { promptblade: 2 } },
      { id: 'd', label: 'Launchable micro-startup', weights: { launchwarden: 2, flowkeeper: 1 } }
    ]
  },
  {
    id: 'q6',
    prompt: 'What role do you naturally take?',
    options: [
      { id: 'a', label: 'Designer of the experience', weights: { spellcrafter: 2 } },
      { id: 'b', label: 'Engineer of the engine', weights: { runesmith: 2 } },
      { id: 'c', label: 'Strategist of the workflow', weights: { promptblade: 2 } },
      { id: 'd', label: 'Connector of everything', weights: { flowkeeper: 2 } }
    ]
  },
  {
    id: 'q7',
    prompt: 'Which challenge excites you most?',
    options: [
      { id: 'a', label: 'Making it feel magical', weights: { spellcrafter: 2 } },
      { id: 'b', label: 'Making it reliable', weights: { runesmith: 2 } },
      { id: 'c', label: 'Making it understandable', weights: { promptblade: 2 } },
      { id: 'd', label: 'Making it launch-ready', weights: { launchwarden: 2 } }
    ]
  },
  {
    id: 'q8',
    prompt: 'What kind of coder are you becoming?',
    options: [
      { id: 'a', label: 'A visual world-builder', weights: { spellcrafter: 2 } },
      { id: 'b', label: 'A system architect', weights: { runesmith: 2 } },
      { id: 'c', label: 'An AI tactician', weights: { promptblade: 2 } },
      { id: 'd', label: 'A campaign finisher', weights: { launchwarden: 2, flowkeeper: 1 } }
    ]
  }
];

const DEFAULT_AVATAR = {
  displayName: '',
  learnerType: 'Beginner',
  focusAreas: [],
  learningStyle: 'guided',
  skin: '#f2d3b1',
  hair: '#1f2937',
  outfit: '#2563eb',
  accessory: 'none',
  aura: '#f5d000',
  spriteBaseId: 'fighter-local'
};

function createEmptySlot(index) {
  return {
    id: `slot-${index + 1}`,
    createdAt: '',
    updatedAt: '',
    onboardingCompleted: false,
    playerProfile: { ...DEFAULT_AVATAR },
    personalityAnswers: {},
    assignedJobId: '',
    recommendedTrackId: 'builders_sprint',
    chosenTrackId: 'builders_sprint',
    currentQuestId: '',
    completedQuestIds: [],
    xp: 0,
    level: 1
  };
}

function ensureStateShape(rawState) {
  const slots = Array.from({ length: SLOT_COUNT }, (_, index) => ({ ...createEmptySlot(index), ...(rawState?.slots?.[index] || {}) }));
  return {
    loadingComplete: false,
    loadingPhase: 'Loading Realm',
    screen: rawState?.screen || 'title',
    activeSlotId: rawState?.activeSlotId || '',
    onboardingStep: rawState?.onboardingStep || 0,
    slots
  };
}

function pickJob(answers) {
  const scores = Object.keys(KD_JOB_PROFILES).reduce((acc, key) => ({ ...acc, [key]: 0 }), {});
  PERSONALITY_TEST.forEach((question) => {
    const optionId = answers[question.id];
    const option = question.options.find((item) => item.id === optionId);
    if (!option) return;
    Object.entries(option.weights).forEach(([jobId, value]) => {
      scores[jobId] += value;
    });
  });
  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] || 'promptblade';
}

export function useKdAcademyGameState({ builderName = '', userVibes = 0 }) {
  const [state, setState] = useState(() => {
    if (typeof window === 'undefined') return ensureStateShape();
    try {
      return ensureStateShape(JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}'));
    } catch {
      return ensureStateShape();
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    const phases = ['Loading Realm', 'Reading Save Data', 'Preparing Workshop'];
    let cancelled = false;
    let step = 0;
    const tick = () => {
      if (cancelled) return;
      setState((prev) => ({ ...prev, loadingPhase: phases[step] || phases[phases.length - 1] }));
      if (step < phases.length - 1) {
        step += 1;
        setTimeout(tick, 280);
      } else {
        setTimeout(() => {
          if (!cancelled) {
            setState((prev) => ({ ...prev, loadingComplete: true }));
          }
        }, 240);
      }
    };
    tick();
    return () => {
      cancelled = true;
    };
  }, []);

  const activeSlot = useMemo(
    () => state.slots.find((slot) => slot.id === state.activeSlotId) || null,
    [state.activeSlotId, state.slots]
  );

  const continueSlot = useMemo(() => {
    const used = state.slots.filter((slot) => slot.updatedAt);
    return used.sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0))[0] || null;
  }, [state.slots]);

  const setScreen = (screen) => setState((prev) => ({ ...prev, screen }));

  const patchActiveSlot = (mutator) => {
    setState((prev) => ({
      ...prev,
      slots: prev.slots.map((slot) => {
        if (slot.id !== prev.activeSlotId) return slot;
        const next = mutator(slot);
        return {
          ...next,
          updatedAt: new Date().toISOString()
        };
      })
    }));
  };

  const startNewGame = () => {
    setState((prev) => {
      const slot = prev.slots.find((item) => !item.updatedAt) || prev.slots[0];
      const now = new Date().toISOString();
      const nextSlot = {
        ...createEmptySlot(prev.slots.indexOf(slot)),
        id: slot.id,
        createdAt: now,
        updatedAt: now,
        playerProfile: { ...DEFAULT_AVATAR, displayName: builderName || '' }
      };
      return {
        ...prev,
        activeSlotId: slot.id,
        onboardingStep: 0,
        screen: 'onboarding',
        slots: prev.slots.map((item) => (item.id === slot.id ? nextSlot : item))
      };
    });
  };

  const loadGame = (slotId) => {
    setState((prev) => ({
      ...prev,
      activeSlotId: slotId,
      screen: 'home'
    }));
  };

  const continueGame = () => {
    if (!continueSlot) return;
    loadGame(continueSlot.id);
  };

  const resetToTitle = () => setState((prev) => ({ ...prev, screen: 'title', onboardingStep: 0 }));

  const updateProfile = (patch) => patchActiveSlot((slot) => ({
    ...slot,
    playerProfile: { ...slot.playerProfile, ...patch }
  }));

  const toggleFocusArea = (focusArea) => patchActiveSlot((slot) => {
    const exists = slot.playerProfile.focusAreas.includes(focusArea);
    const next = exists
      ? slot.playerProfile.focusAreas.filter((item) => item !== focusArea)
      : [...slot.playerProfile.focusAreas, focusArea].slice(-2);
    return {
      ...slot,
      playerProfile: { ...slot.playerProfile, focusAreas: next }
    };
  });

  const setPersonalityAnswer = (questionId, optionId) => patchActiveSlot((slot) => ({
    ...slot,
    personalityAnswers: { ...slot.personalityAnswers, [questionId]: optionId }
  }));

  const revealJob = () => {
    patchActiveSlot((slot) => {
      const jobId = pickJob(slot.personalityAnswers);
      const recommendedTrackId = KD_JOB_PROFILES[jobId]?.recommendedTrackId || 'builders_sprint';
      const firstQuest = getFirstQuestForTrack(recommendedTrackId);
      return {
        ...slot,
        assignedJobId: jobId,
        recommendedTrackId,
        chosenTrackId: recommendedTrackId,
        currentQuestId: firstQuest?.id || slot.currentQuestId
      };
    });
  };

  const finishOnboarding = () => {
    patchActiveSlot((slot) => ({
      ...slot,
      onboardingCompleted: true,
      xp: slot.xp + 40,
      level: Math.max(1, Math.floor((slot.xp + 40 + userVibes) / 60) + 1)
    }));
    setState((prev) => ({ ...prev, screen: 'home', onboardingStep: 0 }));
  };

  const advanceOnboarding = () => setState((prev) => ({ ...prev, onboardingStep: Math.min(prev.onboardingStep + 1, 4) }));
  const goBackOnboarding = () => setState((prev) => ({ ...prev, onboardingStep: Math.max(prev.onboardingStep - 1, 0) }));

  const chooseTrack = (trackId) => patchActiveSlot((slot) => {
    const firstQuest = getFirstQuestForTrack(trackId);
    return {
      ...slot,
      chosenTrackId: trackId,
      currentQuestId: firstQuest?.id || slot.currentQuestId
    };
  });

  const markQuestComplete = (questId) => patchActiveSlot((slot) => {
    const lookup = getQuestById(questId);
    const xpReward = lookup?.quest?.xpReward || 20;
    const completedQuestIds = slot.completedQuestIds.includes(questId)
      ? slot.completedQuestIds
      : [...slot.completedQuestIds, questId];
    const currentQuestId = slot.currentQuestId === questId ? slot.currentQuestId : questId;
    const totalXp = slot.xp + xpReward + userVibes;
    return {
      ...slot,
      completedQuestIds,
      currentQuestId,
      xp: slot.xp + xpReward,
      level: Math.max(1, Math.floor(totalXp / 60) + 1)
    };
  });

  const setCurrentQuest = (questId) => patchActiveSlot((slot) => ({ ...slot, currentQuestId: questId }));

  return {
    state,
    activeSlot,
    continueSlot,
    personalityTest: PERSONALITY_TEST,
    loadingPhase: state.loadingPhase,
    loadingComplete: state.loadingComplete,
    screen: state.screen,
    onboardingStep: state.onboardingStep,
    setScreen,
    startNewGame,
    continueGame,
    loadGame,
    resetToTitle,
    updateProfile,
    toggleFocusArea,
    setPersonalityAnswer,
    revealJob,
    finishOnboarding,
    advanceOnboarding,
    goBackOnboarding,
    chooseTrack,
    markQuestComplete,
    setCurrentQuest
  };
}
