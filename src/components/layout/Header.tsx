export const Header = () => {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container-custom">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary-600 h-8 w-8 rounded-lg" />
            <span className="body-nav font-bold text-gray-900">테스트용 헤더</span>
          </div>

          <nav className="flex items-center gap-6">
            <div className="body-medium text-gray-600 transition hover:text-gray-900">홈</div>
            <div className="body-medium text-gray-600 transition hover:text-gray-900">추출하기</div>
            <div className="body-medium text-gray-600 transition hover:text-gray-900">소개</div>
          </nav>
        </div>
      </div>
    </header>
  );
};
