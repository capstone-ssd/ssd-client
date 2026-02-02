import type { SidebarSearch } from '@/schemas/searchSchemas';
import { getRouteApi } from '@tanstack/react-router';

const routeApi = getRouteApi('/extract');
export function useSidebarNavigation() {
  const navigate = routeApi.useNavigate();

  const openSidebar = (sidebar: SidebarSearch['sidebar'], blockId: SidebarSearch['blockId']) => {
    navigate({
      search: (prev) => ({
        ...prev,
        sidebar,
        blockId,
      }),
    });
  };

  const closeSidebar = () => {
    navigate({
      search: (prev) => {
        const { sidebar, blockId, ...rest } = prev;
        return rest;
      },
    });
  };
  return { openSidebar, closeSidebar };
}
