// 学习记录持久化（localStorage）
// 数据结构：
// {
//   answers: { [questionId]: { selected, correct, module, ts } },  // 首次作答记录，用于统计
//   completedModules: string[],                                    // 已完成（点击“完成本节”）的模块名
//   moduleSections: { [moduleName]: { completed, studiedAt } },    // 模块学习状态
//   wrongQuestions: string[],                                      // 当前错题本（含未纠正的错题）
//   lastVisit: { path, ts },                                       // 最近一次学习位置
// }

const STORAGE_KEY = 'yixue-rumen-progress-v1';

export function defaultProgress() {
  return {
    answers: {},
    completedModules: [],
    moduleSections: {},
    wrongQuestions: [],
    lastVisit: null,
  };
}

export function loadProgress() {
  if (typeof window === 'undefined') return defaultProgress();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    const parsed = JSON.parse(raw);
    // 合并默认字段，保证结构完整（兼容旧版本）
    return { ...defaultProgress(), ...parsed };
  } catch (e) {
    console.warn('读取学习记录失败，将使用默认记录。', e);
    return defaultProgress();
  }
}

export function saveProgress(progress) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.warn('保存学习记录失败。', e);
  }
}

export function clearProgress() {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('清除学习记录失败。', e);
  }
}

// 判断是否同一天
export function isSameDay(ts1, ts2) {
  if (!ts1 || !ts2) return false;
  const d1 = new Date(ts1);
  const d2 = new Date(ts2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}
