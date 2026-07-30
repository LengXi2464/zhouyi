import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NavBar from './NavBar';
import { setLastVisit } from '../hooks/useProgress';

export default function Layout({ children }) {
  const location = useLocation();

  // 记录最近一次学习位置（首页不记录）
  useEffect(() => {
    if (location.pathname !== '/') {
      setLastVisit(location.pathname);
    }
    // 滚动到顶部
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="app">
      <NavBar />
      <main className="main">{children}</main>
      <footer className="footer">
        <div className="footer-inner">
          <p>易学入门 · 周易基础知识学习网站</p>
        </div>
      </footer>
    </div>
  );
}
