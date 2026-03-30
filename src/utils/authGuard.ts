import { redirect } from '@tanstack/react-router';
import { getAccessToken } from '@/api/axios';

export function requireAuth() {
  if (!getAccessToken()) {
    throw redirect({ to: '/signup' });
  }
}
