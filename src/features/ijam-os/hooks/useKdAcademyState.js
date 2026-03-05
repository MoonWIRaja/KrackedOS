import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'kdacademy_state_v1';

const DEFAULT_STATE = {
  onboardingCompleted: false,
  builderType: '',
  focusAreas: [],
  learningStyle: 'guided',
  activePath: 'frontend',
  activeQuestId: '',
  activeTab: 'onboarding',
  streak: 1,
  bonusXp: 0,
  completedQuestIds: [],
  avatar: {
    skin: '#f2d3b1',
    hair: '#1f2937',
    outfit: '#2563eb',
    accessory: 'none',
    aura: '#f5d000'
  }
};

export function useKdAcademyState({ externalTab, onExternalTabChange, frontendLessons, backendLessons, activeLessonId }) {
  const [state, setState] = useState(() => {
    if (typeof window === 'undefined') return DEFAULT_STATE;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT_STATE;
      return { ...DEFAULT_STATE, ...JSON.parse(raw) };
    } catch {
      return DEFAULT_STATE;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    if (!externalTab) return;
    setState((prev) => ({ ...prev, activeTab: externalTab }));
  }, [externalTab]);

  const activeTab = state.onboardingCompleted ? state.activeTab : 'onboarding';

  const setActiveTab = (tab) => {
    setState((prev) => ({ ...prev, activeTab: tab }));
    onExternalTabChange?.(tab);
  };

  const suggestedQuestId = useMemo(() => {
    if (state.activeQuestId) return state.activeQuestId;
    const source = state.activePath === 'backend' ? backendLessons : frontendLessons;
    return source[0]?.id || activeLessonId || '';
  }, [activeLessonId, backendLessons, frontendLessons, state.activePath, state.activeQuestId]);

  return {
    academyState: state,
    activeTab,
    suggestedQuestId,
    setActiveTab,
    setBuilderType: (builderType) => setState((prev) => ({ ...prev, builderType })),
    toggleFocusArea: (focusArea) => setState((prev) => {
      const exists = prev.focusAreas.includes(focusArea);
      const next = exists
        ? prev.focusAreas.filter((item) => item !== focusArea)
        : [...prev.focusAreas, focusArea].slice(-2);
      return { ...prev, focusAreas: next };
    }),
    setLearningStyle: (learningStyle) => setState((prev) => ({ ...prev, learningStyle })),
    setActivePath: (activePath) => setState((prev) => ({ ...prev, activePath })),
    updateAvatar: (key, value) => setState((prev) => ({ ...prev, avatar: { ...prev.avatar, [key]: value } })),
    completeOnboarding: () => setState((prev) => ({
      ...prev,
      onboardingCompleted: true,
      activeTab: 'home',
      activeQuestId: suggestedQuestId || prev.activeQuestId,
      bonusXp: prev.bonusXp + 40
    })),
    setActiveQuestId: (activeQuestId) => setState((prev) => ({ ...prev, activeQuestId })),
    markQuestComplete: (questId) => setState((prev) => ({
      ...prev,
      completedQuestIds: prev.completedQuestIds.includes(questId)
        ? prev.completedQuestIds
        : [...prev.completedQuestIds, questId],
      bonusXp: prev.bonusXp + 20,
      streak: prev.streak + 1
    }))
  };
}
