import { useMemo, useState } from 'react';
import QuestionCard from './QuestionCard';
import { recordAnswer } from '../hooks/useProgress';
import { shuffle } from '../utils/shuffle';

// 通用答题流程：管理题序、即时判定、计分、成绩总结
// props:
//   questions        题目数组
//   shuffleQuestions 是否打乱题序
//   shuffleOptions   是否打乱选项
//   onExit           退出回调
export default function QuizRunner({ questions, shuffleQuestions = false, shuffleOptions = true, onExit }) {
  const [queue, setQueue] = useState(() =>
    shuffleQuestions ? shuffle(questions) : questions.slice()
  );
  const [index, setIndex] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [finished, setFinished] = useState(false);
  const [results, setResults] = useState([]);

  const current = queue[index];
  const total = queue.length;

  const handleAnswered = (q, selectedIdx, correct) => {
    recordAnswer(q.id, q.module, selectedIdx, correct);
    setResults((r) => (r.find((x) => x.id === q.id) ? r : [...r, { id: q.id, module: q.module, question: q.question, correct }]));
    if (correct) setSessionCorrect((c) => c + 1);
  };

  const handleNext = () => {
    if (index + 1 < total) {
      setIndex((i) => i + 1);
    } else {
      setFinished(true);
    }
  };

  const restart = (newQuestions) => {
    setQueue(shuffleQuestions ? shuffle(newQuestions) : newQuestions.slice());
    setIndex(0);
    setSessionCorrect(0);
    setResults([]);
    setFinished(false);
  };

  const accuracy = total ? sessionCorrect / total : 0;
  const wrongItems = useMemo(() => results.filter((r) => !r.correct), [results]);

  if (total === 0) {
    return (
      <div className="card empty-state">
        <p>暂无题目可供练习。</p>
        {onExit && (
          <button type="button" className="btn btn-ghost" onClick={onExit}>
            返回
          </button>
        )}
      </div>
    );
  }

  if (finished) {
    return (
      <div className="quiz-summary card">
        <h2 className="summary-title">答题完成</h2>
        <div className="summary-ring" aria-hidden="true" style={{ '--p': Math.round(accuracy * 100) }}>
          <div className="summary-ring-num">{Math.round(accuracy * 100)}%</div>
        </div>
        <p className="summary-line">
          共 {total} 题，答对 <strong>{sessionCorrect}</strong> 题，答错{' '}
          <strong>{total - sessionCorrect}</strong> 题
        </p>

        {wrongItems.length > 0 ? (
          <div className="summary-wrong">
            <h3 className="summary-wrong-title">本次答错的知识点</h3>
            <ul className="summary-wrong-list">
              {wrongItems.map((w) => (
                <li key={w.id}>
                  <span className="wrong-module">{w.module}</span>
                  <span className="wrong-q">{w.question}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="summary-perfect">全部答对，表现优秀！</p>
        )}

        <div className="summary-actions">
          <button type="button" className="btn btn-primary" onClick={() => restart(questions)}>
            重新答题
          </button>
          {wrongItems.length > 0 && (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() =>
                restart(
                  questions.filter((q) => wrongItems.some((w) => w.id === q.id))
                )
              }
            >
              只练错题
            </button>
          )}
          {onExit && (
            <button type="button" className="btn btn-ghost" onClick={onExit}>
              返回
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-runner">
      <QuestionCard
        key={current.id}
        question={current}
        shuffleOpts={shuffleOptions}
        index={index}
        total={total}
        correctCount={sessionCorrect}
        accuracy={accuracy}
        onAnswered={handleAnswered}
        onNext={handleNext}
      />
      <div className="quiz-progress" aria-hidden="true">
        <div className="quiz-progress-bar" style={{ width: `${((index + 1) / total) * 100}%` }} />
      </div>
    </div>
  );
}
