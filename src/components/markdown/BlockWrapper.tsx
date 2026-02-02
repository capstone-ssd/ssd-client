import { useSidebarNavigation } from '@/hooks/useSidebarNavigation';
import { cn } from '@/utils/cn';

interface BlockWrapperProps {
  blockId: number;
  hasComments: boolean;
  isSelected: boolean;
  children: React.ReactNode;
  className?: string;
  onSelect?: (blockId: number) => void;
}

export default function BlockWrapper({
  blockId,
  hasComments,
  isSelected,
  children,
  className,
  onSelect,
}: BlockWrapperProps) {
  const { openSidebar } = useSidebarNavigation();
  const handleClick = () => {
    onSelect?.(blockId);
    openSidebar('comments', blockId);
  };
  return (
    <button
      data-block-id={blockId}
      onClick={handleClick}
      className={cn(
        'w-full text-left',
        'relative cursor-pointer rounded-lg transition-all duration-200',
        'mb-4 py-2 pl-4',
        isSelected && 'bg-blue-100',
        !isSelected && hasComments && 'bg-yellow-50 hover:bg-yellow-100',
        !isSelected && !hasComments && 'hover:bg-gray-100',
        className
      )}
    >
      {children}
    </button>
  );
}
