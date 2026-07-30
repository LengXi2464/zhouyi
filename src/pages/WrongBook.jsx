import { useState } from 'react';
import { Link } from 'react-router-dom';
import QuizRunner from '../components/QuizRunner';
import GuaIcon from '../components/GuaIcon';
import { useProgress, removeFromWrong } from '../hooks/useProgress';
import { getQuestionById } from '../data';

export default function WrongBook() {
  const { progress, stats } = useProgress();
  const [practicing, setPracticing] = useState(false);

  const wrongQuestions = progress.wrongQuestions
    .map((id) => getQuestionById(id))
    .filter(Boolean);

  if (practicing) {
    if (wrongQuestions.length === 0) {
      return (
        <div className="page">
          <div className="card empty-state">
            <p>错题本已清空，没有可练习的错题。</p>
            <button type="button" className="btn btn-primary" onClick={() => setPracticing(false)}>
              返回错题本
            </button>
          </div>
        </div>
      );
    }
    return (
      <div className="page">
        <nav className="breadcrumb" aria-label="路径">
          <button type="button" className="breadcrumb-link" onClick={() => setPracticing(false)}>
            错题本
          </button>
          <span className="breadcrumb-sep">/</span>
          <span>只练错题</span>
        </nav>
        <QuizRunner
          questions={wrongQuestions}
          shuffleQuestions
          shuffleOptions
          onExit={() => setPracticing(false)}
        />
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page-head">
        <h1 className="page-title">错题本</h1>
        <p className="page-desc">
          这里记录你答错过且尚未纠正的题目。答对后该题会自动移出错题本。当前共{' '}
          <strong>{stats.wrongCount}</strong> 道错题。
        </p>
      </header>

      {wrongQuestions.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-gua" aria-hidden="true">
            <GuaIcon pattern="111" size={64} />
          </div>
          <p className="empty-title">暂无错题</p>
          <p className="empty-desc">继续保持！可以去综合答题或专项练习中检验自己。</p>
          <div className="empty-actions">
            <Link to="/exam" className="btn btn-primary">
              去答题
            </Link>
            <Link to="/practice" className="btn btn-ghost">
              专项练习
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="wrong-actions">
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={() => setPracticing(true)}
            >
              只练错题（{wrongQuestions.length}）
            </button>
          </div>

          <ul className="wrong-list">
            {wrongQuestions.map((q) => (
              <li key={q.id} className="card wrong-item">
                <div className="wrong-item-meta">
                  <span className="tag tag-soft">{q.module}</span>
                  <span className="tag">{q.type === 'boolean' ? '判断题' : '单选题'}</span>
                </div>
                <div className="wrong-item-q">{q.question}</div>
                <div className="wrong-item-answer">
                  正确答案：
                  <strong>{q.options[q.answer]}</strong>
                </div>
                <div className="wrong-item-exp">{q.explanation}</div>
                <div className="wrong-item-foot">
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => removeFromWrong(q.id)}
                  >
                    移出错题本
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
