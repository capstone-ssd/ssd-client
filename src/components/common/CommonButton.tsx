import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
    'w-[130px] h-[40px] min-h-[40px] body-small inline-flex items-center justify-center text-center transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 hover:brightness-95 active:scale-[0.98] active:brightness-90',
    { // CSS 파일 임의 수정 (weight 600 -> 400)
        variants: {
            variant: { // 버튼 모양 설정
                main: "bg-[var(--color-primary-400)] text-gray-800",
                normal: "bg-white text-gray-800 border border-gray-100",
                accent: "bg-white text-[#FF2410] border border-[#FF2410]",
                sub: "bg-gray-700 text-white",
                sub2: "bg-gray-50 text-gray-800",
            },
            rounded: { // radius 여부 설정
                small: "rounded-[8px]",
                full: "rounded-[1000px]",
            },
            isDisabled: {
                true: "!bg-gray-300 !text-gray-50 cursor-not-allowed hover:!brightness-100 active:!scale-100",
                false: ""
            },
        },
        defaultVariants: { 
            variant: 'main',
            rounded: 'small',
        }
    }
);

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