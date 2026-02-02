import { cn } from '@/utils/cn';
import { useNavigate } from '@tanstack/react-router';

interface BlockWrapperProps {
  blockId: number;
  hasComments: boolean;
  isSelected: boolean;
  children: React.ReactNode;
  className?: string;
}

export default function BlockWrapper({
  blockId,
  hasComments,
  isSelected,
  children,
  className,
}: BlockWrapperProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate({
      to: '.',
      search: (prev) => ({
        ...prev,
        sidebar: 'comments',
        blockId: blockId,
      }),
    });
  };

  return (
    <div
      data-block-id={blockId}
      onClick={handleClick}
      className={cn(
        'relative cursor-pointer rounded-lg transition-all duration-200',
        'mb-4 py-2 pl-4',
        isSelected && 'bg-blue-100',
        !isSelected && hasComments && 'bg-yellow-50 hover:bg-yellow-100',
        !isSelected && !hasComments && 'hover:bg-gray-100',
        className
      )}
    >
      {children}
    </div>
  );
}
