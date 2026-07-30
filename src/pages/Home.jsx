import { Link } from 'react-router-dom';
import GuaIcon from '../components/GuaIcon';
import { useProgress } from '../hooks/useProgress';
import { allModules as modules, questionStats, sections, getModulesBySection, getQuestionsBySection } from '../data';

export default function Home() {
  const { stats, progress } = useProgress();
  const todayGoal = 10;
  const todayPct = Math.min(100, Math.round((stats.todayAnswered / todayGoal) * 100));

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-deco" aria-hidden="true">
          <GuaIcon pattern="111" size={120} className="hero-gua hero-gua-1" />
          <GuaIcon pattern="000" size={96} className="hero-gua hero-gua-2" />
        </div>
        <div className="hero-content">
          <p className="hero-eyebrow">周易基础知识学习与答题</p>
          <h1 className="hero-title">易学入门</h1>
          <p className="hero-sub">
            面向零基础用户的《周易》文化普及网站。从阴阳、爻卦到八卦与六十四卦，
            以通行的经典知识为依据，配合即时判定的互动答题，帮助你循序渐进地入门。
          </p>
          <div className="hero-actions">
            <Link to="/learn" className="btn btn-primary btn-lg">
              开始学习
            </Link>
            <Link to="/exam" className="btn btn-ghost btn-lg">
              开始答题
            </Link>
          </div>
        </div>
      </section>

      {/* 数据概览 */}
      <section className="overview" aria-label="学习概览">
        <div className="stat-card">
          <div className="stat-label">今日学习进度</div>
          <div className="stat-value">
            {stats.todayAnswered}
            <span className="stat-unit">/{todayGoal} 题</span>
          </div>
          <div className="progress" aria-hidden="true">
            <div className="progress-bar" style={{ width: `${todayPct}%` }} />
          </div>
          <div className="stat-sub">今日完成模块 {stats.todayCompletedModules.length} 个</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">已掌握知识点</div>
          <div className="stat-value">
            {stats.completedModules}
            <span className="stat-unit">/{modules.length} 模块</span>
          </div>
          <div
            className="ring"
            aria-hidden="true"
            style={{ '--p': Math.round((stats.completedModules / modules.length) * 100) }}
          >
            <div className="ring-text">{Math.round((stats.completedModules / modules.length) * 100)}%</div>
          </div>
          <div className="stat-sub">点击“完成本节学习”即记录掌握</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">当前答题正确率</div>
          <div className="stat-value">
            {stats.total ? Math.round(stats.accuracy * 100) : 0}
            <span className="stat-unit">%</span>
          </div>
          <div className="stat-sub">
            已答 {stats.total} 题 · 答对 {stats.correct} · 错题 {stats.wrongCount}
          </div>
          {stats.total === 0 && <div className="stat-sub">尚未开始答题</div>}
        </div>
      </section>

      {/* 板块导航 */}
      <section className="section">
        <div className="section-head">
          <h2 className="section-title">板块导航</h2>
        </div>
        <div className="section-cards">
          {sections.map((sec) => {
            const secModules = getModulesBySection(sec.id);
            const secQuestions = getQuestionsBySection(sec.id);
            const firstModule = secModules[0];
            return (
              <Link
                key={sec.id}
                to={`/learn?section=${sec.id}`}
                className="section-card"
              >
                <div className="section-card-icon" aria-hidden="true">
                  {sec.icon}
                </div>
                <div className="section-card-title">{sec.name}</div>
                <div className="section-card-desc">{sec.brief}</div>
                <div className="section-card-modules">
                  <span>{secModules.length} 个模块</span>
                  <span className="section-card-questions">
                    <strong>{secQuestions.length}</strong> 道题
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 学习入口 */}
      <section className="section">
        <div className="section-head">
          <h2 className="section-title">基础知识模块</h2>
          <Link to="/learn" className="section-more">
            查看全部 →
          </Link>
        </div>
        <div className="module-grid">
          {modules.slice(0, 4).map((m) => {
            const done = progress.completedModules.includes(m.name);
            return (
              <Link key={m.id} to={`/learn/${m.id}`} className={`module-card${done ? ' is-done' : ''}`}>
                <div className="module-card-gua" aria-hidden="true">
                  <GuaIcon pattern={m.gua.pattern} size={48} />
                </div>
                <div className="module-card-body">
                  <div className="module-card-title">
                    {m.name}
                    {done && <span className="badge-done">已掌握</span>}
                  </div>
                  <div className="module-card-brief">{m.brief}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 答题入口 */}
      <section className="section">
        <div className="section-head">
          <h2 className="section-title">互动答题</h2>
        </div>
        <div className="entry-grid">
          <Link to="/practice" className="entry-card">
            <h3 className="entry-title">专项练习</h3>
            <p className="entry-desc">按知识模块逐一练习，巩固当前所学。</p>
          </Link>
          <Link to="/exam" className="entry-card">
            <h3 className="entry-title">综合答题</h3>
            <p className="entry-desc">
              全部 {questionStats.total} 道题混合练习，随机打乱题序与选项。
            </p>
          </Link>
          <Link to="/wrong" className="entry-card">
            <h3 className="entry-title">错题本</h3>
            <p className="entry-desc">针对错题反复练习，直到掌握。当前错题 {stats.wrongCount} 道。</p>
          </Link>
        </div>
      </section>

      {/* 最近学习位置 */}
      {progress.lastVisit && (
        <section className="section">
          <div className="resume-card">
            <div>
              <div className="resume-label">继续上次学习</div>
              <div className="resume-path">{progress.lastVisit.path}</div>
            </div>
            <Link to={progress.lastVisit.path} className="btn btn-primary">
              继续 →
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
