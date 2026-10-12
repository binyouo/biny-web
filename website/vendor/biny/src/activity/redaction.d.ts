/**
 * Activity 原始 OCR 只在 独立 OCR 进程到主进程的短暂内存链路中存在；写入 SQLite 前先做规则脱敏和
 * 展示裁剪。OCR 保留完整脱敏文本，模型输入在消费端按预算截取，避免长屏幕内容永久丢失。
 * 输入监听不接收具体键值，因此不会把按键内容带入这条链路。
 */
export declare function redactActivityText(value: string | undefined): string | undefined;
/** OCR 是逐行文本；保留换行，避免代码、表格和多语言界面在落库时变成一行。 */
export declare function redactActivityOcrText(value: string | undefined): string | undefined;
export interface ActivitySummaryDetails {
    eventType?: string;
    windowTitle?: string;
    mouseEventType?: string;
    fallbackReason?: string;
}
export declare function activitySummary(application: string | undefined, text: string | undefined, details?: ActivitySummaryDetails): string;
