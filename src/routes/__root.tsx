import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { FullPageLoadingOverlay } from '@/components/common/FullPageLoadingOverlay';
import { workspaceSearchSchema } from '@/schemas/searchSchemas';
import { createRootRoute, Outlet, useSearch } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { useLocation } from '@tanstack/react-router';
import { useMutationState } from '@tanstack/react-query';

export const Route = createRootRoute({
  component: RootComponent,
  validateSearch: (search) => workspaceSearchSchema.parse(search),
});

function RootComponent() {
  const { sidebar } = useSearch({ from: '__root__' });
  const isSidebarOpen = !!sidebar;

  const location = useLocation();
  const noHeaderRoutes = ['/signup', '/login'];
  const shouldShowHeader = !noHeaderRoutes.includes(location.pathname);

  const isUploading =
    useMutationState({
      filters: { mutationKey: ['document-upload'], status: 'pending' },
    }).length > 0;

  return (
    <>
      {isUploading && <FullPageLoadingOverlay />}
      <div className="flex min-h-screen flex-col bg-gray-50">
        {shouldShowHeader && <Header />}
        <div className="flex flex-1">
          <main className="flex-1">
            <Outlet />
          </main>

          {isSidebarOpen && <Sidebar />}
        </div>
      </div>
      {import.meta.env.DEV && <TanStackRouterDevtools position="bottom-right" />}
    </>
  );
}
