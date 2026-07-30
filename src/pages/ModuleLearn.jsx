import { useMemo, useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import GuaIcon from '../components/GuaIcon';
import QuestionCard from '../components/QuestionCard';
import ConfirmDialog from '../components/ConfirmDialog';
import { getModuleById, allModules as modules, getQuestionsByModule, getSectionById } from '../data';
import { useProgress, markModuleComplete, recordAnswer } from '../hooks/useProgress';

export default function ModuleLearn() {
  const { moduleId } = useParams();
  const module = getModuleById(moduleId);
  const { progress } = useProgress();
  const [showConfirm, setShowConfirm] = useState(false);

  // 本模块练习题（顺序稳定，不在此处打乱题序，但可打乱选项）
  const moduleQuestions = useMemo(
    () => (module ? getQuestionsByModule(module.name) : []),
    [module]
  );

  if (!module) {
    return <Navigate to="/learn" replace />;
  }

  const moduleSection = module.section ? getSectionById(module.section) : null;
  const done = progress.completedModules.includes(module.name);
  const idx = modules.findIndex((m) => m.id === module.id);
  const prev = idx > 0 ? modules[idx - 1] : null;
  const next = idx < modules.length - 1 ? modules[idx + 1] : null;

  return (
    <div className="page module-learn">
      <nav className="breadcrumb" aria-label="路径">
        <Link to="/learn">基础知识</Link>
        {moduleSection && (
          <>
            <span className="breadcrumb-sep">/</span>
            <span>{moduleSection.icon} {moduleSection.name}</span>
          </>
        )}
        <span className="breadcrumb-sep">/</span>
        <span>{module.name}</span>
      </nav>

      <header className="module-head">
        <div className="module-head-gua" aria-hidden="true">
          <GuaIcon pattern={module.gua.pattern} size={72} />
        </div>
        <div>
          {moduleSection && (
            <span className="tag tag-soft" style={{ marginBottom: '10px' }}>
              {moduleSection.icon} {moduleSection.name}
            </span>
          )}
          <h1 className="page-title">{module.name}</h1>
          <p className="page-desc">{module.brief}</p>
        </div>
      </header>

      {/* 知识卡片 */}
      <section className="knowledge-cards">
        {module.sections.map((s, i) => (
          <article key={i} className="card knowledge-card">
            <h2 className="knowledge-card-h">{s.heading}</h2>
            <p className="knowledge-card-body">{s.body}</p>
          </article>
        ))}
      </section>

      {/* 八卦基础：展示八卦 */}
      {module.bagua && (
        <section className="bagua-section">
          <h2 className="section-title">八卦一览</h2>
          <div className="bagua-grid">
            {module.bagua.map((b) => (
              <div key={b.name} className="bagua-item">
                <div className="bagua-item-gua" aria-hidden="true">
                  <GuaIcon pattern={b.pattern} size={56} />
                </div>
                <div className="bagua-item-name">
                  {b.name} · {b.nature}
                </div>
                <div className="bagua-item-desc">{b.desc}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 要点 */}
      <section className="card key-points">
        <h2 className="key-points-title">本节要点</h2>
        <ul className="key-points-list">
          {module.keyPoints.map((k, i) => (
            <li key={i}>{k}</li>
          ))}
        </ul>
      </section>

      {/* 配套练习题 */}
      <section className="module-practice">
        <h2 className="section-title">本节练习（{moduleQuestions.length} 题）</h2>
        <p className="section-hint">点击选项即时判定，作答后查看解析。</p>
        <div className="module-practice-list">
          {moduleQuestions.map((q) => (
            <QuestionCard
              key={q.id}
              question={q}
              shuffleOpts
              onAnswered={(question, selectedIdx, correct) =>
                recordAnswer(question.id, question.module, selectedIdx, correct)
              }
            />
          ))}
        </div>
      </section>

      {/* 完成本节 */}
      <section className="module-complete">
        {done ? (
          <div className="done-banner">
            <span className="done-icon" aria-hidden="true">✓</span>
            你已完成本节学习
          </div>
        ) : (
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={() => setShowConfirm(true)}
          >
            完成本节学习
          </button>
        )}
      </section>

      {/* 上下节导航 */}
      <nav className="module-nav" aria-label="模块导航">
        {prev ? (
          <Link to={`/learn/${prev.id}`} className="module-nav-link prev">
            <span className="module-nav-dir">上一节</span>
            <span className="module-nav-name">{prev.name}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link to={`/learn/${next.id}`} className="module-nav-link next">
            <span className="module-nav-dir">下一节</span>
            <span className="module-nav-name">{next.name}</span>
          </Link>
        ) : (
          <Link to="/exam" className="module-nav-link next">
            <span className="module-nav-dir">去答题</span>
            <span className="module-nav-name">综合答题</span>
          </Link>
        )}
      </nav>

      <ConfirmDialog
        open={showConfirm}
        title="完成本节学习"
        message={
          <>
            确认完成「{module.name}」的学习？完成后将计入“已掌握知识点”。
            <br />
            你可以随时再次学习本节。
          </>
        }
        confirmText="确认完成"
        cancelText="再看看"
        danger={false}
        onConfirm={() => {
          markModuleComplete(module.name);
          setShowConfirm(false);
        }}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}
