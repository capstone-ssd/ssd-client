import { type ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  mode?: 'main' | 'normal' | 'accent' | 'disabled' | 'sub' | 'sub2';
  radius?: 'none' | 'full';
  text: string;
}

export const CommonButton = ({ 
  mode = 'main',
  radius = 'full', 
  text, 
  className = '', 

  ...props 
}: ButtonProps) => {
  const modeStyles = {
    main: "bg-[var(--color-primary-400)] text-gray-800 heading-small",
    normal: "bg-white text-gray-800 border border-gray-100 heading-small",
    accent: "bg-white text-[#FF2410] border border-[#FF2410] heading-small",
    disabled: "bg-gray-300 text-gray-50 cursor-not-allowed heading-small",
    sub: "bg-gray-700 text-white heading-small",
    sub2: "bg-gray-50 text-gray-800 heading-small",
  };

  const radiusStyles = {
    none: "rounded-lg",
    full: "rounded-full",
  };

  return (
    <button 
      type="button"
      className={`w-[130px] h-[40px] flex items-center justify-center font-medium transition-all ${modeStyles[mode]} ${radiusStyles[radius]} ${className}`}
      disabled={mode === 'disabled'}
      {...props}
    >
      {text}
    </button>
  );
};