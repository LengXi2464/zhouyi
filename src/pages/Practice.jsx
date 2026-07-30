import { useState } from 'react';
import { Link } from 'react-router-dom';
import GuaIcon from '../components/GuaIcon';
import QuizRunner from '../components/QuizRunner';
import { allModules, getQuestionsByModule, getQuestionsBySection, sections, getModulesBySection, getSectionById } from '../data';
import { useProgress } from '../hooks/useProgress';

export default function Practice() {
  const { progress } = useProgress();
  const [activeModule, setActiveModule] = useState(null);
  const [activeSection, setActiveSection] = useState('all');

  if (activeModule) {
    const questions = getQuestionsByModule(activeModule);
    const moduleData = allModules.find((m) => m.name === activeModule);
    const moduleSection = moduleData ? getSectionById(moduleData.section) : null;
    return (
      <div className="page">
        <nav className="breadcrumb" aria-label="路径">
          <Link to="/practice">专项练习</Link>
          {moduleSection && (
            <>
              <span className="breadcrumb-sep">/</span>
              <span>{moduleSection.icon} {moduleSection.name}</span>
            </>
          )}
          <span className="breadcrumb-sep">/</span>
          <span>{activeModule}</span>
        </nav>
        <QuizRunner
          questions={questions}
          shuffleQuestions
          shuffleOptions
          onExit={() => setActiveModule(null)}
        />
      </div>
    );
  }

  const filteredModules = activeSection === 'all'
    ? allModules
    : getModulesBySection(activeSection);

  const currentSection = activeSection !== 'all' ? getSectionById(activeSection) : null;

  return (
    <div className="page">
      <nav className="breadcrumb" aria-label="路径">
        <Link to="/">首页</Link>
        <span className="breadcrumb-sep">/</span>
        <span>专项练习</span>
        {currentSection && (
          <>
            <span className="breadcrumb-sep">/</span>
            <span>{currentSection.icon} {currentSection.name}</span>
          </>
        )}
      </nav>

      <header className="page-head">
        <h1 className="page-title">
          {currentSection ? `${currentSection.name} · 专项练习` : '专项练习'}
        </h1>
        <p className="page-desc">
          {currentSection
            ? currentSection.brief
            : '按知识模块逐一练习。每个模块的题目随机打乱题序与选项，作答即时判定。'}
        </p>
      </header>

      {/* 板块筛选 */}
      <div className="section-tabs">
        <button
          type="button"
          className={`section-tab${activeSection === 'all' ? ' section-tab-active' : ''}`}
          onClick={() => setActiveSection('all')}
        >
          全部
        </button>
        {sections.map((sec) => (
          <button
            key={sec.id}
            type="button"
            className={`section-tab${activeSection === sec.id ? ' section-tab-active' : ''}`}
            onClick={() => setActiveSection(sec.id)}
          >
            <span className="section-tab-icon">{sec.icon}</span>
            {sec.name}
          </button>
        ))}
      </div>

      <div className="module-list">
        {filteredModules.map((m) => {
          const done = progress.completedModules.includes(m.name);
          const qCount = getQuestionsByModule(m.name).length;
          const moduleSection = getSectionById(m.section);
          return (
            <button
              key={m.id}
              type="button"
              className="module-row module-row-btn"
              onClick={() => setActiveModule(m.name)}
            >
              <div className="module-row-gua" aria-hidden="true">
                <GuaIcon pattern={m.gua.pattern} size={44} />
              </div>
              <div className="module-row-body">
                <div className="module-row-title">
                  {m.name}
                  {done && <span className="badge-done">已掌握</span>}
                  {moduleSection && (
                    <span className="tag tag-soft">{moduleSection.icon} {moduleSection.name}</span>
                  )}
                </div>
                <div className="module-row-brief">{m.brief}</div>
                <div className="module-row-meta">{qCount} 题 · 随机题序与选项</div>
              </div>
              <div className="module-row-arrow" aria-hidden="true">开始 →</div>
            </button>
          );
        })}
      </div>

      <div className="practice-tip card">
        <h3>小提示</h3>
        <p>
          想要混合所有题目一起练习？前往
          <Link to="/exam" className="inline-link"> 综合答题</Link>。
        </p>
      </div>
    </div>
  );
}