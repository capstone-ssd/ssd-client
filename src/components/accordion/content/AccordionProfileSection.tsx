import * as React from 'react';
import SvgProfile from '@/components/icons/Profile';

/**
 * @param userName - 사용자 이름
 * @param userEmail - 사용자 이메일
 * @param timestamp - 작성 시각 (예: "오후 14:30:00")
 * @param children - 사용자 정보 아래에 렌더링될 콘텐츠
 */
export interface AccordionProfileSectionProps {
  userName: string;
  userEmail: string;
  timestamp: string;
  children?: React.ReactNode;
}

const AccordionProfileSection = ({
  userName,
  userEmail,
  timestamp,
  children,
}: AccordionProfileSectionProps) => (
  <section className="flex gap-5">
    <div className="flex w-[38px] shrink-0 flex-col items-center">
      <SvgProfile width={38} height={38} />
    </div>

    <div className="flex flex-1 flex-col gap-5">
      <div className="flex flex-col gap-0.5">
        <span className="text-[18px] leading-normal font-medium text-gray-800">{userName}</span>
        <span className="text-[16px] leading-normal font-normal text-gray-400">{userEmail}</span>
        <span className="text-[14px] leading-normal font-normal text-gray-400">{timestamp}</span>
      </div>
      {children}
    </div>
  </section>
);

export default AccordionProfileSection;
