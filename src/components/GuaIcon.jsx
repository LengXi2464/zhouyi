// 卦象 SVG 组件：准确绘制阳爻（连线）与阴爻（断线）
// pattern 为自下而上的爻串，'1'=阳爻，'0'=阴爻
// 例如：乾="111"，坤="000"，坎="010"，离="101"
// 支持三爻（八卦）与六爻（六十四卦）

export default function GuaIcon({ pattern, size = 64, color = 'currentColor', className = '', label }) {
  const n = pattern.length;
  const padY = 10;
  const padX = 8;
  const usableH = 100 - padY * 2;
  const thickness = n === 3 ? 13 : 8;
  const slot = n > 1 ? (usableH - thickness) / (n - 1) : 0;
  const xs = padX;
  const xe = 100 - padX;
  const mid = 50;
  const brkHalf = 9; // 阴爻中间间隙的一半

  // 自上而下绘制：pattern 最后一爻在最上方
  const rows = pattern.split('').reverse();

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={label ? `卦象：${label}` : '卦象'}
      style={{ color }}
    >
      {rows.map((bit, i) => {
        const cy = padY + thickness / 2 + i * slot;
        const y = cy - thickness / 2;
        if (bit === '1') {
          return (
            <rect
              key={i}
              x={xs}
              y={y}
              width={xe - xs}
              height={thickness}
              rx={2}
              fill="currentColor"
            />
          );
        }
        const half = (xe - xs) / 2;
        return (
          <g key={i} fill="currentColor">
            <rect x={xs} y={y} width={half - brkHalf} height={thickness} rx={2} />
            <rect x={mid + brkHalf} y={y} width={half - brkHalf} height={thickness} rx={2} />
          </g>
        );
      })}
    </svg>
  );
}
