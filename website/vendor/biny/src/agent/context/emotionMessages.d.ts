import type { SessionEvent } from "../../session/recorder.js";
import type { EmotionAnalysisMessage } from "./emotionAnalysis.js";
/** Project the last ten nonblank active messages without transforming the older prefix. */
export declare function recentEmotionMessagesFromEvents(events: readonly SessionEvent[]): EmotionAnalysisMessage[];
