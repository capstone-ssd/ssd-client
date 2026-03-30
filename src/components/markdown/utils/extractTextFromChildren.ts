import type { ReactNode, ReactElement } from 'react';

/**
 * React children에서 순수 텍스트를 재귀적으로 추출합니다
 * strong, em, code 등 중첩된 요소에서도 텍스트를 추출합니다
 * @param children - React children (string, number, array, ReactElement 등)
 * @returns 추출된 순수 텍스트
 */
export function extractTextFromChildren(children: ReactNode): string {
  if (typeof children === 'string') {
    return children;
  }

  if (typeof children === 'number') {
    return String(children);
  }

  if (Array.isArray(children)) {
    return children.map(extractTextFromChildren).join('');
  }

  // React Element인 경우 (strong, em, code 등)
  if (children && typeof children === 'object' && 'props' in children) {
    const element = children as ReactElement<{ children?: ReactNode }>;
    return extractTextFromChildren(element.props.children);
  }

  return '';
}
