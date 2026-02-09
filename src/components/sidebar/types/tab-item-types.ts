import React from 'react';
import type { SidebarSearch } from '@/schemas/searchSchemas';

export interface TabItem {
  id: SidebarSearch['sidebar'];
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}
