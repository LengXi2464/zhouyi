import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  defaultProgress,
  loadProgress,
  saveProgress,
  isSameDay,
} from '../utils/storage';

// 模块级共享状态：保证多个组件读到同一份记录
let memoryState = loadProgress();
const listeners = new Set();

function commit(next) {
  memoryState = next;
  saveProgress(memoryState);
  listeners.forEach((l) => l(memoryState));
}

// ---- 模块级操作函数（可在组件外调用）----
export function recordAnswer(questionId, moduleName, selected, correct) {
  const p = memoryState;
  const already = !!p.answers[questionId];
  const answers = already
    ? p.answers
    : {
        ...p.answers,
        [questionId]: { selected, correct, module: moduleName, ts: Date.now() },
      };
  let wrongQuestions;
  if (correct) {
    wrongQuestions = p.wrongQuestions.filter((id) => id !== questionId);
  } else if (p.wrongQuestions.includes(questionId)) {
    wrongQuestions = p.wrongQuestions;
  } else {
    wrongQuestions = [...p.wrongQuestions, questionId];
  }
  commit({ ...p, answers, wrongQuestions });
}

export function markModuleComplete(moduleName) {
  const p = memoryState;
  const completedModules = p.completedModules.includes(moduleName)
    ? p.completedModules
    : [...p.completedModules, moduleName];
  commit({
    ...p,
    completedModules,
    moduleSections: {
      ...p.moduleSections,
      [moduleName]: {
        ...(p.moduleSections[moduleName] || {}),
        completed: true,
        studiedAt: Date.now(),
      },
    },
  });
}

export function setLastVisit(path) {
  commit({ ...memoryState, lastVisit: { path, ts: Date.now() } });
}

export function clearAllProgress() {
  commit(defaultProgress());
}

export function removeFromWrong(questionId) {
  const p = memoryState;
  commit({ ...p, wrongQuestions: p.wrongQuestions.filter((id) => id !== questionId) });
}

// ---- React hook ----
export function useProgress() {
  const [progress, setProgress] = useState(memoryState);

  useEffect(() => {
    const listener = (newState) => setProgress(newState);
    listeners.add(listener);
    return () => listeners.delete(listener);
  }, []);

  const stats = useMemo(() => {
    const answerList = Object.values(progress.answers);
    const total = answerList.length;
    const correct = answerList.filter((a) => a.correct).length;
    const accuracy = total ? correct / total : 0;
    const now = Date.now();
    const todayAnswered = answerList.filter((a) => isSameDay(a.ts, now)).length;
    const todayCompletedModules = Object.entries(progress.moduleSections)
      .filter(([, v]) => v.completed && isSameDay(v.studiedAt, now))
      .map(([k]) => k);
    return {
      total,
      correct,
      accuracy,
      wrongCount: progress.wrongQuestions.length,
      completedModules: progress.completedModules.length,
      todayAnswered,
      todayCompletedModules,
    };
  }, [progress]);

  return {
    progress,
    stats,
    recordAnswer: useCallback((...args) => recordAnswer(...args), []),
    markModuleComplete: useCallback((name) => markModuleComplete(name), []),
    setLastVisit: useCallback((path) => setLastVisit(path), []),
    clearAll: useCallback(() => clearAllProgress(), []),
    removeFromWrong: useCallback((id) => removeFromWrong(id), []),
  };
}
