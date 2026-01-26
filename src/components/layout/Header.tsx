import { Link } from '@tanstack/react-router';

export const Header = () => {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container-custom">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary-600 h-8 w-8 rounded-lg" />
            <span className="body-nav font-bold text-gray-900">테스트용 헤더</span>
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              to="/"
              className="body-medium text-gray-600 transition hover:text-gray-900"
              activeProps={{ className: 'text-primary-600 font-semibold' }}
            >
              홈
            </Link>
            <Link
              to="/extract"
              className="body-medium text-gray-600 transition hover:text-gray-900"
              activeProps={{ className: 'text-primary-600 font-semibold' }}
            >
              추출하기
            </Link>
            <Link
              to="/about"
              className="body-medium text-gray-600 transition hover:text-gray-900"
              activeProps={{ className: 'text-primary-600 font-semibold' }}
            >
              소개
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};
