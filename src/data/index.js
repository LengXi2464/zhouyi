// 数据聚合层：从各 section 子模块聚合所有模块与题库
// 每个 section 包含：modules[]（知识模块）和 questions[]（题库）
// 统一对外暴露全局查询 API

import { modules as zyModules, questions as zyQuestions, section as zySection } from './sections/zhouyi.js';
import { modules as wxModules, questions as wxQuestions, section as wxSection } from './sections/wuxing.js';
import { modules as bzModules, questions as bzQuestions, section as bzSection } from './sections/bazi.js';
import { modules as lyModules, questions as lyQuestions, section as lySection } from './sections/liuyao.js';
import { modules as mhModules, questions as mhQuestions, section as mhSection } from './sections/meihua.js';
import { modules as lssModules, questions as lssQuestions, section as lssSection } from './sections/liushisi.js';

export const sections = [zySection, wxSection, bzSection, lySection, mhSection, lssSection];

export const allModules = [...zyModules, ...wxModules, ...bzModules, ...lyModules, ...mhModules, ...lssModules];

export const allQuestions = [
  ...zyQuestions,
  ...wxQuestions,
  ...bzQuestions,
  ...lyQuestions,
  ...mhQuestions,
  ...lssQuestions,
];

export const allQuestionsByModule = allQuestions.reduce((acc, q) => {
  if (!acc[q.module]) acc[q.module] = [];
  acc[q.module].push(q);
  return acc;
}, {});

export const allQuestionsBySection = allQuestions.reduce((acc, q) => {
  const sec = q.section || 'unknown';
  if (!acc[sec]) acc[sec] = [];
  acc[sec].push(q);
  return acc;
}, {});

export const getQuestionById = (id) => allQuestions.find((q) => q.id === id);
export const getModuleByName = (name) => allModules.find((m) => m.name === name);
export const getModuleById = (id) => allModules.find((m) => m.id === id);
export const getQuestionsByModule = (name) => allQuestionsByModule[name] || [];
export const getSectionByName = (name) => sections.find((s) => s.name === name);
export const getSectionById = (id) => sections.find((s) => s.id === id);
export const getModulesBySection = (sectionId) =>
  allModules.filter((m) => m.section === sectionId);
export const getQuestionsBySection = (sectionId) =>
  allQuestionsBySection[sectionId] || [];

export const questionStats = {
  total: allQuestions.length,
  single: allQuestions.filter((q) => q.type === 'single').length,
  boolean: allQuestions.filter((q) => q.type === 'boolean').length,
  multi: allQuestions.filter((q) => q.type === 'multi').length,
  sections: sections.length,
  modules: allModules.length,
};
