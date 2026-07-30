import { Link } from 'react-router-dom';
import GuaIcon from '../components/GuaIcon';

export default function NotFound() {
  return (
    <div className="page not-found">
      <div className="not-found-gua" aria-hidden="true">
        <GuaIcon pattern="010" size={96} />
      </div>
      <h1 className="not-found-title">页面未找到</h1>
      <p className="not-found-desc">你访问的页面不存在，可能已被移动或链接有误。</p>
      <Link to="/" className="btn btn-primary">
        返回首页
      </Link>
    </div>
  );
}
