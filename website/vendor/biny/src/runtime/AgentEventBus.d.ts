/**
 * Agent 事件总线模块。
 *
 * AgentEventBus 是 runtime 到 UI 的同步事件广播层。它不保存历史，只负责把指定事件类型
 * 分发给订阅者，避免 UI 直接依赖模型 SDK 或 agent loop 内部事件。
 */
export declare class AgentEventBus<TEvent> {
    private readonly listeners;
    emit(event: TEvent): void;
    subscribe(listener: (event: TEvent) => void): () => void;
}
