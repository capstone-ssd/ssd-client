import React from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import Svglogo from '@/components/icons/logo';
import Svgmenu from '@/components/icons/menu';

export const Header = () => {
  const location = useLocation(); // 현재 브라우저 주소(URL)를 가져옴

  const menuItems = [
    { name: '작성하기', path: '/editor' },
    { name: '평가하기', path: '/extract' },
    { name: '라이브러리', path: '/library' },
    { name: '일정관리', path: '/schedule' },
    { name: '커뮤니티', path: '/community' },
  ];

  return (
    <header className="grid h-[100px] w-full grid-cols-[1fr_3fr_1fr] items-center border-b border-gray-200 bg-white">
      {/* [1] 좌측 로고 (1fr) */}
      <div className="flex justify-start">
        <Link to="/">
          <Svglogo className="h-10 w-auto" />
        </Link>
      </div>

      {/* [2] 중앙 메뉴 (3fr) */}
      <nav className="flex justify-center">
        <ul className="flex list-none items-center gap-40">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`pb-2 text-lg ${
                    isActive ? 'text-primary-400 border-b-4 font-bold' : 'text-gray-400'
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* [3] 우측 영역 (1fr) */}
      <div className="flex items-center justify-end gap-6">
        <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
          <Link to="/login">로그인</Link>
          <span className="text-gray-300">|</span>
          <Link to="/signup">회원가입</Link>
        </div>
        <span className="text-sm font-medium text-gray-700">user</span>
        <div className="cursor-pointer">
          <Svgmenu />
        </div>
      </div>
    </header>
  );
};
