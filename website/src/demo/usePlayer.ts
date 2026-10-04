import { useCallback, useEffect, useMemo, useState } from "react";
import type { DemoScenario, DemoStep } from "./types";
import { prefersReducedMotion } from "../lib/utils";

export type PlayerStatus = "idle" | "playing" | "waiting" | "done";
export type Decision = "approved" | "denied";

/** 每一步播完后停顿多久再进入下一步。 */
function holdMs(step: DemoStep, reduced: boolean): number {
  if (reduced) return 120;
  switch (step.kind) {
    case "user":
      // 在输入区打完字后多停一拍，让访客看清内容再「发送」。
      return step.viaComposer ? 640 : 420;
    case "reasoning":
      return 900;
    case "assistant":
      return 650;
    case "model":
      return 800;
    case "tool":
      return step.command || step.diff ? 900 : 700;
  }
}

export interface Player {
  steps: DemoStep[];
  /** 当前正在播放的步骤下标；已结束时等于 steps.length。 */
  index: number;
  chars: number;
  status: PlayerStatus;
  decisions: Record<number, Decision>;
  /** 第 i 步应该显示多少个字符，Infinity 表示全量。 */
  charsFor(i: number): number;
  decide(value: Decision): void;
  skip(): void;
  replay(): void;
}

export function usePlayer(scenario: DemoScenario, active: boolean): Player {
  const reduced = useMemo(prefersReducedMotion, []);
  const [index, setIndex] = useState(0);
  const [chars, setChars] = useState(0);
  const [status, setStatus] = useState<PlayerStatus>("idle");
  const [decisions, setDecisions] = useState<Record<number, Decision>>({});
  const [deniedAt, setDeniedAt] = useState<number | null>(null);

  // 访客拒绝权限请求时，后续脚本作废，改成 Agent 的退让回复。
  const steps = useMemo<DemoStep[]>(() => {
    if (deniedAt === null) return scenario.steps;
    const blocked = scenario.steps[deniedAt];
    const reply = blocked && blocked.kind === "tool" && blocked.permission ? blocked.permission.deniedReply : "";
    return [...scenario.steps.slice(0, deniedAt + 1), { kind: "assistant", text: reply }];
  }, [scenario, deniedAt]);

  const reset = useCallback((next: PlayerStatus) => {
    setIndex(0);
    setChars(0);
    setDecisions({});
    setDeniedAt(null);
    setStatus(next);
  }, []);

  useEffect(() => {
    reset("idle");
  }, [scenario.id, reset]);

  useEffect(() => {
    if (active && status === "idle") setStatus("playing");
  }, [active, status]);

  useEffect(() => {
    if (status !== "playing") return;

    const step = steps[index];
    if (!step) {
      setStatus("done");
      return;
    }

    if (step.kind === "tool" && step.permission && !decisions[index]) {
      setStatus("waiting");
      return;
    }

    const isText = step.kind === "user" || step.kind === "assistant";
    if (isText && !reduced) {
      const total = step.text.length;
      if (chars < total) {
        const chunk = Math.max(1, Math.ceil(total / 90));
        const timer = window.setTimeout(() => setChars((value) => Math.min(total, value + chunk)), 22);
        return () => window.clearTimeout(timer);
      }
    }

    const timer = window.setTimeout(() => {
      setIndex((value) => value + 1);
      setChars(0);
    }, holdMs(step, reduced));
    return () => window.clearTimeout(timer);
  }, [status, index, chars, decisions, steps, reduced]);

  const charsFor = useCallback(
    (i: number) => (i < index || reduced ? Number.POSITIVE_INFINITY : chars),
    [index, chars, reduced]
  );

  const decide = useCallback(
    (value: Decision) => {
      setDecisions((current) => ({ ...current, [index]: value }));
      if (value === "denied") setDeniedAt(index);
      setStatus("playing");
    },
    [index]
  );

  const skip = useCallback(() => {
    const approved: Record<number, Decision> = { ...decisions };
    steps.forEach((step, i) => {
      if (step.kind === "tool" && step.permission && !approved[i]) approved[i] = "approved";
    });
    setDecisions(approved);
    setIndex(steps.length);
    setChars(0);
    setStatus("done");
  }, [decisions, steps]);

  const replay = useCallback(() => reset("playing"), [reset]);

  return { steps, index, chars, status, decisions, charsFor, decide, skip, replay };
}
