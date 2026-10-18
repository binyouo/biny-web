import { useEffect, useRef } from "react";
import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/utils";

/** Scroll only writes CSS variables; the React tree stays out of the animation loop. */
export function useScrollChoreography() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const stage = node.querySelector<HTMLElement>(".home-stage-inner");
    let frame = 0;
    const paint = () => {
      frame = 0;
      const progress = Math.min(1, Math.max(0, window.scrollY / Math.max(1, node.scrollHeight - window.innerHeight)));
      node.style.setProperty("--page-progress", String(progress));
      if (stage) {
        const progress = reduced.matches ? 1 : Math.min(1, Math.max(0, (window.innerHeight - stage.getBoundingClientRect().top) / (window.innerHeight * .65)));
        stage.style.setProperty("--stage-enter", String(progress));
      }
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(paint); };
    paint();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reduced.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reduced.removeEventListener("change", schedule);
    };
  }, []);
  return root;
}

/**
 * 滚动渐显：把页面内 [data-reveal] 元素交给 IntersectionObserver，进场后置 data-revealed。
 * 返回的 ref 挂在页面根节点上：在页面挂载后观察现有分区。
 */
export function useScrollReveal() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const nodes = [...(root.current?.querySelectorAll<HTMLElement>("[data-reveal]") ?? [])];
    if (!nodes.length) return;
    const show = (node: HTMLElement) => { node.dataset.revealed = "true"; };
    if (typeof IntersectionObserver === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      nodes.forEach(show);
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        show(entry.target as HTMLElement);
        observer.unobserve(entry.target);
      }
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.1 });
    for (const node of nodes) observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return root;
}

export interface RevealProps extends Omit<HTMLAttributes<HTMLElement>, "children" | "style"> {
  children: ReactNode;
  className?: string;
  /** 延迟毫秒，用于同组元素错开入场。 */
  delay?: number;
  as?: "div" | "section" | "article" | "li" | "header" | "figure";
  id?: string;
  ariaLabel?: string;
}

export function Reveal({ children, className, delay = 0, as = "div", id, ariaLabel, ...rest }: RevealProps) {
  const Tag = as;
  return <Tag aria-label={ariaLabel} className={cn("reveal", className)} data-reveal="" data-revealed="false" id={id} style={delay ? { "--reveal-delay": `${delay}ms` } as CSSProperties : undefined} {...rest}>{children}</Tag>;
}
