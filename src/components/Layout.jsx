import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import NavBar from './NavBar';
import { setLastVisit } from '../hooks/useProgress';

export default function Layout({ children }) {
  const location = useLocation();
  const [bugTipHidden, setBugTipHidden] = useState(false);

  // 记录最近一次学习位置（首页不记录）
  useEffect(() => {
    if (location.pathname !== '/') {
      setLastVisit(location.pathname);
    }
    // 滚动到顶部
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // 关闭BUG提示
  const handleCloseBugTip = () => {
    setBugTipHidden(true);
  };

  return (
    <div className="app">
      {/* 桃花金粉飘落装饰 */}
      <div className="petal-container" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} className={`petal petal-${i + 1}`} />
        ))}
      </div>
      <NavBar />
      <main className="main">{children}</main>
      <footer className="footer">
        <div className="footer-inner">
          <p>易学入门 · 周易基础知识学习网站</p>
          <p className="footer-note">以道御术 · 以诚明心 ❋ 文化普及仅供参考</p>
        </div>
      </footer>
      {/* BUG提示条 - 固定在底部 */}
      <div className={`bug-tip${bugTipHidden ? ' is-hidden' : ''}`} role="alert">
        <span className="bug-tip-icon">⚠️</span>
        <span className="bug-tip-text">如遇BUG请刷新</span>
        <button className="bug-tip-close" onClick={handleCloseBugTip} aria-label="关闭">✕</button>
      </div>
    </div>
  );
}
