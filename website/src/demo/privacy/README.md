# Privacy preview

The records, flow and comparison components and their helpers are snapshots of Biny Desktop's `src/desktop/renderer/src/components/settings` implementation, copied on 2026-11-01. `privacy.css` is the corresponding section of Desktop's `settings.css`; `frame.css` provides the settings controls, theme tokens and fixed viewport shell.

Only the runtime boundary changes: `data.ts` implements a display-only API with fictional requests, `protocol.ts` contains the necessary protocol subset, and `PrivacyRecords` uses this API, an accurate demo footer, and local scrolling with `preventScroll` focus restoration. No Desktop IPC, model request or storage access is installed.

The host uses a fixed-height iframe. Theme messages flow into this frame only; filters, request details, clearing and resetting cannot resize or style the host document. When updating the snapshot, preserve this boundary and the full request comparison (unchanged fields are collapsed, not discarded).
