import type { SVGProps } from 'react';
const SvgMoveItem = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="13"
    viewBox="0 0 16 13"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M0.500772 3.76842L0.500706 10.4117C0.500695 11.5162 1.39613 12.4117 2.5007 12.4117L12.8998 12.4117C14.0043 12.4117 14.8997 11.5163 14.8998 10.4118L14.9 3.71526C14.9 3.16296 14.4523 2.71523 13.9 2.71523H7.76277L5.689 0.5H1.50038C0.947944 0.5 0.500166 0.947407 0.500334 1.49984C0.500544 2.19664 0.500776 3.11478 0.500772 3.76842Z"
      stroke="black"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

export default SvgMoveItem;
