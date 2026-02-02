import { sidebarSchema } from '@/schemas/searchSchemas';
import { createFileRoute, getRouteApi } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';

export const Route = createFileRoute('/extract')({
  component: RouteComponent,
  validateSearch: zodValidator(sidebarSchema),
});

const routeApi = getRouteApi('/extract');

function RouteComponent() {
  const a = routeApi.useSearch();
  return (
    <div>
      Hello "/extract"!
      <p>
        {a.blockId}
        {a.sidebar}
      </p>
    </div>
  );
}
