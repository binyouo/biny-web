import { type RemoteHostProvider } from "./api.js";
export interface RemoteAccessInput {
    relay: string;
    registrationKey?: string;
}
export interface RemoteAccessStatus {
    state: "disabled" | "connecting" | "connected" | "reconnecting" | "error";
    relay?: string;
    pairingUrl?: string;
    connections: number;
    error?: string;
}
/** 一个入口授权整台 Biny；各项目 Host 由手机端请求按需接入，关闭不取消已提交回合。 */
export declare class RemoteAccess {
    private readonly provider;
    private readonly changed;
    private current?;
    private snapshot;
    constructor(provider: RemoteHostProvider, changed: () => void);
    status(): RemoteAccessStatus;
    start(input: RemoteAccessInput): RemoteAccessStatus;
    stop(): Promise<RemoteAccessStatus>;
    regenerate(): Promise<RemoteAccessStatus>;
    private run;
}
