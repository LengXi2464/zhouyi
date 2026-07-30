import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/', label: '首页', end: true },
  { to: '/learn', label: '基础知识' },
  { to: '/practice', label: '专项练习' },
  { to: '/exam', label: '综合答题' },
  { to: '/wrong', label: '错题本' },
  { to: '/stats', label: '学习统计' },
];

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // 路由切换时关闭移动端菜单
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header className="nav">
      <div className="nav-inner">
        <NavLink to="/" className="brand" aria-label="易学入门 首页">
          <span className="brand-mark" aria-hidden="true">
            <span className="yao yao-yang" />
            <span className="yao yao-yin" />
            <span className="yao yao-yang" />
          </span>
          <span className="brand-text">易学入门</span>
        </NavLink>

        <button
          type="button"
          className={`nav-toggle ${open ? 'is-open' : ''}`}
          aria-expanded={open}
          aria-label={open ? '关闭菜单' : '打开菜单'}
          onClick={() => setOpen((v) => !v)}
        >
          <span /> <span /> <span />
        </button>

        <nav className={`nav-links ${open ? 'is-open' : ''}`} aria-label="主导航">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
