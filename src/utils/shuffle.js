// Fisher–Yates 洗牌，返回新数组
export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// 打乱题目选项，返回 { options, answer }（answer 已映射到新索引）
export function shuffleOptions(question) {
  const indexed = question.options.map((opt, idx) => ({ opt, isAnswer: idx === question.answer }));
  const shuffled = shuffle(indexed);
  return {
    options: shuffled.map((x) => x.opt),
    answer: shuffled.findIndex((x) => x.isAnswer),
  };
}
