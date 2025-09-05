import { useEffect, useRef, type RefObject } from "react";

type EventType = "mousedown" | "touchstart";

export const useClickAway = <T extends HTMLElement>(
  handler: (event: MouseEvent | TouchEvent) => void
): RefObject<T> => {
  const ref = useRef<T>(null as unknown as T);
  const savedHandler = useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        savedHandler.current(event);
      }
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref]);

  return ref;
};
