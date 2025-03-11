import { useEffect } from 'react';

export function useOnClickOutside(
  ref: React.RefObject<HTMLDivElement | HTMLElement | null>,
  handler: (currentTarget?: HTMLElement | null, el?: HTMLDivElement | HTMLElement) => void
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target as HTMLDivElement)) return;
      handler(event.target as HTMLElement, ref.current);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

export function useSensorKeyboard(
  keys: string[],
  triggerFn: (key: string, e?: KeyboardEvent) => void,
  options?: { usingCtrl?: boolean }
) {
  useEffect(() => {
    const sensorListener = (e: KeyboardEvent) => {
      const keyPressed = [...keys].indexOf(e.key) > -1;

      if (options?.usingCtrl && e.ctrlKey && keyPressed) {
        triggerFn(`CTRL + ${e.key}`, e);
        return;
      }
      if (keyPressed) triggerFn(e.key, e);
    };
    window.addEventListener('keydown', sensorListener);

    return () => {
      window.removeEventListener('keydown', sensorListener);
    };
  }, [keys, options?.usingCtrl, triggerFn]);
}
