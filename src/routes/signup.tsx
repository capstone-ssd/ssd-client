import { sidebarSchema } from '@/schemas/searchSchemas';
import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import Svglogo from '@/components/icons/logo';
import Button from '@/components/common/Button';
import Svgkakaologo from '@/components/icons/Kakaologo';
export const Route = createFileRoute('/signup')({
  component: RouteComponent,
  validateSearch: zodValidator(sidebarSchema),
});

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
              className="bg-kakao relative mt-20 flex h-[90px] w-[600px] items-center justify-center"
            >
              <div className="absolute left-8">
                <Svgkakaologo />
              </div>
              <div className="body-large font-bold">카카오 로그인</div>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
