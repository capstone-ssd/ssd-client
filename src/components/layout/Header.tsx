import { useState } from 'react';
import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { MENU_TABS } from '@/constants/navigation';
import SvgMenu from '../icons/menu';
import SvgMainLogo from '../icons/MainLogo';
import { useMeQuery } from '@/hooks/useMeQuery';
import { removeAccessToken, getAccessToken } from '@/api/axios';
import DocUploadModal from '@/components/modal/DocUploadModal';
import { useDocumentUpload } from '@/hooks/useDocumentUpload';
import { useFolderQuery } from '@/hooks/useFolderQuery';

type UploadMode = 'writing' | 'evaluate';
const MODAL_PATHS = new Set(['/write', '/evaluate']);

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isLoggedIn, setIsLoggedIn] = useState(!!getAccessToken());
  const { data: me } = useMeQuery();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMode, setActiveMode] = useState<UploadMode>('writing');
  const { mutate: upload, isPending } = useDocumentUpload();
  const { data: folderData, isLoading: isFolderLoading } = useFolderQuery();

  const handleLogout = () => {
    removeAccessToken();
    queryClient.removeQueries({ queryKey: ['me'] });
    setIsLoggedIn(false);
  };

  function openModal(mode: UploadMode) {
    if (!getAccessToken()) {
      navigate({ to: '/signup' });
      return;
    }
    setActiveMode(mode);
    setIsModalOpen(true);
  }

  function handleConfirm(file: File | null, folderId: number | null) {
    if (!file) return;
    upload(
      {
        file,
        folderId,
        mode: activeMode,
        purpose: activeMode === 'writing' ? 'WRITING' : 'EVALUATION',
      },
      { onSuccess: () => setIsModalOpen(false) }
    );
  }

  return (
    <>
      <header className="flex h-[100px] w-full shrink-0 items-stretch border-b border-[#c4c4c4] bg-white">
        {/* 좌: 로고 */}
        <div className="flex w-[356px] shrink-0 items-center pl-10">
          <Link to="/">
            <SvgMainLogo width={200} height={55} />
          </Link>
        </div>

        {/* 중: 네비게이션 탭 */}
        <nav className="flex flex-1 items-stretch">
          <ul className="flex w-full list-none items-stretch">
            {MENU_TABS.map((item) => {
              const isActive =
                location.pathname === item.path || location.pathname.startsWith(item.path + '/');
              const tabClass = `relative flex w-full items-center justify-center text-[28px] font-medium whitespace-nowrap ${
                isActive ? 'text-[#f5c816]' : 'text-black'
              }`;
              const activeBar = isActive && (
                <span className="absolute right-0 bottom-0 left-0 h-1 bg-[#f5c816]" />
              );
              return (
                <li key={item.path} className="flex flex-1 items-stretch">
                  {MODAL_PATHS.has(item.path) ? (
                    <button
                      type="button"
                      className={tabClass}
                      onClick={() => openModal(item.path === '/write' ? 'writing' : 'evaluate')}
                    >
                      {item.name}
                      {activeBar}
                    </button>
                  ) : (
                    <Link to={item.path} className={tabClass}>
                      {item.name}
                      {activeBar}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* 우: 유저 영역 + 햄버거 */}
        <div className="flex w-[400px] shrink-0 items-center justify-end gap-6 pr-8">
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <div className="flex h-10 items-center gap-2 rounded-full bg-[#f5c816] px-4">
                <span className="text-[20px] font-semibold text-black">{me?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-[15.6px] font-medium text-[#363636] hover:text-black"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <div className="flex items-center">
              <Link
                to="/signup"
                className="px-3 text-[15.6px] font-medium text-[#363636] hover:text-black"
              >
                로그인
              </Link>
              <span className="h-3 w-px bg-[#cccccc]" aria-hidden="true" />
              <Link
                to="/signup"
                className="px-3 text-[15.6px] font-medium text-[#363636] hover:text-black"
              >
                회원가입
              </Link>
            </div>
          )}
          <button type="button" aria-label="메뉴 열기">
            <SvgMenu className="h-[23px] w-[30px] text-black" />
          </button>
        </div>
      </header>

      <DocUploadModal
        isOpen={isModalOpen}
        data={folderData ?? null}
        isLoading={isFolderLoading || isPending}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
      />
    </>
  );
};
