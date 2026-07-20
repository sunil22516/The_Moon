import { useRef, useCallback } from 'react';

// Detects taps, long-press + horizontal drag (for seek), and provides drag delta
export function useSwipe({ onTap, onSeekStart, onSeekMove, onSeekEnd } = {}) {
  const touchRef = useRef({ startX: 0, startY: 0, startTime: 0, isLongPress: false, isSeeking: false, timer: null });

  const onTouchStart = useCallback((e) => {
    const touch = e.touches[0];
    const ref = touchRef.current;
    ref.startX = touch.clientX;
    ref.startY = touch.clientY;
    ref.startTime = Date.now();
    ref.isLongPress = false;
    ref.isSeeking = false;

    // Long-press detection (300ms)
    ref.timer = setTimeout(() => {
      ref.isLongPress = true;
      onSeekStart?.();
    }, 300);
  }, [onSeekStart]);

  const onTouchMove = useCallback((e) => {
    const touch = e.touches[0];
    const ref = touchRef.current;
    const dx = touch.clientX - ref.startX;
    const dy = touch.clientY - ref.startY;

    // If moved significantly before long-press, cancel it (user is scrolling)
    if (!ref.isLongPress && (Math.abs(dx) > 10 || Math.abs(dy) > 10)) {
      clearTimeout(ref.timer);
    }

    // If long-press active, track horizontal drag for seeking
    if (ref.isLongPress) {
      e.preventDefault();
      ref.isSeeking = true;
      onSeekMove?.(dx);
    }
  }, [onSeekMove]);

  const onTouchEnd = useCallback((e) => {
    const ref = touchRef.current;
    clearTimeout(ref.timer);

    if (ref.isSeeking) {
      onSeekEnd?.();
    } else if (!ref.isLongPress) {
      const elapsed = Date.now() - ref.startTime;
      const touch = e.changedTouches[0];
      const dx = Math.abs(touch.clientX - ref.startX);
      const dy = Math.abs(touch.clientY - ref.startY);
      // Quick tap: minimal movement, under 250ms
      if (elapsed < 250 && dx < 15 && dy < 15) {
        onTap?.();
      }
    }

    ref.isLongPress = false;
    ref.isSeeking = false;
  }, [onTap, onSeekEnd]);

  // Mouse equivalents for desktop
  const mouseRef = useRef({ isDown: false, startX: 0, timer: null, isLongPress: false, isSeeking: false });

  const onMouseDown = useCallback((e) => {
    const ref = mouseRef.current;
    ref.isDown = true;
    ref.startX = e.clientX;
    ref.isLongPress = false;
    ref.isSeeking = false;
    ref.timer = setTimeout(() => {
      ref.isLongPress = true;
      onSeekStart?.();
    }, 300);
  }, [onSeekStart]);

  const onMouseMove = useCallback((e) => {
    const ref = mouseRef.current;
    if (!ref.isDown) return;
    const dx = e.clientX - ref.startX;
    if (!ref.isLongPress && Math.abs(dx) > 10) clearTimeout(ref.timer);
    if (ref.isLongPress) {
      ref.isSeeking = true;
      onSeekMove?.(dx);
    }
  }, [onSeekMove]);

  const onMouseUp = useCallback((e) => {
    const ref = mouseRef.current;
    if (!ref.isDown) return;
    clearTimeout(ref.timer);
    ref.isDown = false;
    if (ref.isSeeking) {
      onSeekEnd?.();
    } else if (!ref.isLongPress) {
      onTap?.();
    }
    ref.isLongPress = false;
    ref.isSeeking = false;
  }, [onTap, onSeekEnd]);

  return {
    touchHandlers: { onTouchStart, onTouchMove, onTouchEnd },
    mouseHandlers: { onMouseDown, onMouseMove, onMouseUp },
  };
}
