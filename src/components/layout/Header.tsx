import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import Svglogo from '@/components/icons/logo';
import Svgmenu from '@/components/icons/menu';
import { MENU_TABS, AUTH_TABS } from '@/constants/navigation';
import Button from '@/components/common/Button';

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userName = 'user'; // 서버 데이터 user명 갖고오기
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // 로그아웃 처리 함수, 임시
  // 로그아웃 상태에서 각종 탭에 들어갈 때 로그인 화면으로 넘어가게 하고 싶은데 AI는 헤더에서 탭을 버튼으로 만들어서 Onclick으로 조정하거나 각 페이지에서 하는걸 추천해주는데 다른 분들 의견은 어떤지 궁금합니다.
  // 아니면 로그아웃 상태에선 각종 탭을 안 보이게 하는 방법으로 자연스럽게 로그인으로 유도하는건 별로겟죠
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
          {/* 환영 메시지를 레퍼런스 더 찾아서 개선할 필요가 있겠죠..? 너무 옛날 네이버스러운거같아요 */}
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
              {AUTH_TABS.LOGGED_IN.map((item) => (
                /*로그아웃 버튼 이후 수정 필요*/
                <Button
                  variant="sub2"
                  onClick={handleLogout}
                  className="body-xxsmall min-w-0 bg-white px-2 py-1 text-sm"
                >
                  {item.name}
                </Button>
              ))}
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
          <div className="cursor-pointer transition-opacity duration-200 hover:opacity-70">
            <Svgmenu />
          </div>
        </div>
      </header>
    </>
  );
};
