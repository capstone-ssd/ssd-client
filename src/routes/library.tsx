import { createFileRoute } from '@tanstack/react-router';
import { requireAuth } from '@/utils/authGuard';

export const Route = createFileRoute('/library')({
  component: RouteComponent,
  beforeLoad: () => requireAuth(),
});

function RouteComponent() {
  return <div>Hello "/library"!</div>
}
