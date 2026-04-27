import { useState, useEffect, useRef } from 'react';

export function useDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggle = (e?: React.MouseEvent) => {
    e?.stopPropagation(); // 이벤트 전파 방지를 위해 인자 추가 가능
    setIsOpen((prev) => !prev);
  };
  const close = () => setIsOpen(false);

  return { isOpen, ref, toggle, close, setIsOpen };
}
