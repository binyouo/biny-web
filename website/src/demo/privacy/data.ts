import type { DesktopApi, DesktopMaskRecord, DesktopMaskingOverview } from "./protocol.js";

// All request text, identifiers and addresses are fictional. Nothing is sent or persisted.
export function createExamples(now = new Date()): DesktopMaskRecord[] {
  const sessions = ["demo-session-a1b2c3", "demo-session-d4e5f6", "demo-session-a7b8c9", "demo-session-d0e1f2"];
  return Array.from({ length: 32 }, (_, index): DesktopMaskRecord => {
    const older = index >= 26;
    const replaced = older ? index < 30 : index < 19;
    const sessionIndex = index < 13 ? 0 : index < 16 ? 1 : index < 18 ? 2 : 3;
    const email = ["hello@example.com", "team@example.com", "reader@example.com", "editor@example.com"][sessionIndex]!;
    const tag = ["{{EMAIL_abcd2345}}", "{{EMAIL_efgh2345}}", "{{EMAIL_ijkl2345}}", "{{EMAIL_mnop2345}}"][sessionIndex]!;
    const original = replaced ? `请把山间书屋的活动安排整理成表格，收件人是 ${email}。保留时间、主题和参与人数，先给我草稿。` : "请把山间书屋的三场周末活动整理成表格，保留时间、主题和参与人数。";
    const masked = replaced ? original.replace(email, tag) : original;
    const model = older ? "deepseek-chat" : "group/auto-deepseek-v4-1-flash";
    const system = "你是书屋的工作助手。用简洁的中文回答；发送前先让用户核对草稿。";
    const time = new Date(now);
    if (older) time.setDate(time.getDate() - 10);
    // Keep the initial 26 requests on the same local day, including just after midnight.
    const midnight = new Date(time); midnight.setHours(0, 0, 0, 0);
    time.setTime(time.getTime() - Math.min(index * 60_000, (time.getTime() - midnight.getTime()) * index / 33));
    const unchanged = (path: string, value: string) => ({ path, original: value, masked: value, segments: [] });
    return {
      id: `example-${index + 1}`, time: time.toISOString(), provider: older ? "DeepSeek" : "free", model,
      sessionId: sessions[sessionIndex], operation: "agent", count: replaced ? 1 : 0, uniqueValues: replaced ? 1 : 0,
      kinds: replaced ? { EMAIL: 1 } : {}, truncated: false,
      requestBytes: new TextEncoder().encode(JSON.stringify({ model, messages: [{ role: "system", content: system }, { role: "user", content: original }], stream: true })).length,
      preview: [unchanged("model", model), { ...unchanged("messages[0].content", system), role: "system" },
        { path: "messages[1].content", role: "user", original, masked,
          segments: replaced ? [{ kind: "EMAIL", original: email, masked: tag, start: original.indexOf(email), end: original.indexOf(email) + email.length }] : [] },
        unchanged("stream", "true")]
    };
  });
}

let records = createExamples();
export function resetExamples(): void { records = createExamples(); }
export const demoApi: DesktopApi = {
  async maskingOverview() {
    const summary: DesktopMaskingOverview["summary"] = { total: 0, requests: records.length, byKind: {}, byProvider: {} };
    for (const record of records) {
      summary.total += record.count;
      summary.byProvider[record.provider] = (summary.byProvider[record.provider] ?? 0) + record.count;
      for (const [kind, count] of Object.entries(record.kinds)) summary.byKind[kind] = (summary.byKind[kind] ?? 0) + count;
    }
    return structuredClone({ records: records.map(({ preview: _preview, truncated: _truncated, ...record }) => record), summary });
  },
  async maskingDetail(_projectId, id) { return structuredClone(records.find(record => record.id === id)); },
  async maskingClear() { records = []; },
  onAgentEvent() { return () => {}; }
};
