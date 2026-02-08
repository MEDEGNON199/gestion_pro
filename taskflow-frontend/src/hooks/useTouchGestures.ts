import { useEffect, RefObject } from 'react';

export interface TouchGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  minSwipeDistance?: number;
}

export function useTouchGestures(
  elementRef: RefObject<HTMLElement>,
  options: TouchGestureOptions
) {
  const { onSwipeLeft, onSwipeRight, minSwipeDistance = 50 } = options;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      handleGesture();
    };

    const handleGesture = () => {
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;

      // Only trigger swipe if horizontal movement exceeds vertical movement
      // This prevents conflicts with native scroll
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0 && onSwipeRight) {
          onSwipeRight();
        } else if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft();
        }
      }
    };

    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchend', handleTouchEnd);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [elementRef, onSwipeLeft, onSwipeRight, minSwipeDistance]);
}
