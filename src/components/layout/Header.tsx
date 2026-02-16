import React from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import Svglogo from '@/components/icons/logo';
import Svgmenu from '@/components/icons/menu';

export const Header = () => {
  const location = useLocation();
  const userName = 'user'; // 서버 데이터 user명 갖고오기
  const isLoggedIn = true; // 임시, 로그인 상태일 때 true로

  const menuItems = [
    { name: '작성하기', path: '/editor' },
    { name: '평가하기', path: '/extract' },
    { name: '라이브러리', path: '/library' },
    { name: '일정관리', path: '/schedule' },
    { name: '커뮤니티', path: '/community' },
  ];

  return (
    <>
      {/*상단 바 유저명 (임시 작성, 코멘트 부탁드리겠습니다) */}
      <div className="flex h-8 w-full items-center justify-end bg-white px-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-500">{userName}님 환영합니다.</span>
        </div>
      </div>
      <header className="grid h-[100px] w-full grid-cols-[1fr_3fr_1fr] items-center border-b border-gray-200 bg-white whitespace-nowrap">
        <div className="flex justify-start">
          <Link to="/">
            <Svglogo />
          </Link>
        </div>
        <nav className="flex justify-center">
          <ul className="flex list-none items-center gap-25">
            {/*화면에 따라 다르게 보일 거라 수정이 더 필요합니다*/}
            {menuItems.map((item) => {
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
              <Link to="/logout" className="transition-colors duration-200 hover:text-gray-900">
                로그아웃
              </Link>
            </div>
          ) : (
            // 로그인 로그아웃 회원가입은 각각 link를 달았는데 혹시 다른 방법이 있을까요..?
            <div className="body-xxsmall flex items-center gap-3 font-medium text-gray-600">
              <Link to="/login" className="transition-colors duration-200 hover:text-gray-900">
                로그인
              </Link>
              <span className="text-gray-200">|</span>
              <Link to="/signup" className="transition-colors duration-200 hover:text-gray-900">
                회원가입
              </Link>
            </div>
          )}
          <div className="cursor-pointer transition-opacity duration-200 hover:opacity-70">
            <Svgmenu />
          </div>
        </div>
      </header>
    </>
  );
};
