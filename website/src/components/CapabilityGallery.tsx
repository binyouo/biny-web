import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";

export type CapabilitySlide = { caption: string; src: string; alt: string; width: number; height: number };

function Slide({ slide }: { slide: CapabilitySlide }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <p className="capability-image-error" role="status">图片暂时无法加载</p>;
  return <div className="capability-images">
    <img src={slide.src} alt={slide.alt} width={slide.width} height={slide.height} loading="lazy" onError={() => setFailed(true)} />
  </div>;
}

export function CapabilityGallery({ title, slides }: { title: string; slides: readonly CapabilitySlide[] }) {
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!expanded) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [expanded]);
  const slide = slides[index];
  if (!slide) return null;
  const collapse = () => {
    if (!expanded) return;
    dialog.current?.close();
    dialog.current?.show();
    setExpanded(false);
    trigger.current?.focus({ preventScroll: true });
  };
  const expand = () => {
    dialog.current?.close();
    dialog.current?.showModal();
    setExpanded(true);
  };
  const move = (step: number) => setIndex(current => (current + step + slides.length) % slides.length);
  const controls = <div className="capability-gallery-footer">
    <span aria-live="polite" aria-atomic="true">{slide.caption}</span>
    {slides.length > 1 && <div className="capability-gallery-dots" role="group" aria-label={`${title}展示切换`}>
      {slides.map((item, i) => <button key={item.caption} type="button" aria-label={`切换到${item.caption}`} aria-pressed={index === i} onClick={() => setIndex(i)}><span /></button>)}
    </div>}
    <button ref={trigger} type="button" aria-label={expanded ? "关闭放大预览" : `放大查看${title}`} onClick={expanded ? collapse : expand}><Icon name={expanded ? "close" : "external"} size={16} /></button>
  </div>;
  return <figure className="capability-gallery" aria-label={title} onKeyDown={event => {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); move(event.key === "ArrowRight" ? 1 : -1); }
  }}>
    <dialog ref={dialog} open className={`capability-gallery-dialog${expanded ? " is-expanded" : ""}`} role={expanded ? "dialog" : "group"} aria-modal={expanded || undefined} aria-label={expanded ? `${title}放大预览` : title}
      onCancel={event => { event.preventDefault(); collapse(); }}
      onClick={event => { if (expanded && event.target === event.currentTarget) collapse(); }}>
      <div className="capability-gallery-inner">
        <div className="capability-gallery-stage" style={expanded ? undefined : { aspectRatio: `${slides[0].width} / ${slides[0].height}` }}>{expanded ? <Slide key={slide.src} slide={slide} /> : <button className="capability-image-button" type="button" aria-label={`放大截图：${slide.caption}`} onClick={expand}><Slide key={slide.src} slide={slide} /></button>}</div>
        {controls}
      </div>
    </dialog>
  </figure>;
}
