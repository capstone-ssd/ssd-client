import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
    'w-[130px] h-[40px] min-h-[40px] font-small heading-small inline-flex items-center justify-center text-center transition-colors duration-200 ease-in-out disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:bg-neutral-200 disabled:text-neutral-600 transition-all duration-200 hover:brightness-95 active:scale-[0.98] active:brightness-90' ,
    {
        variants: {
            variant: {
                main: "bg-[var(--color-primary-400)] text-gray-800",
                normal: "bg-white text-gray-800 border border-gray-100",
                accent: "bg-white text-[#FF2410] border border-[#FF2410]",
                disabled: "bg-gray-300 text-gray-50 cursor-not-allowed",
                sub: "bg-gray-700 text-white",
                sub2: "bg-gray-50 text-gray-800",
            },
            rounded: {
                none: "rounded-lg",
                full: "rounded-full",
            },
        },
        defaultVariants: {
            variant: 'main',
            rounded: 'none',
        }
    },
);

export interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    children: ReactNode; 
}

const Button = ({
    children, 
    className,
    variant,
    rounded,
    disabled,
    type = 'button',
    ...props
}: ButtonProps) => {
    const combinedClassName = `${buttonVariants({ variant, rounded })} ${className || ''}`;

    return (
        <button
            type={type}
            className={combinedClassName} 
            disabled={variant === 'disabled'}
            aria-live="polite"
            aria-disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;