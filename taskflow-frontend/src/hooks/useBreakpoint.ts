import { useState, useEffect } from 'react';

export type Breakpoint = 'mobile' | 'tablet' | 'desktop' | 'wide';

export interface BreakpointState {
  current: Breakpoint;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  width: number;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export function useBreakpoint(): BreakpointState {
  const [width, setWidth] = useState(window.innerWidth);
  const debouncedWidth = useDebounce(width, 150);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const current: Breakpoint = 
    debouncedWidth >= 1280 ? 'wide' :
    debouncedWidth >= 1024 ? 'desktop' :
    debouncedWidth >= 640 ? 'tablet' : 'mobile';

  return {
    current,
    isMobile: debouncedWidth < 640,
    isTablet: debouncedWidth >= 640 && debouncedWidth < 1024,
    isDesktop: debouncedWidth >= 1024,
    width: debouncedWidth,
  };
}
