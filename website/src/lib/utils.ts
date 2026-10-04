import { useCallback, useEffect, useRef, useState } from "react";

export function cn(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}

/** 元素首次进入视口后返回 true，用于渐显；不重复触发。 */
export function useInView<T extends HTMLElement>(rootMargin = "-12% 0px"): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || shown) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin, threshold: 0.05 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin, shown]);

  return [ref, shown];
}

export function useCopy(resetMs = 1600): ["idle" | "copied" | "error", (value: string) => void] {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const timer = useRef<number | undefined>(undefined);
  const active = useRef(false);

  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
      window.clearTimeout(timer.current);
    };
  }, []);

  const copy = useCallback(
    (value: string) => {
      const done = () => {
        if (!active.current) return;
        setStatus("copied");
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setStatus("idle"), resetMs);
      };
      if (navigator.clipboard?.writeText) {
        void navigator.clipboard.writeText(value).then(done).catch(() => { if (active.current) setStatus("error"); });
        return;
      }
      const area = document.createElement("textarea");
      area.value = value;
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.append(area);
      area.select();
      try {
        if (document.execCommand("copy")) done();
        else setStatus("error");
      } catch {
        setStatus("error");
      } finally {
        area.remove();
      }
    },
    [resetMs]
  );

  return [status, copy];
}

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
