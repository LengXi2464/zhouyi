import { useState } from 'react';
import { Link } from 'react-router-dom';
import ConfirmDialog from '../components/ConfirmDialog';
import { allModules, getQuestionsByModule } from '../data';
import { useProgress, clearAllProgress } from '../hooks/useProgress';

export default function Stats() {
  const { progress, stats } = useProgress();
  const [showClear, setShowClear] = useState(false);

  // 按模块统计作答情况
  const moduleStats = allModules.map((m) => {
    const qs = getQuestionsByModule(m.name);
    const answered = qs.filter((q) => progress.answers[q.id]);
    const correct = answered.filter((q) => progress.answers[q.id].correct);
    const wrong = answered.filter((q) => !progress.answers[q.id].correct);
    return {
      ...m,
      total: qs.length,
      answeredCount: answered.length,
      correctCount: correct.length,
      wrongCount: wrong.length,
      done: progress.completedModules.includes(m.name),
    };
  });

  const accuracyPct = stats.total ? Math.round(stats.accuracy * 100) : 0;

  return (
    <div className="page">
      <header className="page-head">
        <h1 className="page-title">学习统计</h1>
        <p className="page-desc">所有数据保存在浏览器本地（localStorage），不会上传服务器。</p>
      </header>

      <section className="stats-overview">
        <div className="stat-card">
          <div className="stat-label">总答题数</div>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">答对</div>
          <div className="stat-value stat-correct">{stats.correct}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">答错</div>
          <div className="stat-value stat-wrong">{stats.total - stats.correct}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">正确率</div>
          <div className="stat-value">{accuracyPct}%</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">已掌握模块</div>
          <div className="stat-value">
            {stats.completedModules}/{allModules.length}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">当前错题</div>
          <div className="stat-value stat-wrong">{stats.wrongCount}</div>
        </div>
      </section>

      {/* 整体正确率进度条 */}
      <section className="card">
        <div className="bar-row">
          <span className="bar-row-label">整体正确率</span>
          <span className="bar-row-value">{accuracyPct}%</span>
        </div>
        <div className="progress progress-lg">
          <div className="progress-bar progress-bar-correct" style={{ width: `${accuracyPct}%` }} />
        </div>
      </section>

      {/* 模块明细 */}
      <section className="section">
        <h2 className="section-title">各模块明细</h2>
        <div className="table-wrap">
          <table className="stats-table">
            <thead>
              <tr>
                <th>模块</th>
                <th>总题数</th>
                <th>已答</th>
                <th>答对</th>
                <th>答错</th>
                <th>掌握</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {moduleStats.map((m) => (
                <tr key={m.id}>
                  <td className="td-name">{m.name}</td>
                  <td>{m.total}</td>
                  <td>{m.answeredCount}</td>
                  <td className="td-correct">{m.correctCount}</td>
                  <td className="td-wrong">{m.wrongCount}</td>
                  <td>{m.done ? '✓' : '—'}</td>
                  <td>
                    <Link to={`/learn/${m.id}`} className="table-link">
                      学习
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 清除记录 */}
      <section className="danger-zone card">
        <h2 className="danger-zone-title">清除学习记录</h2>
        <p className="danger-zone-desc">
          将清空全部答题记录、错题本、已掌握模块和最近学习位置。此操作不可恢复，请谨慎确认。
        </p>
        <button type="button" className="btn btn-danger" onClick={() => setShowClear(true)}>
          清除全部学习记录
        </button>
      </section>

      <ConfirmDialog
        open={showClear}
        title="确认清除全部学习记录？"
        message="此操作将永久删除你所有的答题记录、错题本和学习进度，且无法恢复。确定要继续吗？"
        confirmText="确认清除"
        cancelText="取消"
        danger
        onConfirm={() => {
          clearAllProgress();
          setShowClear(false);
        }}
        onCancel={() => setShowClear(false)}
      />
    </div>
  );
}
