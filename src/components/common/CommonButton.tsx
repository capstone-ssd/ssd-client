import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';


const buttonVariants = cva(
    'w-[130px] h-[40px] min-h-[40px] body-small inline-flex items-center justify-center text-center transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 hover:brightness-95 active:scale-[0.98] active:brightness-90',
    {
        variants: {
            variant: { 
                main: "bg-[var(--color-primary-400)] text-gray-800",
                normal: "bg-white text-gray-800 border border-gray-100",
                accent: "bg-white text-[#FF2410] border border-[#FF2410]", 
                sub: "bg-gray-700 text-white",
                sub2: "bg-gray-50 text-gray-800",
            },
            rounded: { 
                small: "rounded-[8px]",
                full: "rounded-[1000px]",
            },
            isDisabled: { 
                true: "!bg-gray-300 !text-gray-50 cursor-not-allowed hover:!brightness-100 active:!scale-100",
                false: ""
            },  
        },

    }
);
/**
 * Common Button Component
 * * 프로젝트의 디자인 시스템을 따르는 공통 버튼 컴포넌트입니다.
 * * @param variant - 버튼 모양 설정: 
 * - 'main': 메인 배경 (Primary 400)
 * - 'normal': 흰색 배경 + 회색 테두리
 * - 'accent': 흰색 배경 + 빨간색 테두리
 * - 'sub': 진회색 배경
 * - 'sub2': 연회색 배경
 * @param rounded - 곡률 설정: 'small' (8px), 'full' (1000px)
 * @param children - 버튼 내부 텍스트 또는 요소
 * @param className - 추가 커스텀 CSS 클래스
 * @param disabled - 비활성화 상태 
 * ```tsx
 * <Button variant="main" rounded="full">확인</Button>
 * <Button variant="normal" disabled>비활성화 버튼</Button>
 * ```
 */
export interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    children: ReactNode; 
}

const Button = ({ children, className, variant, rounded, disabled, ...props }: ButtonProps) => {
    const combinedClassName = buttonVariants({ 
        variant, 
        rounded, 
        isDisabled: !!disabled, 
        className 
    });

    return (
        <button
            {...props}
            disabled={disabled} 
            className={combinedClassName} 
            aria-disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;