import { type CommittedFileChange, type PreparedFileChange } from "../tools/file/fileChange.js";
export declare function prepareMcpFileChange(server: string, args: unknown): PreparedFileChange;
export declare function readMcpFileChange(result: unknown, operationId: string, prepared: PreparedFileChange): CommittedFileChange;
