import Svglogo from '@/components/icons/logo';
import { createFileRoute } from '@tanstack/react-router';
import Button from '@/components/common/Button';
import Svgkakaologo from '@/components/icons/KakaoLogo';
export const Route = createFileRoute('/signup')({
  component: RouteComponent,
});

const kakaologin = () => {
  window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth/kakao/login`;
};

function RouteComponent() {
  return (
    <>
      <div className="flex h-full w-full bg-white">
        <div className="flex h-full w-full flex-col items-center justify-center">
          <Svglogo className="h-[100px] w-[440px] object-contain" />
          <div className="bold body-large mt-14 text-center text-gray-900">
            간편하게 로그인하고
            <br />
            심사임당의 서비스를 이용해보세요
          </div>
          <div className="flex w-full justify-center">
            <Button
              variant="main"
              rounded="small"
              onClick={kakaologin}
              className="bg-kakao relative mt-20 flex h-[90px] w-[600px] items-center justify-center rounded-[12px]"
            >
              <div className="absolute left-8">
                <Svgkakaologo />
              </div>
              <div className="body-large font-bold text-gray-900">카카오 로그인</div>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
