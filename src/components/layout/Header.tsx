import React from 'react';
import Svglogo from '@/components/icons/logo';

export const Header = () => {
  return (
    <header className="h-[100px] w-full border-b border-gray-200 bg-white">
      <div className="container-custom">
        <div className="flex h-full items-center justify-between">
          <div className="flex items-center gap-2">
            <Svglogo className="h-12 w-auto" aria-label="심사임당 로고" />
          </div>
          <nav>
            <ul className="flex items-center gap-10">
              <li className="test-primary-400 border-primary-400 border-b-2 pb-1 font-bold">
                작성하기
              </li>
              <li>평가하기</li>
              <li>라이브러리</li>
              <li>일정관리</li>
              <li>커뮤니티</li>
            </ul>
          </nav>
          <div className="flex items-center gap-4">
            <button className="text-sm">로그인</button>
            <div className="bg-primary-400 flex items-center gap-1 rounded-full px-4 py-2 text-sm font-bold">
              <button className="h-4 w-4">user</button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
