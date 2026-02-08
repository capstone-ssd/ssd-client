import { useNavigate, useSearch } from '@tanstack/react-router';
import type { SidebarSearch } from '@/schemas/searchSchemas';

export function useSidebarNavigation() {
  const navigate = useNavigate();

  const search = useSearch({ strict: false });

  const openSidebar = (sidebar: SidebarSearch['sidebar'], blockId: SidebarSearch['blockId']) => {
    navigate({
      to: '.',
      search: (prev: Record<string, unknown>) => ({
        ...prev,
        sidebar,
        blockId,
      }),
    });
  };

  const closeSidebar = () => {
    navigate({
      to: '.',
      search: (prev: Record<string, unknown>) => ({
        ...prev,
        sidebar: undefined,
        blockId: undefined,
      }),
    });
  };

  return {
    openSidebar,
    closeSidebar,
    currentSidebar: search.sidebar,
    currentBlockId: search.blockId,
    isBlockSelected: (id: number) => search.blockId === id,
  };
}
