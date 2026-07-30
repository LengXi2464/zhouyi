import { useState } from 'react';

// 单题答题组件（纯 UI，不直接持久化）
// props:
//   question    题目对象
//   shuffleOpts 是否打乱选项
//   onAnswered?(question, selectedIndex, correct)  作答时回调（仅触发一次）
//   onNext?     “下一题”回调
//   index/total/correctCount/accuracy 展示用
export default function QuestionCard({
  question,
  shuffleOpts = false,
  onAnswered,
  onNext,
  index,
  total,
  correctCount,
  accuracy,
}) {
  const [state, setState] = useState(() => {
    if (shuffleOpts) {
      const indexed = question.options.map((opt, idx) => ({ opt, isAnswer: idx === question.answer }));
      for (let i = indexed.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indexed[i], indexed[j]] = [indexed[j], indexed[i]];
      }
      return {
        options: indexed.map((x) => x.opt),
        answer: indexed.findIndex((x) => x.isAnswer),
        selected: null,
        locked: false,
      };
    }
    return {
      options: question.options,
      answer: question.answer,
      selected: null,
      locked: false,
    };
  });

  const isCorrect = state.locked && state.selected === state.answer;

  const handleSelect = (idx) => {
    if (state.locked) return;
    const correct = idx === state.answer;
    setState((s) => ({ ...s, selected: idx, locked: true }));
    onAnswered?.(question, idx, correct);
  };

  const typeLabel = question.type === 'boolean' ? '判断题' : '单选题';

  return (
    <article className="question-card" aria-labelledby={`q-${question.id}`}>
      <div className="question-meta">
        <span className="tag">{typeLabel}</span>
        <span className="tag tag-soft">{question.module}</span>
        {typeof index === 'number' && typeof total === 'number' && (
          <span className="q-index">
            第 {index + 1} / {total} 题
          </span>
        )}
        {typeof correctCount === 'number' && typeof accuracy === 'number' && (
          <span className="q-score">
            已答对 {correctCount} · 正确率 {Math.round(accuracy * 100)}%
          </span>
        )}
      </div>

      <h3 id={`q-${question.id}`} className="question-text">
        {question.question}
      </h3>

      <ul className="options" role="list">
        {state.options.map((opt, idx) => {
          let cls = 'option';
          if (state.locked) {
            if (idx === state.answer) cls += ' option-correct';
            else if (idx === state.selected) cls += ' option-wrong';
            else cls += ' option-dim';
          } else if (idx === state.selected) {
            cls += ' option-selected';
          }
          return (
            <li key={idx}>
              <button
                type="button"
                className={cls}
                onClick={() => handleSelect(idx)}
                disabled={state.locked}
                aria-pressed={state.selected === idx}
              >
                <span className="option-label">{String.fromCharCode(65 + idx)}</span>
                <span className="option-text">{opt}</span>
                {state.locked && idx === state.answer && (
                  <span className="option-mark" aria-hidden="true">✓</span>
                )}
                {state.locked && idx === state.selected && idx !== state.answer && (
                  <span className="option-mark" aria-hidden="true">×</span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {state.locked && (
        <div className={`feedback ${isCorrect ? 'feedback-correct' : 'feedback-wrong'}`}>
          <div className="feedback-head">{isCorrect ? '回答正确' : '回答错误'}</div>
          <div className="feedback-exp">{question.explanation}</div>
        </div>
      )}

      {state.locked && onNext && (
        <div className="question-foot">
          <button type="button" className="btn btn-primary" onClick={onNext}>
            {typeof index === 'number' && typeof total === 'number' && index + 1 >= total
              ? '查看成绩 →'
              : '下一题 →'}
          </button>
        </div>
      )}
    </article>
  );
}
