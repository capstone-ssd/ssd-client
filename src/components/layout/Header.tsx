import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { MENU_TABS, AUTH_TABS } from '@/constants/navigation';
import SvgHeaderMenu from '../icons/HeaderMenu';
import SvgMainLogo from '../icons/MainLogo';

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userName = 'user';
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate({ to: '/' });
    alert('로그아웃 되었습니다.');
    console.log('로그아웃');
  };

  return (
    <>
      <div className="flex h-8 w-full items-center justify-end bg-white px-6">
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <span className="text-xs font-medium text-gray-500">{userName}님 환영합니다.</span>
          ) : (
            <span className="text-xs font-medium text-gray-500">로그인이 필요한 서비스입니다.</span>
          )}
        </div>
      </div>
      <header className="grid h-[100px] w-full grid-cols-[1fr_3fr_1fr] items-center border-b border-gray-200 bg-white whitespace-nowrap">
        <div className="flex justify-start">
          <Link to="/">
            <SvgMainLogo />
          </Link>
        </div>
        <nav className="flex justify-center">
          <ul className="flex list-none items-center gap-25">
            {MENU_TABS.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`body-nav pb-2 ${
                      isActive ? 'text-primary-400 border-b-4 font-bold' : 'font-bold text-gray-900'
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="flex items-center justify-center gap-6">
          {isLoggedIn ? (
            <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
              <button
                onClick={handleLogout}
                className="body-xxsmall min-w-0 bg-white px-2 py-1 text-sm hover:text-gray-900"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <div className="body-xxsmall flex items-center gap-3 font-medium text-gray-600">
              {AUTH_TABS.LOGGED_OUT.map((item, index) => (
                <div key={item.path} className="flex items-center gap-3">
                  <Link
                    to={item.path}
                    className="transition-colors duration-200 hover:text-gray-900"
                  >
                    {item.name}
                  </Link>
                  {index < AUTH_TABS.LOGGED_OUT.length - 1 && (
                    <span className="text-gray-200">|</span>
                  )}
                </div>
              ))}
            </div>
          )}
          <div className="transition-opacity duration-200 hover:opacity-70">
            <SvgHeaderMenu />
          </div>
        </div>
      </header>
    </>
  );
};
