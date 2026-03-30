import { useNavigate, useSearch, useRouterState } from '@tanstack/react-router';
import type { SidebarSearch } from '@/schemas/searchSchemas';

export function useSidebarNavigation() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false });
  const pathname = useRouterState({ select: (s) => s.location.pathname });

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

  const handleTabClick = (tabId: SidebarSearch['sidebar']) => {
    if (!tabId) return;

    if (search.sidebar === tabId) return;

    openSidebar(tabId, search.blockId);
  };

  const firstSegment = pathname.split('/')[1];
  const currentRole: 'writer' | 'evaluator' | undefined =
    firstSegment === 'evaluate' ? 'evaluator' : firstSegment === 'write' ? 'writer' : undefined;

  return {
    openSidebar,
    closeSidebar,
    currentSidebar: search.sidebar,
    currentBlockId: search.blockId,
    currentRole,
    isBlockSelected: (id: number) => search.blockId === id,
    handleTabClick,
  };
}
