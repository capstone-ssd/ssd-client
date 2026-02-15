import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Svglogo from '@/components/icons/ogo';

export const Header = () => {
  const location = useLocation(); // 현재 브라우저 주소(URL)를 가져옴

  const menuItems = [
    { name: '작성하기', path: '/editor' },
    { name: '평가하기', path: '/evaluation' },
    { name: '라이브러리', path: '/library' },
    { name: '일정관리', path: '/schedule' },
    { name: '커뮤니티', path: '/community' },
  ];

  return (
    <header className="h-[100px] w-full border-b border-gray-200 bg-white">
      <div className="container-custom h-full">
        <div className="flex h-full items-center justify-between px-8">
          {/* 1. 로고 (클릭 시 홈으로) */}
          <div className="flex items-center gap-2">
            <Link to="/">
              <Svglogo className="h-10 w-auto" />
            </Link>
            <span className="text-xl font-bold text-gray-800">심사임당</span>
          </div>

          {/* 2. 중앙 탭 (주소에 따라 노란색 불이 들어옴) */}
          <nav>
            <ul className="flex list-none items-center gap-10">
              {menuItems.map((item) => {
                // 현재 주소가 메뉴의 path와 똑같으면 활성화!
                const isActive = location.pathname === item.path;

                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`pb-2 text-lg transition-all duration-200 ${
                        isActive
                          ? 'border-b-4 border-[#EAB308] font-bold text-[#EAB308]' // 시안 속 노란색
                          : 'font-medium text-gray-400 hover:text-gray-600' // 선택 안 된 회색
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* 3. 우측 유저 메뉴 */}
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm text-gray-500">
              로그인
            </Link>
            <div className="flex items-center gap-2 rounded-full bg-[#EAB308] px-4 py-2">
              <span className="font-bold">user</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
