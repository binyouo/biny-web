import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Icon } from "./Icon";
import { BinyPortrait } from "./BinyPortrait";
import { cn } from "../lib/utils";
import { STORY_END, storyNote, storyRecord, storyRequest, storyRunOutput, storySecrets, storySteps, storyToolCalls, storyString } from "../demo/privacyStory";
import "./privacy-story.css";

const seg = (t: number, a: number, b: number) => Math.min(1, Math.max(0, (t - a) / (b - a)));
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const eo = (p: number) => 1 - Math.pow(1 - p, 3);
const eio = (p: number) => p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
type Pt = { x: number; y: number };
const bez = (A: Pt, B: Pt, lift: number, p: number): Pt => {
  const c = { x: (A.x + B.x) / 2, y: Math.min(A.y, B.y) - lift };
  const q = Math.min(1, Math.max(0, p));
  return { x: (1 - q) * (1 - q) * A.x + 2 * (1 - q) * q * c.x + q * q * B.x, y: (1 - q) * (1 - q) * A.y + 2 * (1 - q) * q * c.y + q * q * B.y };
};
const bezSide = (A: Pt, B: Pt, lift: number, p: number): Pt => {
  const c = { x: (A.x + B.x) / 2 + lift, y: (A.y + B.y) / 2 };
  const q = Math.min(1, Math.max(0, p));
  return { x: (1 - q) * (1 - q) * A.x + 2 * (1 - q) * q * c.x + q * q * B.x, y: (1 - q) * (1 - q) * A.y + 2 * (1 - q) * q * c.y + q * q * B.y };
};

const plainParts = storyRequest.map(part => typeof part === "string" ? part : storySecrets[part.secret].value);
const envTexts = storyToolCalls[0].args.map(part => typeof part === "string" ? part : storySecrets[part.secret].value).join("").split("\n");
const maskedRequest = storyString(storyRequest, "masked");
const fmt = (t: number) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;

function Slot({ id, secret, showChip }: { id: string; secret: number; showChip: boolean }) {
  const s = storySecrets[secret];
  return <span className="story-slot" data-chip={showChip || undefined} data-t={id}>
    <span className="story-slot-hl" data-t={`${id}-hl`} />
    <span className="story-slot-hole" data-t={`${id}-hole`} />
    <span className="story-slot-flash" data-t={`${id}-fl`} />
    <span className="story-slot-real" data-t={`${id}-real`}>{s.value}</span>
    <span className="story-slot-chip" data-t={`${id}-chip`}>{s.placeholder}</span>
  </span>;
}

function Envelope({ seal }: { seal: string }) {
  return <svg aria-hidden="true" className="story-env-svg" height="26" viewBox="0 0 36 26" width="36">
    <rect fill="var(--surface)" height="24" rx="3" stroke="var(--line-strong)" width="34" x="1" y="1" />
    <path d="M2 3 L18 14 L34 3" fill="none" stroke="var(--line-strong)" strokeWidth="1.4" />
    <circle cx="18" cy="14" fill={seal} r="4" />
  </svg>;
}

export function PrivacyStory() {
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const scrubRef = useRef<HTMLInputElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);
  const elsRef = useRef<Record<string, HTMLElement>>({});
  const anchorsRef = useRef<Record<string, Pt>>({});
  const camRef = useRef({ on: false, H: 0, max: 0 });
  const widthsRef = useRef<Record<string, { real: number; code: number }>>({});
  const tRef = useRef(0);
  const playingRef = useRef(false);
  const userPausedRef = useRef(false);
  const reducedRef = useRef(false);
  const memoRef = useRef(new Map<HTMLElement, Map<string, string>>());
  const lastUiRef = useRef(0);
  const stepIndexRef = useRef(0);
  const renderRef = useRef<(t: number) => void>(() => {});
  const syncControlsRef = useRef<(force?: boolean) => void>(() => {});
  syncControlsRef.current = (force = false) => {
    const now = performance.now();
    if (!force && now - lastUiRef.current < 100) return;
    lastUiRef.current = now;
    const p = tRef.current / STORY_END;
    if (scrubRef.current) {
      scrubRef.current.value = String(Math.round(p * 1000));
      scrubRef.current.style.setProperty("--p", `${(p * 100).toFixed(2)}%`);
      const i = stepIndexRef.current;
      scrubRef.current.setAttribute("aria-valuenow", String(Math.round(p * 1000)));
      scrubRef.current.setAttribute("aria-valuetext", `第 ${i + 1} 步：${storySteps[i].title}`);
    }
    if (timeRef.current) timeRef.current.textContent = `${fmt(tRef.current)} / ${fmt(STORY_END)}`;
  };
  const step = storySteps[stepIndex];

  useEffect(() => { playingRef.current = playing; }, [playing]);
  useEffect(() => { stepIndexRef.current = stepIndex; }, [stepIndex]);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    const root = rootRef.current;
    if (!stage || !root) return;
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const els: Record<string, HTMLElement> = {};
    stage.querySelectorAll<HTMLElement>("[data-t]").forEach(el => { els[el.dataset.t!] = el; });
    root.querySelectorAll<HTMLElement>("[data-t]").forEach(el => { els[el.dataset.t!] = el; });
    elsRef.current = els;
    const memo = memoRef.current;
    const set = (el: HTMLElement | undefined, prop: "opacity" | "transform" | "width" | "backgroundColor" | "backgroundSize", value: string) => {
      if (!el) return;
      let m = memo.get(el);
      if (!m) { m = new Map(); memo.set(el, m); }
      if (m.get(prop) === value) return;
      m.set(prop, value);
      el.style[prop] = value;
    };
    const txt = (el: HTMLElement | null | undefined, value: string) => { if (el && el.textContent !== value) el.textContent = value; };
    const op = (name: string, value: number) => set(els[name], "opacity", String(Math.min(1, Math.max(0, value))));
    const xf = (name: string, value: string) => set(els[name], "transform", value);
    const fly = (name: string, p: Pt | null, extra = "") => set(els[name], "transform", p ? `translate(${p.x.toFixed(1)}px,${p.y.toFixed(1)}px) translate(-50%,-50%)${extra}` : "");

    const pos = (el: HTMLElement | null): Pt | null => {
      if (!el) return null;
      let x = 0, y = 0, n: HTMLElement | null = el;
      while (n && n !== stage) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent as HTMLElement | null; }
      return { x: x + el.offsetWidth / 2, y: y + el.offsetHeight / 2 };
    };
    const measure = () => {
      const a = anchorsRef.current;
      for (const name of ["req", "desk", "letter", "replysheet", "exec", "book"]) a[name] = pos(stage.querySelector(`[data-k="${name}"]`) as HTMLElement | null) ?? { x: 0, y: 0 };
      const view = viewRef.current;
      const H = view?.clientHeight || 0;
      camRef.current = { on: window.matchMedia("(max-width: 640px)").matches && H > 0, H, max: Math.max(0, stage.offsetHeight - H) };
      a.provreq = pos(els.provreq) ?? { x: 0, y: 0 };
      a.provreply = pos(els.provreply) ?? { x: 0, y: 0 };
      for (const id of ["s0", "s1", "r0", "r1"]) {
        const slot = els[id];
        a[id] = pos(slot) ?? { x: 0, y: 0 };
        widthsRef.current[id] = {
          real: slot?.querySelector<HTMLElement>(".story-slot-real")?.offsetWidth || 80,
          code: slot?.querySelector<HTMLElement>(".story-slot-chip")?.offsetWidth || 168
        };
      }
      a.rowv0 = pos(els.rowval0) ?? { x: 0, y: 0 };
      a.rowv1 = pos(els.rowval1) ?? { x: 0, y: 0 };
    };

    const slotRender = (id: string, t: number, readAt: number, tearAt: number, stickAt: number, restoreAt: number | null) => {
      const w = widthsRef.current[id];
      const mode = els[id]?.dataset.chip === "true" ? "masked-first" : "real-first";
      if (mode === "real-first") {
        op(`${id}-real`, t < tearAt ? 1 : 1 - seg(t, tearAt, tearAt + .25));
        set(els[`${id}-real`], "transform", `translate(-50%,calc(-50% + ${(-6 * seg(t, tearAt, tearAt + .25)).toFixed(1)}px))`);
        set(els[`${id}-real`], "backgroundSize", `${seg(t, readAt, readAt + .5) * 100}% 100%`);
        op(`${id}-hole`, seg(t, tearAt + .15, tearAt + .4) * (1 - seg(t, stickAt, stickAt + .3)));
        const stickP = seg(t, stickAt, stickAt + .4);
        op(`${id}-chip`, stickP);
        set(els[`${id}-chip`], "transform", `translate(-50%,-50%) scale(${lerp(1.25, 1, eo(stickP))})`);
        set(els[`${id}-hl`], "opacity", "0");
        set(els[id], "width", `${lerp(w.real, w.code, eio(stickP)).toFixed(1)}px`);
      } else if (restoreAt != null) {
        const lift = seg(t, restoreAt, restoreAt + .3);
        op(`${id}-chip`, 1 - lift);
        set(els[`${id}-chip`], "transform", `translate(-50%,${-50 - 6 * lift}%)`);
        op(`${id}-real`, seg(t, restoreAt + .1, restoreAt + .3));
        set(els[`${id}-real`], "transform", "translate(-50%,-50%)");
        op(`${id}-fl`, seg(t, restoreAt + .1, restoreAt + .3) * (1 - seg(t, restoreAt + .5, restoreAt + 1.1)));
        op(`${id}-hole`, 0); op(`${id}-hl`, 0);
        set(els[id], "width", `${lerp(w.code, w.real, eio(seg(t, restoreAt, restoreAt + .3))).toFixed(1)}px`);
      }
    };

    const render = (t: number) => {
      const a = anchorsRef.current;
      const path = (A: Pt, B: Pt, lift: number, p: number) => camRef.current.on ? bezSide(A, B, lift, p) : bez(A, B, lift, p);
      // 你说 typing
      let left = Math.floor(seg(t, .2, 1.8) * plainParts.join("").length + .0001);
      for (const [i, name] of ["rq0", "rqs0", "rq1", "rqs1"].entries()) {
        const part = plainParts[i];
        txt(els[name], part.slice(0, Math.max(0, Math.min(part.length, left))));
        left = Math.max(0, left - part.length);
      }
      op("caret", t < 2.2 ? 1 : 0);
      // letter sheet: rest at its own anchor
      const lp = eio(seg(t, 2.2, 3.0));
      const lpos = path(a.req, a.letter, 50, lp);
      const ldx = lpos.x - a.letter.x, ldy = lpos.y - a.letter.y;
      const lout = seg(t, 10.2, 10.6);
      if (t >= 10.6) { op("letter", 0); }
      else { op("letter", seg(t, 2.2, 2.35) * (1 - lout)); }
      xf("letter", `translate(${ldx.toFixed(1)}px,${ldy.toFixed(1)}px) scale(${(t >= 10.2 ? lerp(1, .4, lout) : lerp(.3, 1, eo(lp))).toFixed(3)}) rotate(${t >= 10.2 ? lerp(0, 5, lout) : lerp(6, 0, lp)}deg)`);
      // read sweeps
      set(els["s0-real"], "backgroundSize", `${seg(t, 3.3, 3.8) * 100}% 100%`);
      set(els["s1-real"], "backgroundSize", `${seg(t, 4.0, 4.5) * 100}% 100%`);
      slotRender("s0", t, 3.3, 5.4, 8.2, null);
      slotRender("s1", t, 4.0, 6.6, 8.9, null);
      slotRender("r0", t, 0, 0, 0, 17.6);
      slotRender("r1", t, 0, 0, 0, 18.8);
      // value flyers
      const flights: [string, number, number, Pt, Pt][] = [
        ["vf0", 5.45, 6.3, a.s0, a.rowv0],
        ["vf1", 6.65, 7.5, a.s1, a.rowv1],
        ["vf2", 17.0, 17.7, a.rowv0, a.r0],
        ["vf3", 18.2, 18.9, a.rowv1, a.r1]
      ];
      for (const [name, s, e, A, B] of flights) {
        const p = seg(t, s, e);
        const active = p > 0 && p < 1;
        op(name, active ? 1 : 0);
        if (active) fly(name, path(A, B, name === "vf2" || name === "vf3" ? 40 : 50, eio(p)));
      }
      // book
      op("empty", 1 - seg(t, 6.1, 6.3));
      op("row0", seg(t, 6.3, 6.45)); op("row1", seg(t, 7.5, 7.65));
      op("rowchip0", seg(t, 8.2, 8.5)); op("rowchip1", seg(t, 8.9, 9.2));
      set(els.row0, "backgroundColor", t > 16.8 && t < 18.4 ? "var(--accent-bg)" : "transparent");
      set(els.row1, "backgroundColor", t > 18.0 && t < 19.6 ? "var(--accent-bg)" : "transparent");
      // outbound envelope
      const ep = seg(t, 10.6, 11.8);
      op("envout", seg(t, 10.2, 10.5) * (1 - seg(t, 11.7, 11.9)));
      fly("envout", ep > 0 ? path(a.letter, a.provreq, 60, eio(ep)) : (t >= 10.2 ? a.letter : null), ` rotate(${lerp(-8, 0, eio(ep)).toFixed(1)}deg)`);
      // inbound reply envelope
      const rp = seg(t, 15.2, 16.4);
      op("envin", rp > 0 ? seg(t, 15.2, 15.35) * (1 - seg(t, 16.2, 16.55)) : 0);
      fly("envin", rp > 0 ? path(a.provreply, a.replysheet, 45, eio(rp)) : null, ` rotate(${lerp(8, 0, eio(rp)).toFixed(1)}deg)`);
      // trail dots
      for (let i = 0; i < 5; i++) {
        const pp = eio(ep) - .035 * (i + 1);
        op(`dto${i}`, pp > 0 && ep < 1 ? .5 * (1 - i / 5) : 0);
        fly(`dto${i}`, pp > 0 ? path(a.letter, a.provreq, 60, Math.max(0, pp)) : null);
        const qi = eio(rp) - .035 * (i + 1);
        op(`dti${i}`, qi > 0 && rp < 1 ? .5 * (1 - i / 5) : 0);
        fly(`dti${i}`, qi > 0 ? path(a.provreply, a.replysheet, 45, Math.max(0, qi)) : null);
      }
      // reply sheet
      const rs = seg(t, 16.2, 16.7);
      const rfly = seg(t, 20.6, 21.4);
      if (rfly > 0) {
        const p = path(a.replysheet, a.exec, 40, eio(rfly));
        xf("replysheet", `translate(${(p.x - a.replysheet.x).toFixed(1)}px,${(p.y - a.replysheet.y).toFixed(1)}px) scale(${lerp(1, .3, eio(rfly))}) rotate(${lerp(0, 6, rfly)}deg)`);
        op("replysheet", 1 - seg(t, 21.1, 21.4));
      } else {
        xf("replysheet", `scale(${lerp(.9, 1, eo(rs))}) rotate(${lerp(-4, 0, rs)}deg)`);
        op("replysheet", rs);
      }
      // provider
      op("provwait", 1 - seg(t, 11.8, 12.0));
      op("provreq", seg(t, 11.8, 12.2));
      set(els.provreq, "transform", `translateY(${lerp(6, 0, eo(seg(t, 11.8, 12.2)))}px)`);
      op("provreply", seg(t, 12.9, 13.2));
      const dotsOn = t > 12.9 && t < 14.0;
      for (let i = 0; i < 3; i++) op(`dot${i}`, dotsOn ? .3 + .7 * Math.abs(Math.sin(t * 6 - i * 1.1)) : 0);
      op("procalls", seg(t, 14.0, 14.5));
      op("profoot", seg(t, 15.0, 15.4));
      op("execwait", 1 - seg(t, 21.4, 21.6));
      op("envcard", seg(t, 21.2, 21.5));
      op("termcard", seg(t, 22.7, 22.95));
      // exec typing + terminal + record
      const envN = Math.floor(seg(t, 21.4, 22.6) * (envTexts[0].length + envTexts[1].length) + .0001);
      txt(els.env0, envTexts[0].slice(0, Math.min(envTexts[0].length, envN)));
      txt(els.env1, envTexts[1].slice(0, Math.max(0, envN - envTexts[0].length)));
      op("term0", seg(t, 22.8, 22.95));
      op("term1", seg(t, 23.4, 23.55));
      set(els.term1, "transform", `scale(${lerp(.92, 1, eo(seg(t, 23.4, 23.8)))})`);
      op("record", seg(t, 25.2, 25.7));
      set(els.record, "transform", `translateY(${lerp(6, 0, eo(seg(t, 25.2, 25.7)))}px)`);
      // 窄屏取景：transform 不影响 offsetTop 锚点，飞行路径保持正确
      const cam = camRef.current;
      if (!cam.on) {
        set(stage, "transform", "");
      } else {
        const frame = (cy: number) => Math.min(cam.max, Math.max(0, cy - cam.H / 2));
        const top = 0, local = frame((a.letter.y + a.book.y) / 2), prov = frame((a.provreq.y + a.provreply.y) / 2), exec = frame(a.exec.y);
        const keys: [number, number][] = [[4.6, top], [5.4, local], [10.6, local], [11.8, prov], [15.2, prov], [16.4, local], [20.6, local], [21.4, exec]];
        let camY = keys[keys.length - 1][1];
        for (let i = 0; i < keys.length - 1; i++) {
          if (t < keys[i + 1][0]) { camY = lerp(keys[i][1], keys[i + 1][1], eio(seg(t, keys[i][0], keys[i + 1][0]))); break; }
        }
        set(stage, "transform", `translateY(${(-camY).toFixed(1)}px)`);
      }
    };
    renderRef.current = render;



    measure();
    render(tRef.current);
    syncControlsRef.current(true);
    const observer = new ResizeObserver(() => { measure(); render(tRef.current); });
    observer.observe(stage);
    if (viewRef.current) observer.observe(viewRef.current);
    document.fonts?.ready.then(() => { measure(); render(tRef.current); });
    return () => observer.disconnect();
  }, []);

  // clock
  useEffect(() => {
    if (!playing) return;
    let raf = 0, prev = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(.05, (now - prev) / 1000);
      prev = now;
      tRef.current = Math.min(STORY_END, tRef.current + dt);
      renderRef.current(tRef.current);
      const idx = storySteps.reduce((acc, s, i) => tRef.current >= s.at ? i : acc, 0);
      if (idx !== stepIndexRef.current) setStepIndex(idx);
      syncControlsRef.current(false);
      if (tRef.current >= STORY_END) { setPlaying(false); return; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  // visibility / autoplay
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const node = rootRef.current;
    if (!node || typeof IntersectionObserver === "undefined") { setInView(true); return; }
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) setInView(entry.intersectionRatio >= 0.5);
    }, { threshold: [0, 0.5, 1] });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const sync = () => {
      if (reducedRef.current) return;
      if (document.hidden || !inView) setPlaying(false);
      else if (!userPausedRef.current) setPlaying(true);
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, [inView]);

  const seek = (t: number) => {
    tRef.current = Math.max(0, Math.min(STORY_END, t));
    renderRef.current(tRef.current);
    const idx = storySteps.reduce((acc, s, i) => tRef.current >= s.at ? i : acc, 0);
    setStepIndex(idx);
    syncControlsRef.current(true);
  };
  const jump = (i: number) => { userPausedRef.current = true; setPlaying(false); seek(storySteps[i].at + .01); };
  const scrub = (v: number) => { userPausedRef.current = true; setPlaying(false); seek(v / 1000 * STORY_END); };
  const toggle = () => {
    if (!playing) {
      if (tRef.current >= STORY_END) seek(0);
      userPausedRef.current = false;
      setPlaying(true);
    } else {
      userPausedRef.current = true;
      setPlaying(false);
    }
  };

  return <div className="story" ref={rootRef}>
    <div className="story-view" ref={viewRef}>
    <div className="story-stage" ref={stageRef}>
      <div className="story-panel" data-panel="local">
        <p className="story-panel-title">你的电脑<span>原值只在这里</span></p>
        <div className="story-panel-body">
          <div className="story-box" data-k="req">
            <p className="story-card-title">你说</p>
            <pre className="story-pre story-typed"><span data-t="rq0" /><span className="story-secret" data-state="found"><b data-t="rqs0" /></span><span data-t="rq1" /><span className="story-secret" data-state="found"><b data-t="rqs1" /></span><span className="story-caret" data-t="caret" /></pre>
          </div>
          <div className="story-box" data-k="book">
            <p className="story-card-title">本机对照表<span className="story-card-sub">只在内存</span></p>
            <p className="story-book-empty" data-t="empty">还是空的</p>
            {storySecrets.map((s, i) => <p className="story-map-row" data-t={`row${i}`} key={s.kind}>
              <span className="story-secret" data-state="masked" data-t={`rowchip${i}`}>{s.placeholder}</span>
              <span className="story-map-arrow">→</span>
              <span className="story-map-val" data-t={`rowval${i}`}>{s.value}</span>
            </p>)}
          </div>
          <div className="story-box story-exec" data-k="exec">
            <p className="story-card-title">在本机执行</p>
            <p className="story-wait" data-t="execwait">等待执行</p>
            <div className="story-card story-file" data-t="envcard">
              <p className="story-card-title"><code>.env</code></p>
              <pre className="story-pre"><span data-t="env0" />{"\n"}<span data-t="env1" /></pre>
            </div>
            <div className="story-card story-term" data-t="termcard">
              <pre className="story-pre"><span data-t="term0">$ pnpm db:migrate</span>{"\n"}<span className="story-term-ok" data-t="term1">✓ 3 个迁移已执行</span></pre>
            </div>
            <p className="story-record-line" data-t="record">{storyRecord}</p>
          </div>
        </div>
      </div>
      <div className="story-desk">
        <div className="story-biny" key={stepIndex}>
          <BinyPortrait size={64} />
          <span className="story-bubble">{step.biny}</span>
        </div>
        <span className="story-net" aria-hidden="true">网络</span>
        <div className="story-desk-area" data-k="desk">
          <div className="story-sheet story-letter" data-k="letter" data-t="letter">
            <p className="story-sheet-head">发往模型服务的请求<span>Biny → 模型</span></p>
            <pre className="story-pre">帮我把测试库配置写进 .env，再跑一下迁移。{"\n"}DB_PASSWORD=<Slot id="s0" secret={0} showChip={false} />{"\n"}告警邮箱：<Slot id="s1" secret={1} showChip={false} /></pre>
          </div>
          <div className="story-sheet story-replysheet" data-k="replysheet" data-t="replysheet">
            <p className="story-sheet-head">模型的回复<span>调用工具</span></p>
            <pre className="story-pre">写入文件 .env{"\n"}DB_PASSWORD=<Slot id="r0" secret={0} showChip />{"\n"}ALERT_EMAIL=<Slot id="r1" secret={1} showChip />{"\n"}Bash pnpm db:migrate</pre>
          </div>
        </div>
      </div>
      <div className="story-panel" data-panel="provider" data-k="prov">
        <p className="story-panel-title">模型服务<span>远端</span></p>
        <div className="story-panel-body">
          <p className="story-wait" data-t="provwait">等待请求</p>
          <div className="story-card" data-k="provreq" data-t="provreq">
            <p className="story-card-title">收到的请求</p>
            <pre className="story-pre">{storyRequest.map((part, j) => typeof part === "string" ? part : <span className="story-secret" data-state="masked" key={j}>{storySecrets[part.secret].placeholder}</span>)}</pre>
            <p className="story-note">{storyNote}</p>
          </div>
          <div className="story-card" data-k="provreply" data-t="provreply">
            <p className="story-card-title">回复</p>
            <p className="story-thinking"><i data-t="dot0" /><i data-t="dot1" /><i data-t="dot2" /></p>
            <div data-t="procalls">
              {storyToolCalls.map((call, i) => <div className="story-call" key={i}>
                <p className="story-call-head"><strong>{call.name}</strong><code>{call.target}</code></p>
                {call.args.length ? <pre className="story-pre">{call.args.map((part, j) => typeof part === "string" ? part : <span className="story-secret" data-state="masked" key={j}>{storySecrets[part.secret].placeholder}</span>)}</pre> : null}
              </div>)}
            </div>
          </div>
          <p className="story-provider-foot" data-t="profoot">✓ 只见过占位符</p>
        </div>
      </div>
      <div className="story-fly" aria-hidden="true">
        <span className="story-env" data-t="envout"><Envelope seal="var(--accent)" /></span>
        <span className="story-env" data-t="envin"><Envelope seal="var(--amber)" /></span>
        {[0, 1].map(i => <span className="story-value story-value-out" data-t={`vf${i}`} key={i}>{storySecrets[i].value}</span>)}
        {[0, 1].map(i => <span className="story-value story-value-in" data-t={`vf${i + 2}`} key={i}>{storySecrets[i].value}</span>)}
        {[0, 1, 2, 3, 4].map(i => <span className="story-trail story-trail-out" data-t={`dto${i}`} key={i} />)}
        {[0, 1, 2, 3, 4].map(i => <span className="story-trail story-trail-in" data-t={`dti${i}`} key={i} />)}
      </div>
    </div>
    </div>
    <div className="story-caption" aria-live="polite">
      <p className="story-step-count">{stepIndex + 1}/8</p>
      <div><h3>{step.title}</h3><p>{step.body}</p></div>
    </div>
    <div className="story-controls">
      <button aria-label={playing ? "暂停演示" : "播放演示"} className="story-play" onClick={toggle} type="button"><Icon name={playing ? "pause" : "play"} size={15} /></button>
      <div className="story-scrub">
        <input aria-label="演示进度" aria-valuemax={1000} aria-valuemin={0} aria-valuenow={0} className="story-range" max={1000} min={0} onChange={e => scrub(+e.target.value)} onInput={e => scrub(+(e.target as HTMLInputElement).value)} ref={scrubRef} step={1} type="range" />
        <div className="story-ticks" aria-hidden="true">{storySteps.map(s => <i key={s.id} style={{ left: `${s.at / STORY_END * 100}%` }} />)}</div>
      </div>
      <span className="story-time" ref={timeRef}>0:00 / 0:28</span>
    </div>
    <div className="story-chips" role="group" aria-label="演示步骤">
      {storySteps.map((s, i) => <button aria-current={i === stepIndex ? "step" : undefined} className={cn("story-chip", i === stepIndex && "is-active", i < stepIndex && "is-done")} key={s.id} onClick={() => jump(i)} type="button">{s.chip}</button>)}
    </div>
  </div>;
}
