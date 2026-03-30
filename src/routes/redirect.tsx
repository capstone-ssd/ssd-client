import { useEffect } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { setAccessToken } from '@/api/axios';

export const Route = createFileRoute('/redirect')({
  component: RouteComponent,
  beforeLoad: () => {
    const params = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = params.get('accessToken');
    console.log(accessToken);
    if (accessToken) {
      setAccessToken(accessToken);
    }
  },
});

function RouteComponent() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate({ to: '/', replace: true });
  }, [navigate]);

  return null;
}
