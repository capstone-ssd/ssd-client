import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { workspaceSearchSchema } from '@/schemas/searchSchemas';
import { createRootRoute, Outlet, useSearch } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { useLocation } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: RootComponent,
  validateSearch: (search) => workspaceSearchSchema.parse(search),
});

function RootComponent() {
  const { sidebar } = useSearch({ from: '__root__' });
  const isSidebarOpen = !!sidebar;

  // 헤더를 제외할 경로 설정
  const location = useLocation();
  const noHeaderRoutes = ['/signup', '/login'];
  const shouldShowHeader = !noHeaderRoutes.includes(location.pathname);

  return (
    <>
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
