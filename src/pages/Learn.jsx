import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import GuaIcon from '../components/GuaIcon';
import { allModules, getQuestionsByModule, sections, getSectionById } from '../data';
import { useProgress } from '../hooks/useProgress';

export default function Learn() {
  const { progress } = useProgress();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState('all');

  useEffect(() => {
    const sectionParam = searchParams.get('section');
    if (sectionParam && sections.some((s) => s.id === sectionParam)) {
      setActiveSection(sectionParam);
    }
  }, [searchParams]);

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    if (sectionId === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ section: sectionId });
    }
  };

  const filteredModules = activeSection === 'all'
    ? allModules
    : allModules.filter((m) => m.section === activeSection);

  const totalInSection = (sectionId) => {
    const mods = sectionId === 'all'
      ? allModules
      : allModules.filter((m) => m.section === sectionId);
    return mods.length;
  };

  const currentSection = activeSection !== 'all' ? getSectionById(activeSection) : null;

  return (
    <div className="page">
      <nav className="breadcrumb" aria-label="路径">
        <Link to="/">首页</Link>
        <span className="breadcrumb-sep">/</span>
        <span>基础知识</span>
        {currentSection && (
          <>
            <span className="breadcrumb-sep">/</span>
            <span>{currentSection.icon} {currentSection.name}</span>
          </>
        )}
      </nav>

      <header className="page-head">
        <h1 className="page-title">
          {currentSection ? `${currentSection.name} · 基础知识` : '基础知识'}
        </h1>
        <p className="page-desc">
          {currentSection
            ? currentSection.brief
            : `共 ${allModules.length} 个模块，建议按顺序学习。每个模块包含知识卡片与配套练习题，学完后点击"完成本节学习"即可记录进度。`}
        </p>
      </header>

      {/* 板块切换 Tabs */}
      <div className="section-tabs">
        <button
          type="button"
          className={`section-tab${activeSection === 'all' ? ' section-tab-active' : ''}`}
          onClick={() => handleSectionChange('all')}
        >
          全部 ({totalInSection('all')})
        </button>
        {sections.map((sec) => (
          <button
            key={sec.id}
            type="button"
            className={`section-tab${activeSection === sec.id ? ' section-tab-active' : ''}`}
            onClick={() => handleSectionChange(sec.id)}
          >
            <span className="section-tab-icon">{sec.icon}</span>
            {sec.name} ({totalInSection(sec.id)})
          </button>
        ))}
      </div>

      <div className="module-list">
        {filteredModules.map((m, i) => {
          const done = progress.completedModules.includes(m.name);
          const qCount = getQuestionsByModule(m.name).length;
          const moduleSection = getSectionById(m.section);
          return (
            <Link key={m.id} to={`/learn/${m.id}`} className={`module-row${done ? ' is-done' : ''}`}>
              <div className="module-row-index">{i + 1}</div>
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
                <div className="module-row-meta">{qCount} 道练习题</div>
              </div>
              <div className="module-row-arrow" aria-hidden="true">→</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}