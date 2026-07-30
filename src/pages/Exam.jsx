import QuizRunner from '../components/QuizRunner';
import { allQuestions as questions, questionStats } from '../data';

export default function Exam() {
  return (
    <div className="page">
      <header className="page-head">
        <h1 className="page-title">综合答题</h1>
        <p className="page-desc">
          共 {questionStats.total} 道题（单选 {questionStats.single} 题，判断 {questionStats.boolean} 题），
          覆盖全部 {questionStats.modules} 个知识模块。题序与选项均已随机打乱，作答即时判定。
        </p>
      </header>

      <QuizRunner
        questions={questions}
        shuffleQuestions
        shuffleOptions
        onExit={null}
      />
    </div>
  );
}
