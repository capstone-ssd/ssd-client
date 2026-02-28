import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { workspaceSearchSchema } from '@/schemas/searchSchemas';
import { createRootRoute, Outlet, useSearch } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

export const Route = createRootRoute({
  component: RootComponent,
  validateSearch: (search) => workspaceSearchSchema.parse(search),
});

function RootComponent() {
  const { sidebar } = useSearch({ from: '__root__' });
  const isSidebarOpen = !!sidebar;

  return (
    <>
      <div className="flex min-h-screen flex-col bg-gray-50">
        <Header />
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
