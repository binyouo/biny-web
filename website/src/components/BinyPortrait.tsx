import { useEffect, useRef, useState } from "react";
import portraitUrl from "../assets/biny-portrait.png";
import portraitBlinkUrl from "../assets/biny-portrait-blink.png";
import { cn } from "../lib/utils";

/**
 * 首页大号白兔：平时睁眼，隔几秒眨一下。
 * 和桌面端 AppIcon 用同一套「睁眼图 + 闭眼图叠加」的做法，
 * 只是这里用大尺寸原图，动画节奏更松弛。
 */
export function BinyPortrait({ size = 320, className, sleepy = false }: { size?: number; className?: string; sleepy?: boolean }) {
  const [blinking, setBlinking] = useState(false);
  const timerRef = useRef<number | null>(null);
  const reducedRef = useRef(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedRef.current = media.matches;
    const onChange = () => { reducedRef.current = media.matches; };
    media.addEventListener("change", onChange);

    let cancelled = false;
    const schedule = (delay: number) => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        if (cancelled) return;
        if (reducedRef.current || sleepy) { schedule(4000); return; }
        setBlinking(true);
        window.setTimeout(() => setBlinking(false), 340);
        schedule(2800 + Math.random() * 3400);
      }, delay);
    };
    schedule(1400);
    return () => { cancelled = true; if (timerRef.current) window.clearTimeout(timerRef.current); media.removeEventListener("change", onChange); };
  }, [sleepy]);

  return (
    <span
      aria-hidden="true"
      className={cn("biny-portrait", className)}
      data-blink={blinking || sleepy}
      style={{ width: size, height: size }}
    >
      <img alt="" draggable={false} height={size} src={portraitUrl} width={size} />
      <img alt="" className="biny-portrait-closed" draggable={false} height={size} src={portraitBlinkUrl} width={size} />
    </span>
  );
}
