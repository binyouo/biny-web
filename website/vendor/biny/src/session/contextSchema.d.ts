/** 会话上下文的持久化边界校验；日志与快照恢复共用，不能将任意对象当成可信状态。 */
import { z } from "zod";
export declare const contextCheckpointSchema: z.ZodObject<{
    summary: z.ZodString;
    firstKeptMessageId: z.ZodOptional<z.ZodString>;
    firstKeptMessageIndex: z.ZodNumber;
    tokensBefore: z.ZodNumber;
    compactedMessages: z.ZodNumber;
    createdAt: z.ZodEffects<z.ZodString, string, string>;
    formatVersion: z.ZodOptional<z.ZodLiteral<1>>;
    state: z.ZodOptional<z.ZodObject<{
        goal: z.ZodArray<z.ZodString, "many">;
        constraints: z.ZodArray<z.ZodString, "many">;
        done: z.ZodArray<z.ZodString, "many">;
        inProgress: z.ZodArray<z.ZodString, "many">;
        blocked: z.ZodArray<z.ZodString, "many">;
        decisions: z.ZodArray<z.ZodString, "many">;
        errorsAndFixes: z.ZodArray<z.ZodString, "many">;
        userMessages: z.ZodArray<z.ZodString, "many">;
        nextSteps: z.ZodArray<z.ZodString, "many">;
        criticalContext: z.ZodArray<z.ZodString, "many">;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        goal: z.ZodArray<z.ZodString, "many">;
        constraints: z.ZodArray<z.ZodString, "many">;
        done: z.ZodArray<z.ZodString, "many">;
        inProgress: z.ZodArray<z.ZodString, "many">;
        blocked: z.ZodArray<z.ZodString, "many">;
        decisions: z.ZodArray<z.ZodString, "many">;
        errorsAndFixes: z.ZodArray<z.ZodString, "many">;
        userMessages: z.ZodArray<z.ZodString, "many">;
        nextSteps: z.ZodArray<z.ZodString, "many">;
        criticalContext: z.ZodArray<z.ZodString, "many">;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        goal: z.ZodArray<z.ZodString, "many">;
        constraints: z.ZodArray<z.ZodString, "many">;
        done: z.ZodArray<z.ZodString, "many">;
        inProgress: z.ZodArray<z.ZodString, "many">;
        blocked: z.ZodArray<z.ZodString, "many">;
        decisions: z.ZodArray<z.ZodString, "many">;
        errorsAndFixes: z.ZodArray<z.ZodString, "many">;
        userMessages: z.ZodArray<z.ZodString, "many">;
        nextSteps: z.ZodArray<z.ZodString, "many">;
        criticalContext: z.ZodArray<z.ZodString, "many">;
    }, z.ZodTypeAny, "passthrough">>>;
    evidence: z.ZodOptional<z.ZodArray<z.ZodObject<{
        field: z.ZodEnum<["goal", "constraints", "done", "inProgress", "blocked", "decisions", "errorsAndFixes", "userMessages", "nextSteps", "criticalContext"]>;
        itemIndex: z.ZodNumber;
        references: z.ZodArray<z.ZodObject<{
            role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
            kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
            messageId: z.ZodOptional<z.ZodString>;
            messageIndex: z.ZodOptional<z.ZodNumber>;
            toolCallId: z.ZodOptional<z.ZodString>;
            tool: z.ZodOptional<z.ZodString>;
            archivePath: z.ZodOptional<z.ZodString>;
            checkpointCreatedAt: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
            kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
            messageId: z.ZodOptional<z.ZodString>;
            messageIndex: z.ZodOptional<z.ZodNumber>;
            toolCallId: z.ZodOptional<z.ZodString>;
            tool: z.ZodOptional<z.ZodString>;
            archivePath: z.ZodOptional<z.ZodString>;
            checkpointCreatedAt: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
            kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
            messageId: z.ZodOptional<z.ZodString>;
            messageIndex: z.ZodOptional<z.ZodNumber>;
            toolCallId: z.ZodOptional<z.ZodString>;
            tool: z.ZodOptional<z.ZodString>;
            archivePath: z.ZodOptional<z.ZodString>;
            checkpointCreatedAt: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        field: z.ZodEnum<["goal", "constraints", "done", "inProgress", "blocked", "decisions", "errorsAndFixes", "userMessages", "nextSteps", "criticalContext"]>;
        itemIndex: z.ZodNumber;
        references: z.ZodArray<z.ZodObject<{
            role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
            kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
            messageId: z.ZodOptional<z.ZodString>;
            messageIndex: z.ZodOptional<z.ZodNumber>;
            toolCallId: z.ZodOptional<z.ZodString>;
            tool: z.ZodOptional<z.ZodString>;
            archivePath: z.ZodOptional<z.ZodString>;
            checkpointCreatedAt: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
            kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
            messageId: z.ZodOptional<z.ZodString>;
            messageIndex: z.ZodOptional<z.ZodNumber>;
            toolCallId: z.ZodOptional<z.ZodString>;
            tool: z.ZodOptional<z.ZodString>;
            archivePath: z.ZodOptional<z.ZodString>;
            checkpointCreatedAt: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
            kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
            messageId: z.ZodOptional<z.ZodString>;
            messageIndex: z.ZodOptional<z.ZodNumber>;
            toolCallId: z.ZodOptional<z.ZodString>;
            tool: z.ZodOptional<z.ZodString>;
            archivePath: z.ZodOptional<z.ZodString>;
            checkpointCreatedAt: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        field: z.ZodEnum<["goal", "constraints", "done", "inProgress", "blocked", "decisions", "errorsAndFixes", "userMessages", "nextSteps", "criticalContext"]>;
        itemIndex: z.ZodNumber;
        references: z.ZodArray<z.ZodObject<{
            role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
            kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
            messageId: z.ZodOptional<z.ZodString>;
            messageIndex: z.ZodOptional<z.ZodNumber>;
            toolCallId: z.ZodOptional<z.ZodString>;
            tool: z.ZodOptional<z.ZodString>;
            archivePath: z.ZodOptional<z.ZodString>;
            checkpointCreatedAt: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
            kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
            messageId: z.ZodOptional<z.ZodString>;
            messageIndex: z.ZodOptional<z.ZodNumber>;
            toolCallId: z.ZodOptional<z.ZodString>;
            tool: z.ZodOptional<z.ZodString>;
            archivePath: z.ZodOptional<z.ZodString>;
            checkpointCreatedAt: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
            kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
            messageId: z.ZodOptional<z.ZodString>;
            messageIndex: z.ZodOptional<z.ZodNumber>;
            toolCallId: z.ZodOptional<z.ZodString>;
            tool: z.ZodOptional<z.ZodString>;
            archivePath: z.ZodOptional<z.ZodString>;
            checkpointCreatedAt: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
    }, z.ZodTypeAny, "passthrough">>, "many">>;
    parentCreatedAt: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    coveredMessageCount: z.ZodOptional<z.ZodNumber>;
    tokensAfter: z.ZodOptional<z.ZodNumber>;
    summaryProvider: z.ZodOptional<z.ZodString>;
    summaryModel: z.ZodOptional<z.ZodString>;
    summaryPromptVersion: z.ZodOptional<z.ZodNumber>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    summary: z.ZodString;
    firstKeptMessageId: z.ZodOptional<z.ZodString>;
    firstKeptMessageIndex: z.ZodNumber;
    tokensBefore: z.ZodNumber;
    compactedMessages: z.ZodNumber;
    createdAt: z.ZodEffects<z.ZodString, string, string>;
    formatVersion: z.ZodOptional<z.ZodLiteral<1>>;
    state: z.ZodOptional<z.ZodObject<{
        goal: z.ZodArray<z.ZodString, "many">;
        constraints: z.ZodArray<z.ZodString, "many">;
        done: z.ZodArray<z.ZodString, "many">;
        inProgress: z.ZodArray<z.ZodString, "many">;
        blocked: z.ZodArray<z.ZodString, "many">;
        decisions: z.ZodArray<z.ZodString, "many">;
        errorsAndFixes: z.ZodArray<z.ZodString, "many">;
        userMessages: z.ZodArray<z.ZodString, "many">;
        nextSteps: z.ZodArray<z.ZodString, "many">;
        criticalContext: z.ZodArray<z.ZodString, "many">;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        goal: z.ZodArray<z.ZodString, "many">;
        constraints: z.ZodArray<z.ZodString, "many">;
        done: z.ZodArray<z.ZodString, "many">;
        inProgress: z.ZodArray<z.ZodString, "many">;
        blocked: z.ZodArray<z.ZodString, "many">;
        decisions: z.ZodArray<z.ZodString, "many">;
        errorsAndFixes: z.ZodArray<z.ZodString, "many">;
        userMessages: z.ZodArray<z.ZodString, "many">;
        nextSteps: z.ZodArray<z.ZodString, "many">;
        criticalContext: z.ZodArray<z.ZodString, "many">;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        goal: z.ZodArray<z.ZodString, "many">;
        constraints: z.ZodArray<z.ZodString, "many">;
        done: z.ZodArray<z.ZodString, "many">;
        inProgress: z.ZodArray<z.ZodString, "many">;
        blocked: z.ZodArray<z.ZodString, "many">;
        decisions: z.ZodArray<z.ZodString, "many">;
        errorsAndFixes: z.ZodArray<z.ZodString, "many">;
        userMessages: z.ZodArray<z.ZodString, "many">;
        nextSteps: z.ZodArray<z.ZodString, "many">;
        criticalContext: z.ZodArray<z.ZodString, "many">;
    }, z.ZodTypeAny, "passthrough">>>;
    evidence: z.ZodOptional<z.ZodArray<z.ZodObject<{
        field: z.ZodEnum<["goal", "constraints", "done", "inProgress", "blocked", "decisions", "errorsAndFixes", "userMessages", "nextSteps", "criticalContext"]>;
        itemIndex: z.ZodNumber;
        references: z.ZodArray<z.ZodObject<{
            role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
            kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
            messageId: z.ZodOptional<z.ZodString>;
            messageIndex: z.ZodOptional<z.ZodNumber>;
            toolCallId: z.ZodOptional<z.ZodString>;
            tool: z.ZodOptional<z.ZodString>;
            archivePath: z.ZodOptional<z.ZodString>;
            checkpointCreatedAt: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
            kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
            messageId: z.ZodOptional<z.ZodString>;
            messageIndex: z.ZodOptional<z.ZodNumber>;
            toolCallId: z.ZodOptional<z.ZodString>;
            tool: z.ZodOptional<z.ZodString>;
            archivePath: z.ZodOptional<z.ZodString>;
            checkpointCreatedAt: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
            kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
            messageId: z.ZodOptional<z.ZodString>;
            messageIndex: z.ZodOptional<z.ZodNumber>;
            toolCallId: z.ZodOptional<z.ZodString>;
            tool: z.ZodOptional<z.ZodString>;
            archivePath: z.ZodOptional<z.ZodString>;
            checkpointCreatedAt: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        field: z.ZodEnum<["goal", "constraints", "done", "inProgress", "blocked", "decisions", "errorsAndFixes", "userMessages", "nextSteps", "criticalContext"]>;
        itemIndex: z.ZodNumber;
        references: z.ZodArray<z.ZodObject<{
            role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
            kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
            messageId: z.ZodOptional<z.ZodString>;
            messageIndex: z.ZodOptional<z.ZodNumber>;
            toolCallId: z.ZodOptional<z.ZodString>;
            tool: z.ZodOptional<z.ZodString>;
            archivePath: z.ZodOptional<z.ZodString>;
            checkpointCreatedAt: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
            kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
            messageId: z.ZodOptional<z.ZodString>;
            messageIndex: z.ZodOptional<z.ZodNumber>;
            toolCallId: z.ZodOptional<z.ZodString>;
            tool: z.ZodOptional<z.ZodString>;
            archivePath: z.ZodOptional<z.ZodString>;
            checkpointCreatedAt: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
            kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
            messageId: z.ZodOptional<z.ZodString>;
            messageIndex: z.ZodOptional<z.ZodNumber>;
            toolCallId: z.ZodOptional<z.ZodString>;
            tool: z.ZodOptional<z.ZodString>;
            archivePath: z.ZodOptional<z.ZodString>;
            checkpointCreatedAt: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        field: z.ZodEnum<["goal", "constraints", "done", "inProgress", "blocked", "decisions", "errorsAndFixes", "userMessages", "nextSteps", "criticalContext"]>;
        itemIndex: z.ZodNumber;
        references: z.ZodArray<z.ZodObject<{
            role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
            kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
            messageId: z.ZodOptional<z.ZodString>;
            messageIndex: z.ZodOptional<z.ZodNumber>;
            toolCallId: z.ZodOptional<z.ZodString>;
            tool: z.ZodOptional<z.ZodString>;
            archivePath: z.ZodOptional<z.ZodString>;
            checkpointCreatedAt: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
            kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
            messageId: z.ZodOptional<z.ZodString>;
            messageIndex: z.ZodOptional<z.ZodNumber>;
            toolCallId: z.ZodOptional<z.ZodString>;
            tool: z.ZodOptional<z.ZodString>;
            archivePath: z.ZodOptional<z.ZodString>;
            checkpointCreatedAt: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
            kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
            messageId: z.ZodOptional<z.ZodString>;
            messageIndex: z.ZodOptional<z.ZodNumber>;
            toolCallId: z.ZodOptional<z.ZodString>;
            tool: z.ZodOptional<z.ZodString>;
            archivePath: z.ZodOptional<z.ZodString>;
            checkpointCreatedAt: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
    }, z.ZodTypeAny, "passthrough">>, "many">>;
    parentCreatedAt: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    coveredMessageCount: z.ZodOptional<z.ZodNumber>;
    tokensAfter: z.ZodOptional<z.ZodNumber>;
    summaryProvider: z.ZodOptional<z.ZodString>;
    summaryModel: z.ZodOptional<z.ZodString>;
    summaryPromptVersion: z.ZodOptional<z.ZodNumber>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    summary: z.ZodString;
    firstKeptMessageId: z.ZodOptional<z.ZodString>;
    firstKeptMessageIndex: z.ZodNumber;
    tokensBefore: z.ZodNumber;
    compactedMessages: z.ZodNumber;
    createdAt: z.ZodEffects<z.ZodString, string, string>;
    formatVersion: z.ZodOptional<z.ZodLiteral<1>>;
    state: z.ZodOptional<z.ZodObject<{
        goal: z.ZodArray<z.ZodString, "many">;
        constraints: z.ZodArray<z.ZodString, "many">;
        done: z.ZodArray<z.ZodString, "many">;
        inProgress: z.ZodArray<z.ZodString, "many">;
        blocked: z.ZodArray<z.ZodString, "many">;
        decisions: z.ZodArray<z.ZodString, "many">;
        errorsAndFixes: z.ZodArray<z.ZodString, "many">;
        userMessages: z.ZodArray<z.ZodString, "many">;
        nextSteps: z.ZodArray<z.ZodString, "many">;
        criticalContext: z.ZodArray<z.ZodString, "many">;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        goal: z.ZodArray<z.ZodString, "many">;
        constraints: z.ZodArray<z.ZodString, "many">;
        done: z.ZodArray<z.ZodString, "many">;
        inProgress: z.ZodArray<z.ZodString, "many">;
        blocked: z.ZodArray<z.ZodString, "many">;
        decisions: z.ZodArray<z.ZodString, "many">;
        errorsAndFixes: z.ZodArray<z.ZodString, "many">;
        userMessages: z.ZodArray<z.ZodString, "many">;
        nextSteps: z.ZodArray<z.ZodString, "many">;
        criticalContext: z.ZodArray<z.ZodString, "many">;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        goal: z.ZodArray<z.ZodString, "many">;
        constraints: z.ZodArray<z.ZodString, "many">;
        done: z.ZodArray<z.ZodString, "many">;
        inProgress: z.ZodArray<z.ZodString, "many">;
        blocked: z.ZodArray<z.ZodString, "many">;
        decisions: z.ZodArray<z.ZodString, "many">;
        errorsAndFixes: z.ZodArray<z.ZodString, "many">;
        userMessages: z.ZodArray<z.ZodString, "many">;
        nextSteps: z.ZodArray<z.ZodString, "many">;
        criticalContext: z.ZodArray<z.ZodString, "many">;
    }, z.ZodTypeAny, "passthrough">>>;
    evidence: z.ZodOptional<z.ZodArray<z.ZodObject<{
        field: z.ZodEnum<["goal", "constraints", "done", "inProgress", "blocked", "decisions", "errorsAndFixes", "userMessages", "nextSteps", "criticalContext"]>;
        itemIndex: z.ZodNumber;
        references: z.ZodArray<z.ZodObject<{
            role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
            kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
            messageId: z.ZodOptional<z.ZodString>;
            messageIndex: z.ZodOptional<z.ZodNumber>;
            toolCallId: z.ZodOptional<z.ZodString>;
            tool: z.ZodOptional<z.ZodString>;
            archivePath: z.ZodOptional<z.ZodString>;
            checkpointCreatedAt: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
            kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
            messageId: z.ZodOptional<z.ZodString>;
            messageIndex: z.ZodOptional<z.ZodNumber>;
            toolCallId: z.ZodOptional<z.ZodString>;
            tool: z.ZodOptional<z.ZodString>;
            archivePath: z.ZodOptional<z.ZodString>;
            checkpointCreatedAt: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
            kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
            messageId: z.ZodOptional<z.ZodString>;
            messageIndex: z.ZodOptional<z.ZodNumber>;
            toolCallId: z.ZodOptional<z.ZodString>;
            tool: z.ZodOptional<z.ZodString>;
            archivePath: z.ZodOptional<z.ZodString>;
            checkpointCreatedAt: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        field: z.ZodEnum<["goal", "constraints", "done", "inProgress", "blocked", "decisions", "errorsAndFixes", "userMessages", "nextSteps", "criticalContext"]>;
        itemIndex: z.ZodNumber;
        references: z.ZodArray<z.ZodObject<{
            role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
            kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
            messageId: z.ZodOptional<z.ZodString>;
            messageIndex: z.ZodOptional<z.ZodNumber>;
            toolCallId: z.ZodOptional<z.ZodString>;
            tool: z.ZodOptional<z.ZodString>;
            archivePath: z.ZodOptional<z.ZodString>;
            checkpointCreatedAt: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
            kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
            messageId: z.ZodOptional<z.ZodString>;
            messageIndex: z.ZodOptional<z.ZodNumber>;
            toolCallId: z.ZodOptional<z.ZodString>;
            tool: z.ZodOptional<z.ZodString>;
            archivePath: z.ZodOptional<z.ZodString>;
            checkpointCreatedAt: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
            kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
            messageId: z.ZodOptional<z.ZodString>;
            messageIndex: z.ZodOptional<z.ZodNumber>;
            toolCallId: z.ZodOptional<z.ZodString>;
            tool: z.ZodOptional<z.ZodString>;
            archivePath: z.ZodOptional<z.ZodString>;
            checkpointCreatedAt: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        field: z.ZodEnum<["goal", "constraints", "done", "inProgress", "blocked", "decisions", "errorsAndFixes", "userMessages", "nextSteps", "criticalContext"]>;
        itemIndex: z.ZodNumber;
        references: z.ZodArray<z.ZodObject<{
            role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
            kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
            messageId: z.ZodOptional<z.ZodString>;
            messageIndex: z.ZodOptional<z.ZodNumber>;
            toolCallId: z.ZodOptional<z.ZodString>;
            tool: z.ZodOptional<z.ZodString>;
            archivePath: z.ZodOptional<z.ZodString>;
            checkpointCreatedAt: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
            kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
            messageId: z.ZodOptional<z.ZodString>;
            messageIndex: z.ZodOptional<z.ZodNumber>;
            toolCallId: z.ZodOptional<z.ZodString>;
            tool: z.ZodOptional<z.ZodString>;
            archivePath: z.ZodOptional<z.ZodString>;
            checkpointCreatedAt: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
            kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
            messageId: z.ZodOptional<z.ZodString>;
            messageIndex: z.ZodOptional<z.ZodNumber>;
            toolCallId: z.ZodOptional<z.ZodString>;
            tool: z.ZodOptional<z.ZodString>;
            archivePath: z.ZodOptional<z.ZodString>;
            checkpointCreatedAt: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
    }, z.ZodTypeAny, "passthrough">>, "many">>;
    parentCreatedAt: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    coveredMessageCount: z.ZodOptional<z.ZodNumber>;
    tokensAfter: z.ZodOptional<z.ZodNumber>;
    summaryProvider: z.ZodOptional<z.ZodString>;
    summaryModel: z.ZodOptional<z.ZodString>;
    summaryPromptVersion: z.ZodOptional<z.ZodNumber>;
}, z.ZodTypeAny, "passthrough">>;
export declare const contextUsageSchema: z.ZodObject<{
    maxTokens: z.ZodNumber;
    usedTokens: z.ZodNumber;
    omitted: z.ZodArray<z.ZodString, "many">;
    autoCompacted: z.ZodBoolean;
    source: z.ZodOptional<z.ZodEnum<["estimated", "provider"]>>;
    measuredAt: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    modelAlias: z.ZodOptional<z.ZodString>;
    contextWindowIsFallback: z.ZodOptional<z.ZodBoolean>;
    cacheHitRate: z.ZodOptional<z.ZodNumber>;
    breakdown: z.ZodOptional<z.ZodObject<{
        messages: z.ZodNumber;
        mcpTools: z.ZodNumber;
        systemTools: z.ZodNumber;
        skills: z.ZodNumber;
        systemPrompt: z.ZodNumber;
        other: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        other: number;
        skills: number;
        messages: number;
        mcpTools: number;
        systemTools: number;
        systemPrompt: number;
    }, {
        other: number;
        skills: number;
        messages: number;
        mcpTools: number;
        systemTools: number;
        systemPrompt: number;
    }>>;
    components: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        requestedTokens: z.ZodNumber;
        usedTokens: z.ZodNumber;
        disposition: z.ZodEnum<["included", "trimmed", "omitted"]>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        usedTokens: number;
        requestedTokens: number;
        disposition: "included" | "trimmed" | "omitted";
    }, {
        id: string;
        usedTokens: number;
        requestedTokens: number;
        disposition: "included" | "trimmed" | "omitted";
    }>, "many">>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    maxTokens: z.ZodNumber;
    usedTokens: z.ZodNumber;
    omitted: z.ZodArray<z.ZodString, "many">;
    autoCompacted: z.ZodBoolean;
    source: z.ZodOptional<z.ZodEnum<["estimated", "provider"]>>;
    measuredAt: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    modelAlias: z.ZodOptional<z.ZodString>;
    contextWindowIsFallback: z.ZodOptional<z.ZodBoolean>;
    cacheHitRate: z.ZodOptional<z.ZodNumber>;
    breakdown: z.ZodOptional<z.ZodObject<{
        messages: z.ZodNumber;
        mcpTools: z.ZodNumber;
        systemTools: z.ZodNumber;
        skills: z.ZodNumber;
        systemPrompt: z.ZodNumber;
        other: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        other: number;
        skills: number;
        messages: number;
        mcpTools: number;
        systemTools: number;
        systemPrompt: number;
    }, {
        other: number;
        skills: number;
        messages: number;
        mcpTools: number;
        systemTools: number;
        systemPrompt: number;
    }>>;
    components: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        requestedTokens: z.ZodNumber;
        usedTokens: z.ZodNumber;
        disposition: z.ZodEnum<["included", "trimmed", "omitted"]>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        usedTokens: number;
        requestedTokens: number;
        disposition: "included" | "trimmed" | "omitted";
    }, {
        id: string;
        usedTokens: number;
        requestedTokens: number;
        disposition: "included" | "trimmed" | "omitted";
    }>, "many">>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    maxTokens: z.ZodNumber;
    usedTokens: z.ZodNumber;
    omitted: z.ZodArray<z.ZodString, "many">;
    autoCompacted: z.ZodBoolean;
    source: z.ZodOptional<z.ZodEnum<["estimated", "provider"]>>;
    measuredAt: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    modelAlias: z.ZodOptional<z.ZodString>;
    contextWindowIsFallback: z.ZodOptional<z.ZodBoolean>;
    cacheHitRate: z.ZodOptional<z.ZodNumber>;
    breakdown: z.ZodOptional<z.ZodObject<{
        messages: z.ZodNumber;
        mcpTools: z.ZodNumber;
        systemTools: z.ZodNumber;
        skills: z.ZodNumber;
        systemPrompt: z.ZodNumber;
        other: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        other: number;
        skills: number;
        messages: number;
        mcpTools: number;
        systemTools: number;
        systemPrompt: number;
    }, {
        other: number;
        skills: number;
        messages: number;
        mcpTools: number;
        systemTools: number;
        systemPrompt: number;
    }>>;
    components: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        requestedTokens: z.ZodNumber;
        usedTokens: z.ZodNumber;
        disposition: z.ZodEnum<["included", "trimmed", "omitted"]>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        usedTokens: number;
        requestedTokens: number;
        disposition: "included" | "trimmed" | "omitted";
    }, {
        id: string;
        usedTokens: number;
        requestedTokens: number;
        disposition: "included" | "trimmed" | "omitted";
    }>, "many">>;
}, z.ZodTypeAny, "passthrough">>;
export declare const contextStateSchema: z.ZodObject<{
    budget: z.ZodObject<{
        maxTokens: z.ZodNumber;
        usedTokens: z.ZodNumber;
        omitted: z.ZodArray<z.ZodString, "many">;
        autoCompacted: z.ZodBoolean;
        source: z.ZodOptional<z.ZodEnum<["estimated", "provider"]>>;
        measuredAt: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
        modelAlias: z.ZodOptional<z.ZodString>;
        contextWindowIsFallback: z.ZodOptional<z.ZodBoolean>;
        cacheHitRate: z.ZodOptional<z.ZodNumber>;
        breakdown: z.ZodOptional<z.ZodObject<{
            messages: z.ZodNumber;
            mcpTools: z.ZodNumber;
            systemTools: z.ZodNumber;
            skills: z.ZodNumber;
            systemPrompt: z.ZodNumber;
            other: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            other: number;
            skills: number;
            messages: number;
            mcpTools: number;
            systemTools: number;
            systemPrompt: number;
        }, {
            other: number;
            skills: number;
            messages: number;
            mcpTools: number;
            systemTools: number;
            systemPrompt: number;
        }>>;
        components: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            requestedTokens: z.ZodNumber;
            usedTokens: z.ZodNumber;
            disposition: z.ZodEnum<["included", "trimmed", "omitted"]>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            usedTokens: number;
            requestedTokens: number;
            disposition: "included" | "trimmed" | "omitted";
        }, {
            id: string;
            usedTokens: number;
            requestedTokens: number;
            disposition: "included" | "trimmed" | "omitted";
        }>, "many">>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        maxTokens: z.ZodNumber;
        usedTokens: z.ZodNumber;
        omitted: z.ZodArray<z.ZodString, "many">;
        autoCompacted: z.ZodBoolean;
        source: z.ZodOptional<z.ZodEnum<["estimated", "provider"]>>;
        measuredAt: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
        modelAlias: z.ZodOptional<z.ZodString>;
        contextWindowIsFallback: z.ZodOptional<z.ZodBoolean>;
        cacheHitRate: z.ZodOptional<z.ZodNumber>;
        breakdown: z.ZodOptional<z.ZodObject<{
            messages: z.ZodNumber;
            mcpTools: z.ZodNumber;
            systemTools: z.ZodNumber;
            skills: z.ZodNumber;
            systemPrompt: z.ZodNumber;
            other: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            other: number;
            skills: number;
            messages: number;
            mcpTools: number;
            systemTools: number;
            systemPrompt: number;
        }, {
            other: number;
            skills: number;
            messages: number;
            mcpTools: number;
            systemTools: number;
            systemPrompt: number;
        }>>;
        components: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            requestedTokens: z.ZodNumber;
            usedTokens: z.ZodNumber;
            disposition: z.ZodEnum<["included", "trimmed", "omitted"]>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            usedTokens: number;
            requestedTokens: number;
            disposition: "included" | "trimmed" | "omitted";
        }, {
            id: string;
            usedTokens: number;
            requestedTokens: number;
            disposition: "included" | "trimmed" | "omitted";
        }>, "many">>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        maxTokens: z.ZodNumber;
        usedTokens: z.ZodNumber;
        omitted: z.ZodArray<z.ZodString, "many">;
        autoCompacted: z.ZodBoolean;
        source: z.ZodOptional<z.ZodEnum<["estimated", "provider"]>>;
        measuredAt: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
        modelAlias: z.ZodOptional<z.ZodString>;
        contextWindowIsFallback: z.ZodOptional<z.ZodBoolean>;
        cacheHitRate: z.ZodOptional<z.ZodNumber>;
        breakdown: z.ZodOptional<z.ZodObject<{
            messages: z.ZodNumber;
            mcpTools: z.ZodNumber;
            systemTools: z.ZodNumber;
            skills: z.ZodNumber;
            systemPrompt: z.ZodNumber;
            other: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            other: number;
            skills: number;
            messages: number;
            mcpTools: number;
            systemTools: number;
            systemPrompt: number;
        }, {
            other: number;
            skills: number;
            messages: number;
            mcpTools: number;
            systemTools: number;
            systemPrompt: number;
        }>>;
        components: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            requestedTokens: z.ZodNumber;
            usedTokens: z.ZodNumber;
            disposition: z.ZodEnum<["included", "trimmed", "omitted"]>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            usedTokens: number;
            requestedTokens: number;
            disposition: "included" | "trimmed" | "omitted";
        }, {
            id: string;
            usedTokens: number;
            requestedTokens: number;
            disposition: "included" | "trimmed" | "omitted";
        }>, "many">>;
    }, z.ZodTypeAny, "passthrough">>;
    compactedMessages: z.ZodNumber;
    summary: z.ZodOptional<z.ZodString>;
    checkpoint: z.ZodOptional<z.ZodObject<{
        summary: z.ZodString;
        firstKeptMessageId: z.ZodOptional<z.ZodString>;
        firstKeptMessageIndex: z.ZodNumber;
        tokensBefore: z.ZodNumber;
        compactedMessages: z.ZodNumber;
        createdAt: z.ZodEffects<z.ZodString, string, string>;
        formatVersion: z.ZodOptional<z.ZodLiteral<1>>;
        state: z.ZodOptional<z.ZodObject<{
            goal: z.ZodArray<z.ZodString, "many">;
            constraints: z.ZodArray<z.ZodString, "many">;
            done: z.ZodArray<z.ZodString, "many">;
            inProgress: z.ZodArray<z.ZodString, "many">;
            blocked: z.ZodArray<z.ZodString, "many">;
            decisions: z.ZodArray<z.ZodString, "many">;
            errorsAndFixes: z.ZodArray<z.ZodString, "many">;
            userMessages: z.ZodArray<z.ZodString, "many">;
            nextSteps: z.ZodArray<z.ZodString, "many">;
            criticalContext: z.ZodArray<z.ZodString, "many">;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            goal: z.ZodArray<z.ZodString, "many">;
            constraints: z.ZodArray<z.ZodString, "many">;
            done: z.ZodArray<z.ZodString, "many">;
            inProgress: z.ZodArray<z.ZodString, "many">;
            blocked: z.ZodArray<z.ZodString, "many">;
            decisions: z.ZodArray<z.ZodString, "many">;
            errorsAndFixes: z.ZodArray<z.ZodString, "many">;
            userMessages: z.ZodArray<z.ZodString, "many">;
            nextSteps: z.ZodArray<z.ZodString, "many">;
            criticalContext: z.ZodArray<z.ZodString, "many">;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            goal: z.ZodArray<z.ZodString, "many">;
            constraints: z.ZodArray<z.ZodString, "many">;
            done: z.ZodArray<z.ZodString, "many">;
            inProgress: z.ZodArray<z.ZodString, "many">;
            blocked: z.ZodArray<z.ZodString, "many">;
            decisions: z.ZodArray<z.ZodString, "many">;
            errorsAndFixes: z.ZodArray<z.ZodString, "many">;
            userMessages: z.ZodArray<z.ZodString, "many">;
            nextSteps: z.ZodArray<z.ZodString, "many">;
            criticalContext: z.ZodArray<z.ZodString, "many">;
        }, z.ZodTypeAny, "passthrough">>>;
        evidence: z.ZodOptional<z.ZodArray<z.ZodObject<{
            field: z.ZodEnum<["goal", "constraints", "done", "inProgress", "blocked", "decisions", "errorsAndFixes", "userMessages", "nextSteps", "criticalContext"]>;
            itemIndex: z.ZodNumber;
            references: z.ZodArray<z.ZodObject<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>, "many">;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            field: z.ZodEnum<["goal", "constraints", "done", "inProgress", "blocked", "decisions", "errorsAndFixes", "userMessages", "nextSteps", "criticalContext"]>;
            itemIndex: z.ZodNumber;
            references: z.ZodArray<z.ZodObject<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>, "many">;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            field: z.ZodEnum<["goal", "constraints", "done", "inProgress", "blocked", "decisions", "errorsAndFixes", "userMessages", "nextSteps", "criticalContext"]>;
            itemIndex: z.ZodNumber;
            references: z.ZodArray<z.ZodObject<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>, "many">;
        }, z.ZodTypeAny, "passthrough">>, "many">>;
        parentCreatedAt: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
        coveredMessageCount: z.ZodOptional<z.ZodNumber>;
        tokensAfter: z.ZodOptional<z.ZodNumber>;
        summaryProvider: z.ZodOptional<z.ZodString>;
        summaryModel: z.ZodOptional<z.ZodString>;
        summaryPromptVersion: z.ZodOptional<z.ZodNumber>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        summary: z.ZodString;
        firstKeptMessageId: z.ZodOptional<z.ZodString>;
        firstKeptMessageIndex: z.ZodNumber;
        tokensBefore: z.ZodNumber;
        compactedMessages: z.ZodNumber;
        createdAt: z.ZodEffects<z.ZodString, string, string>;
        formatVersion: z.ZodOptional<z.ZodLiteral<1>>;
        state: z.ZodOptional<z.ZodObject<{
            goal: z.ZodArray<z.ZodString, "many">;
            constraints: z.ZodArray<z.ZodString, "many">;
            done: z.ZodArray<z.ZodString, "many">;
            inProgress: z.ZodArray<z.ZodString, "many">;
            blocked: z.ZodArray<z.ZodString, "many">;
            decisions: z.ZodArray<z.ZodString, "many">;
            errorsAndFixes: z.ZodArray<z.ZodString, "many">;
            userMessages: z.ZodArray<z.ZodString, "many">;
            nextSteps: z.ZodArray<z.ZodString, "many">;
            criticalContext: z.ZodArray<z.ZodString, "many">;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            goal: z.ZodArray<z.ZodString, "many">;
            constraints: z.ZodArray<z.ZodString, "many">;
            done: z.ZodArray<z.ZodString, "many">;
            inProgress: z.ZodArray<z.ZodString, "many">;
            blocked: z.ZodArray<z.ZodString, "many">;
            decisions: z.ZodArray<z.ZodString, "many">;
            errorsAndFixes: z.ZodArray<z.ZodString, "many">;
            userMessages: z.ZodArray<z.ZodString, "many">;
            nextSteps: z.ZodArray<z.ZodString, "many">;
            criticalContext: z.ZodArray<z.ZodString, "many">;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            goal: z.ZodArray<z.ZodString, "many">;
            constraints: z.ZodArray<z.ZodString, "many">;
            done: z.ZodArray<z.ZodString, "many">;
            inProgress: z.ZodArray<z.ZodString, "many">;
            blocked: z.ZodArray<z.ZodString, "many">;
            decisions: z.ZodArray<z.ZodString, "many">;
            errorsAndFixes: z.ZodArray<z.ZodString, "many">;
            userMessages: z.ZodArray<z.ZodString, "many">;
            nextSteps: z.ZodArray<z.ZodString, "many">;
            criticalContext: z.ZodArray<z.ZodString, "many">;
        }, z.ZodTypeAny, "passthrough">>>;
        evidence: z.ZodOptional<z.ZodArray<z.ZodObject<{
            field: z.ZodEnum<["goal", "constraints", "done", "inProgress", "blocked", "decisions", "errorsAndFixes", "userMessages", "nextSteps", "criticalContext"]>;
            itemIndex: z.ZodNumber;
            references: z.ZodArray<z.ZodObject<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>, "many">;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            field: z.ZodEnum<["goal", "constraints", "done", "inProgress", "blocked", "decisions", "errorsAndFixes", "userMessages", "nextSteps", "criticalContext"]>;
            itemIndex: z.ZodNumber;
            references: z.ZodArray<z.ZodObject<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>, "many">;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            field: z.ZodEnum<["goal", "constraints", "done", "inProgress", "blocked", "decisions", "errorsAndFixes", "userMessages", "nextSteps", "criticalContext"]>;
            itemIndex: z.ZodNumber;
            references: z.ZodArray<z.ZodObject<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>, "many">;
        }, z.ZodTypeAny, "passthrough">>, "many">>;
        parentCreatedAt: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
        coveredMessageCount: z.ZodOptional<z.ZodNumber>;
        tokensAfter: z.ZodOptional<z.ZodNumber>;
        summaryProvider: z.ZodOptional<z.ZodString>;
        summaryModel: z.ZodOptional<z.ZodString>;
        summaryPromptVersion: z.ZodOptional<z.ZodNumber>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        summary: z.ZodString;
        firstKeptMessageId: z.ZodOptional<z.ZodString>;
        firstKeptMessageIndex: z.ZodNumber;
        tokensBefore: z.ZodNumber;
        compactedMessages: z.ZodNumber;
        createdAt: z.ZodEffects<z.ZodString, string, string>;
        formatVersion: z.ZodOptional<z.ZodLiteral<1>>;
        state: z.ZodOptional<z.ZodObject<{
            goal: z.ZodArray<z.ZodString, "many">;
            constraints: z.ZodArray<z.ZodString, "many">;
            done: z.ZodArray<z.ZodString, "many">;
            inProgress: z.ZodArray<z.ZodString, "many">;
            blocked: z.ZodArray<z.ZodString, "many">;
            decisions: z.ZodArray<z.ZodString, "many">;
            errorsAndFixes: z.ZodArray<z.ZodString, "many">;
            userMessages: z.ZodArray<z.ZodString, "many">;
            nextSteps: z.ZodArray<z.ZodString, "many">;
            criticalContext: z.ZodArray<z.ZodString, "many">;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            goal: z.ZodArray<z.ZodString, "many">;
            constraints: z.ZodArray<z.ZodString, "many">;
            done: z.ZodArray<z.ZodString, "many">;
            inProgress: z.ZodArray<z.ZodString, "many">;
            blocked: z.ZodArray<z.ZodString, "many">;
            decisions: z.ZodArray<z.ZodString, "many">;
            errorsAndFixes: z.ZodArray<z.ZodString, "many">;
            userMessages: z.ZodArray<z.ZodString, "many">;
            nextSteps: z.ZodArray<z.ZodString, "many">;
            criticalContext: z.ZodArray<z.ZodString, "many">;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            goal: z.ZodArray<z.ZodString, "many">;
            constraints: z.ZodArray<z.ZodString, "many">;
            done: z.ZodArray<z.ZodString, "many">;
            inProgress: z.ZodArray<z.ZodString, "many">;
            blocked: z.ZodArray<z.ZodString, "many">;
            decisions: z.ZodArray<z.ZodString, "many">;
            errorsAndFixes: z.ZodArray<z.ZodString, "many">;
            userMessages: z.ZodArray<z.ZodString, "many">;
            nextSteps: z.ZodArray<z.ZodString, "many">;
            criticalContext: z.ZodArray<z.ZodString, "many">;
        }, z.ZodTypeAny, "passthrough">>>;
        evidence: z.ZodOptional<z.ZodArray<z.ZodObject<{
            field: z.ZodEnum<["goal", "constraints", "done", "inProgress", "blocked", "decisions", "errorsAndFixes", "userMessages", "nextSteps", "criticalContext"]>;
            itemIndex: z.ZodNumber;
            references: z.ZodArray<z.ZodObject<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>, "many">;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            field: z.ZodEnum<["goal", "constraints", "done", "inProgress", "blocked", "decisions", "errorsAndFixes", "userMessages", "nextSteps", "criticalContext"]>;
            itemIndex: z.ZodNumber;
            references: z.ZodArray<z.ZodObject<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>, "many">;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            field: z.ZodEnum<["goal", "constraints", "done", "inProgress", "blocked", "decisions", "errorsAndFixes", "userMessages", "nextSteps", "criticalContext"]>;
            itemIndex: z.ZodNumber;
            references: z.ZodArray<z.ZodObject<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>, "many">;
        }, z.ZodTypeAny, "passthrough">>, "many">>;
        parentCreatedAt: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
        coveredMessageCount: z.ZodOptional<z.ZodNumber>;
        tokensAfter: z.ZodOptional<z.ZodNumber>;
        summaryProvider: z.ZodOptional<z.ZodString>;
        summaryModel: z.ZodOptional<z.ZodString>;
        summaryPromptVersion: z.ZodOptional<z.ZodNumber>;
    }, z.ZodTypeAny, "passthrough">>>;
    lastCompactedAt: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    usageAnchor: z.ZodOptional<z.ZodObject<{
        fixedFingerprint: z.ZodString;
        messageFingerprints: z.ZodArray<z.ZodString, "many">;
        inputTokens: z.ZodNumber;
        measuredAt: z.ZodEffects<z.ZodString, string, string>;
    }, "strip", z.ZodTypeAny, {
        inputTokens: number;
        measuredAt: string;
        fixedFingerprint: string;
        messageFingerprints: string[];
    }, {
        inputTokens: number;
        measuredAt: string;
        fixedFingerprint: string;
        messageFingerprints: string[];
    }>>;
    compactionFailure: z.ZodOptional<z.ZodEffects<z.ZodObject<{
        inputFingerprint: z.ZodString;
        kind: z.ZodEnum<["invalid_structure", "invalid_evidence", "empty_checkpoint", "output_truncated", "incomplete_response", "input_budget", "no_savings", "provider_error"]>;
        failedAt: z.ZodNumber;
        retryAfter: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        kind: "provider_error" | "invalid_structure" | "invalid_evidence" | "empty_checkpoint" | "output_truncated" | "incomplete_response" | "input_budget" | "no_savings";
        inputFingerprint: string;
        failedAt: number;
        retryAfter: number;
    }, {
        kind: "provider_error" | "invalid_structure" | "invalid_evidence" | "empty_checkpoint" | "output_truncated" | "incomplete_response" | "input_budget" | "no_savings";
        inputFingerprint: string;
        failedAt: number;
        retryAfter: number;
    }>, {
        kind: "provider_error" | "invalid_structure" | "invalid_evidence" | "empty_checkpoint" | "output_truncated" | "incomplete_response" | "input_budget" | "no_savings";
        inputFingerprint: string;
        failedAt: number;
        retryAfter: number;
    }, {
        kind: "provider_error" | "invalid_structure" | "invalid_evidence" | "empty_checkpoint" | "output_truncated" | "incomplete_response" | "input_budget" | "no_savings";
        inputFingerprint: string;
        failedAt: number;
        retryAfter: number;
    }>>;
    promptEpoch: z.ZodOptional<z.ZodNumber>;
    promptEpochReason: z.ZodOptional<z.ZodEnum<["initial", "compaction", "rewind", "fork", "provider_changed", "model_changed", "tool_schema_changed"]>>;
    promptEpochCreatedAt: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    promptProvider: z.ZodOptional<z.ZodString>;
    promptModel: z.ZodOptional<z.ZodString>;
    toolSchemaHash: z.ZodOptional<z.ZodString>;
    personalization: z.ZodOptional<z.ZodObject<{
        personality: z.ZodOptional<z.ZodString>;
        configVersion: z.ZodOptional<z.ZodNumber>;
        instructionsHash: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        personality: z.ZodOptional<z.ZodString>;
        configVersion: z.ZodOptional<z.ZodNumber>;
        instructionsHash: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        personality: z.ZodOptional<z.ZodString>;
        configVersion: z.ZodOptional<z.ZodNumber>;
        instructionsHash: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    budget: z.ZodObject<{
        maxTokens: z.ZodNumber;
        usedTokens: z.ZodNumber;
        omitted: z.ZodArray<z.ZodString, "many">;
        autoCompacted: z.ZodBoolean;
        source: z.ZodOptional<z.ZodEnum<["estimated", "provider"]>>;
        measuredAt: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
        modelAlias: z.ZodOptional<z.ZodString>;
        contextWindowIsFallback: z.ZodOptional<z.ZodBoolean>;
        cacheHitRate: z.ZodOptional<z.ZodNumber>;
        breakdown: z.ZodOptional<z.ZodObject<{
            messages: z.ZodNumber;
            mcpTools: z.ZodNumber;
            systemTools: z.ZodNumber;
            skills: z.ZodNumber;
            systemPrompt: z.ZodNumber;
            other: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            other: number;
            skills: number;
            messages: number;
            mcpTools: number;
            systemTools: number;
            systemPrompt: number;
        }, {
            other: number;
            skills: number;
            messages: number;
            mcpTools: number;
            systemTools: number;
            systemPrompt: number;
        }>>;
        components: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            requestedTokens: z.ZodNumber;
            usedTokens: z.ZodNumber;
            disposition: z.ZodEnum<["included", "trimmed", "omitted"]>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            usedTokens: number;
            requestedTokens: number;
            disposition: "included" | "trimmed" | "omitted";
        }, {
            id: string;
            usedTokens: number;
            requestedTokens: number;
            disposition: "included" | "trimmed" | "omitted";
        }>, "many">>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        maxTokens: z.ZodNumber;
        usedTokens: z.ZodNumber;
        omitted: z.ZodArray<z.ZodString, "many">;
        autoCompacted: z.ZodBoolean;
        source: z.ZodOptional<z.ZodEnum<["estimated", "provider"]>>;
        measuredAt: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
        modelAlias: z.ZodOptional<z.ZodString>;
        contextWindowIsFallback: z.ZodOptional<z.ZodBoolean>;
        cacheHitRate: z.ZodOptional<z.ZodNumber>;
        breakdown: z.ZodOptional<z.ZodObject<{
            messages: z.ZodNumber;
            mcpTools: z.ZodNumber;
            systemTools: z.ZodNumber;
            skills: z.ZodNumber;
            systemPrompt: z.ZodNumber;
            other: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            other: number;
            skills: number;
            messages: number;
            mcpTools: number;
            systemTools: number;
            systemPrompt: number;
        }, {
            other: number;
            skills: number;
            messages: number;
            mcpTools: number;
            systemTools: number;
            systemPrompt: number;
        }>>;
        components: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            requestedTokens: z.ZodNumber;
            usedTokens: z.ZodNumber;
            disposition: z.ZodEnum<["included", "trimmed", "omitted"]>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            usedTokens: number;
            requestedTokens: number;
            disposition: "included" | "trimmed" | "omitted";
        }, {
            id: string;
            usedTokens: number;
            requestedTokens: number;
            disposition: "included" | "trimmed" | "omitted";
        }>, "many">>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        maxTokens: z.ZodNumber;
        usedTokens: z.ZodNumber;
        omitted: z.ZodArray<z.ZodString, "many">;
        autoCompacted: z.ZodBoolean;
        source: z.ZodOptional<z.ZodEnum<["estimated", "provider"]>>;
        measuredAt: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
        modelAlias: z.ZodOptional<z.ZodString>;
        contextWindowIsFallback: z.ZodOptional<z.ZodBoolean>;
        cacheHitRate: z.ZodOptional<z.ZodNumber>;
        breakdown: z.ZodOptional<z.ZodObject<{
            messages: z.ZodNumber;
            mcpTools: z.ZodNumber;
            systemTools: z.ZodNumber;
            skills: z.ZodNumber;
            systemPrompt: z.ZodNumber;
            other: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            other: number;
            skills: number;
            messages: number;
            mcpTools: number;
            systemTools: number;
            systemPrompt: number;
        }, {
            other: number;
            skills: number;
            messages: number;
            mcpTools: number;
            systemTools: number;
            systemPrompt: number;
        }>>;
        components: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            requestedTokens: z.ZodNumber;
            usedTokens: z.ZodNumber;
            disposition: z.ZodEnum<["included", "trimmed", "omitted"]>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            usedTokens: number;
            requestedTokens: number;
            disposition: "included" | "trimmed" | "omitted";
        }, {
            id: string;
            usedTokens: number;
            requestedTokens: number;
            disposition: "included" | "trimmed" | "omitted";
        }>, "many">>;
    }, z.ZodTypeAny, "passthrough">>;
    compactedMessages: z.ZodNumber;
    summary: z.ZodOptional<z.ZodString>;
    checkpoint: z.ZodOptional<z.ZodObject<{
        summary: z.ZodString;
        firstKeptMessageId: z.ZodOptional<z.ZodString>;
        firstKeptMessageIndex: z.ZodNumber;
        tokensBefore: z.ZodNumber;
        compactedMessages: z.ZodNumber;
        createdAt: z.ZodEffects<z.ZodString, string, string>;
        formatVersion: z.ZodOptional<z.ZodLiteral<1>>;
        state: z.ZodOptional<z.ZodObject<{
            goal: z.ZodArray<z.ZodString, "many">;
            constraints: z.ZodArray<z.ZodString, "many">;
            done: z.ZodArray<z.ZodString, "many">;
            inProgress: z.ZodArray<z.ZodString, "many">;
            blocked: z.ZodArray<z.ZodString, "many">;
            decisions: z.ZodArray<z.ZodString, "many">;
            errorsAndFixes: z.ZodArray<z.ZodString, "many">;
            userMessages: z.ZodArray<z.ZodString, "many">;
            nextSteps: z.ZodArray<z.ZodString, "many">;
            criticalContext: z.ZodArray<z.ZodString, "many">;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            goal: z.ZodArray<z.ZodString, "many">;
            constraints: z.ZodArray<z.ZodString, "many">;
            done: z.ZodArray<z.ZodString, "many">;
            inProgress: z.ZodArray<z.ZodString, "many">;
            blocked: z.ZodArray<z.ZodString, "many">;
            decisions: z.ZodArray<z.ZodString, "many">;
            errorsAndFixes: z.ZodArray<z.ZodString, "many">;
            userMessages: z.ZodArray<z.ZodString, "many">;
            nextSteps: z.ZodArray<z.ZodString, "many">;
            criticalContext: z.ZodArray<z.ZodString, "many">;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            goal: z.ZodArray<z.ZodString, "many">;
            constraints: z.ZodArray<z.ZodString, "many">;
            done: z.ZodArray<z.ZodString, "many">;
            inProgress: z.ZodArray<z.ZodString, "many">;
            blocked: z.ZodArray<z.ZodString, "many">;
            decisions: z.ZodArray<z.ZodString, "many">;
            errorsAndFixes: z.ZodArray<z.ZodString, "many">;
            userMessages: z.ZodArray<z.ZodString, "many">;
            nextSteps: z.ZodArray<z.ZodString, "many">;
            criticalContext: z.ZodArray<z.ZodString, "many">;
        }, z.ZodTypeAny, "passthrough">>>;
        evidence: z.ZodOptional<z.ZodArray<z.ZodObject<{
            field: z.ZodEnum<["goal", "constraints", "done", "inProgress", "blocked", "decisions", "errorsAndFixes", "userMessages", "nextSteps", "criticalContext"]>;
            itemIndex: z.ZodNumber;
            references: z.ZodArray<z.ZodObject<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>, "many">;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            field: z.ZodEnum<["goal", "constraints", "done", "inProgress", "blocked", "decisions", "errorsAndFixes", "userMessages", "nextSteps", "criticalContext"]>;
            itemIndex: z.ZodNumber;
            references: z.ZodArray<z.ZodObject<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>, "many">;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            field: z.ZodEnum<["goal", "constraints", "done", "inProgress", "blocked", "decisions", "errorsAndFixes", "userMessages", "nextSteps", "criticalContext"]>;
            itemIndex: z.ZodNumber;
            references: z.ZodArray<z.ZodObject<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>, "many">;
        }, z.ZodTypeAny, "passthrough">>, "many">>;
        parentCreatedAt: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
        coveredMessageCount: z.ZodOptional<z.ZodNumber>;
        tokensAfter: z.ZodOptional<z.ZodNumber>;
        summaryProvider: z.ZodOptional<z.ZodString>;
        summaryModel: z.ZodOptional<z.ZodString>;
        summaryPromptVersion: z.ZodOptional<z.ZodNumber>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        summary: z.ZodString;
        firstKeptMessageId: z.ZodOptional<z.ZodString>;
        firstKeptMessageIndex: z.ZodNumber;
        tokensBefore: z.ZodNumber;
        compactedMessages: z.ZodNumber;
        createdAt: z.ZodEffects<z.ZodString, string, string>;
        formatVersion: z.ZodOptional<z.ZodLiteral<1>>;
        state: z.ZodOptional<z.ZodObject<{
            goal: z.ZodArray<z.ZodString, "many">;
            constraints: z.ZodArray<z.ZodString, "many">;
            done: z.ZodArray<z.ZodString, "many">;
            inProgress: z.ZodArray<z.ZodString, "many">;
            blocked: z.ZodArray<z.ZodString, "many">;
            decisions: z.ZodArray<z.ZodString, "many">;
            errorsAndFixes: z.ZodArray<z.ZodString, "many">;
            userMessages: z.ZodArray<z.ZodString, "many">;
            nextSteps: z.ZodArray<z.ZodString, "many">;
            criticalContext: z.ZodArray<z.ZodString, "many">;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            goal: z.ZodArray<z.ZodString, "many">;
            constraints: z.ZodArray<z.ZodString, "many">;
            done: z.ZodArray<z.ZodString, "many">;
            inProgress: z.ZodArray<z.ZodString, "many">;
            blocked: z.ZodArray<z.ZodString, "many">;
            decisions: z.ZodArray<z.ZodString, "many">;
            errorsAndFixes: z.ZodArray<z.ZodString, "many">;
            userMessages: z.ZodArray<z.ZodString, "many">;
            nextSteps: z.ZodArray<z.ZodString, "many">;
            criticalContext: z.ZodArray<z.ZodString, "many">;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            goal: z.ZodArray<z.ZodString, "many">;
            constraints: z.ZodArray<z.ZodString, "many">;
            done: z.ZodArray<z.ZodString, "many">;
            inProgress: z.ZodArray<z.ZodString, "many">;
            blocked: z.ZodArray<z.ZodString, "many">;
            decisions: z.ZodArray<z.ZodString, "many">;
            errorsAndFixes: z.ZodArray<z.ZodString, "many">;
            userMessages: z.ZodArray<z.ZodString, "many">;
            nextSteps: z.ZodArray<z.ZodString, "many">;
            criticalContext: z.ZodArray<z.ZodString, "many">;
        }, z.ZodTypeAny, "passthrough">>>;
        evidence: z.ZodOptional<z.ZodArray<z.ZodObject<{
            field: z.ZodEnum<["goal", "constraints", "done", "inProgress", "blocked", "decisions", "errorsAndFixes", "userMessages", "nextSteps", "criticalContext"]>;
            itemIndex: z.ZodNumber;
            references: z.ZodArray<z.ZodObject<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>, "many">;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            field: z.ZodEnum<["goal", "constraints", "done", "inProgress", "blocked", "decisions", "errorsAndFixes", "userMessages", "nextSteps", "criticalContext"]>;
            itemIndex: z.ZodNumber;
            references: z.ZodArray<z.ZodObject<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>, "many">;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            field: z.ZodEnum<["goal", "constraints", "done", "inProgress", "blocked", "decisions", "errorsAndFixes", "userMessages", "nextSteps", "criticalContext"]>;
            itemIndex: z.ZodNumber;
            references: z.ZodArray<z.ZodObject<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>, "many">;
        }, z.ZodTypeAny, "passthrough">>, "many">>;
        parentCreatedAt: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
        coveredMessageCount: z.ZodOptional<z.ZodNumber>;
        tokensAfter: z.ZodOptional<z.ZodNumber>;
        summaryProvider: z.ZodOptional<z.ZodString>;
        summaryModel: z.ZodOptional<z.ZodString>;
        summaryPromptVersion: z.ZodOptional<z.ZodNumber>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        summary: z.ZodString;
        firstKeptMessageId: z.ZodOptional<z.ZodString>;
        firstKeptMessageIndex: z.ZodNumber;
        tokensBefore: z.ZodNumber;
        compactedMessages: z.ZodNumber;
        createdAt: z.ZodEffects<z.ZodString, string, string>;
        formatVersion: z.ZodOptional<z.ZodLiteral<1>>;
        state: z.ZodOptional<z.ZodObject<{
            goal: z.ZodArray<z.ZodString, "many">;
            constraints: z.ZodArray<z.ZodString, "many">;
            done: z.ZodArray<z.ZodString, "many">;
            inProgress: z.ZodArray<z.ZodString, "many">;
            blocked: z.ZodArray<z.ZodString, "many">;
            decisions: z.ZodArray<z.ZodString, "many">;
            errorsAndFixes: z.ZodArray<z.ZodString, "many">;
            userMessages: z.ZodArray<z.ZodString, "many">;
            nextSteps: z.ZodArray<z.ZodString, "many">;
            criticalContext: z.ZodArray<z.ZodString, "many">;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            goal: z.ZodArray<z.ZodString, "many">;
            constraints: z.ZodArray<z.ZodString, "many">;
            done: z.ZodArray<z.ZodString, "many">;
            inProgress: z.ZodArray<z.ZodString, "many">;
            blocked: z.ZodArray<z.ZodString, "many">;
            decisions: z.ZodArray<z.ZodString, "many">;
            errorsAndFixes: z.ZodArray<z.ZodString, "many">;
            userMessages: z.ZodArray<z.ZodString, "many">;
            nextSteps: z.ZodArray<z.ZodString, "many">;
            criticalContext: z.ZodArray<z.ZodString, "many">;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            goal: z.ZodArray<z.ZodString, "many">;
            constraints: z.ZodArray<z.ZodString, "many">;
            done: z.ZodArray<z.ZodString, "many">;
            inProgress: z.ZodArray<z.ZodString, "many">;
            blocked: z.ZodArray<z.ZodString, "many">;
            decisions: z.ZodArray<z.ZodString, "many">;
            errorsAndFixes: z.ZodArray<z.ZodString, "many">;
            userMessages: z.ZodArray<z.ZodString, "many">;
            nextSteps: z.ZodArray<z.ZodString, "many">;
            criticalContext: z.ZodArray<z.ZodString, "many">;
        }, z.ZodTypeAny, "passthrough">>>;
        evidence: z.ZodOptional<z.ZodArray<z.ZodObject<{
            field: z.ZodEnum<["goal", "constraints", "done", "inProgress", "blocked", "decisions", "errorsAndFixes", "userMessages", "nextSteps", "criticalContext"]>;
            itemIndex: z.ZodNumber;
            references: z.ZodArray<z.ZodObject<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>, "many">;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            field: z.ZodEnum<["goal", "constraints", "done", "inProgress", "blocked", "decisions", "errorsAndFixes", "userMessages", "nextSteps", "criticalContext"]>;
            itemIndex: z.ZodNumber;
            references: z.ZodArray<z.ZodObject<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>, "many">;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            field: z.ZodEnum<["goal", "constraints", "done", "inProgress", "blocked", "decisions", "errorsAndFixes", "userMessages", "nextSteps", "criticalContext"]>;
            itemIndex: z.ZodNumber;
            references: z.ZodArray<z.ZodObject<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>, "many">;
        }, z.ZodTypeAny, "passthrough">>, "many">>;
        parentCreatedAt: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
        coveredMessageCount: z.ZodOptional<z.ZodNumber>;
        tokensAfter: z.ZodOptional<z.ZodNumber>;
        summaryProvider: z.ZodOptional<z.ZodString>;
        summaryModel: z.ZodOptional<z.ZodString>;
        summaryPromptVersion: z.ZodOptional<z.ZodNumber>;
    }, z.ZodTypeAny, "passthrough">>>;
    lastCompactedAt: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    usageAnchor: z.ZodOptional<z.ZodObject<{
        fixedFingerprint: z.ZodString;
        messageFingerprints: z.ZodArray<z.ZodString, "many">;
        inputTokens: z.ZodNumber;
        measuredAt: z.ZodEffects<z.ZodString, string, string>;
    }, "strip", z.ZodTypeAny, {
        inputTokens: number;
        measuredAt: string;
        fixedFingerprint: string;
        messageFingerprints: string[];
    }, {
        inputTokens: number;
        measuredAt: string;
        fixedFingerprint: string;
        messageFingerprints: string[];
    }>>;
    compactionFailure: z.ZodOptional<z.ZodEffects<z.ZodObject<{
        inputFingerprint: z.ZodString;
        kind: z.ZodEnum<["invalid_structure", "invalid_evidence", "empty_checkpoint", "output_truncated", "incomplete_response", "input_budget", "no_savings", "provider_error"]>;
        failedAt: z.ZodNumber;
        retryAfter: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        kind: "provider_error" | "invalid_structure" | "invalid_evidence" | "empty_checkpoint" | "output_truncated" | "incomplete_response" | "input_budget" | "no_savings";
        inputFingerprint: string;
        failedAt: number;
        retryAfter: number;
    }, {
        kind: "provider_error" | "invalid_structure" | "invalid_evidence" | "empty_checkpoint" | "output_truncated" | "incomplete_response" | "input_budget" | "no_savings";
        inputFingerprint: string;
        failedAt: number;
        retryAfter: number;
    }>, {
        kind: "provider_error" | "invalid_structure" | "invalid_evidence" | "empty_checkpoint" | "output_truncated" | "incomplete_response" | "input_budget" | "no_savings";
        inputFingerprint: string;
        failedAt: number;
        retryAfter: number;
    }, {
        kind: "provider_error" | "invalid_structure" | "invalid_evidence" | "empty_checkpoint" | "output_truncated" | "incomplete_response" | "input_budget" | "no_savings";
        inputFingerprint: string;
        failedAt: number;
        retryAfter: number;
    }>>;
    promptEpoch: z.ZodOptional<z.ZodNumber>;
    promptEpochReason: z.ZodOptional<z.ZodEnum<["initial", "compaction", "rewind", "fork", "provider_changed", "model_changed", "tool_schema_changed"]>>;
    promptEpochCreatedAt: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    promptProvider: z.ZodOptional<z.ZodString>;
    promptModel: z.ZodOptional<z.ZodString>;
    toolSchemaHash: z.ZodOptional<z.ZodString>;
    personalization: z.ZodOptional<z.ZodObject<{
        personality: z.ZodOptional<z.ZodString>;
        configVersion: z.ZodOptional<z.ZodNumber>;
        instructionsHash: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        personality: z.ZodOptional<z.ZodString>;
        configVersion: z.ZodOptional<z.ZodNumber>;
        instructionsHash: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        personality: z.ZodOptional<z.ZodString>;
        configVersion: z.ZodOptional<z.ZodNumber>;
        instructionsHash: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    budget: z.ZodObject<{
        maxTokens: z.ZodNumber;
        usedTokens: z.ZodNumber;
        omitted: z.ZodArray<z.ZodString, "many">;
        autoCompacted: z.ZodBoolean;
        source: z.ZodOptional<z.ZodEnum<["estimated", "provider"]>>;
        measuredAt: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
        modelAlias: z.ZodOptional<z.ZodString>;
        contextWindowIsFallback: z.ZodOptional<z.ZodBoolean>;
        cacheHitRate: z.ZodOptional<z.ZodNumber>;
        breakdown: z.ZodOptional<z.ZodObject<{
            messages: z.ZodNumber;
            mcpTools: z.ZodNumber;
            systemTools: z.ZodNumber;
            skills: z.ZodNumber;
            systemPrompt: z.ZodNumber;
            other: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            other: number;
            skills: number;
            messages: number;
            mcpTools: number;
            systemTools: number;
            systemPrompt: number;
        }, {
            other: number;
            skills: number;
            messages: number;
            mcpTools: number;
            systemTools: number;
            systemPrompt: number;
        }>>;
        components: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            requestedTokens: z.ZodNumber;
            usedTokens: z.ZodNumber;
            disposition: z.ZodEnum<["included", "trimmed", "omitted"]>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            usedTokens: number;
            requestedTokens: number;
            disposition: "included" | "trimmed" | "omitted";
        }, {
            id: string;
            usedTokens: number;
            requestedTokens: number;
            disposition: "included" | "trimmed" | "omitted";
        }>, "many">>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        maxTokens: z.ZodNumber;
        usedTokens: z.ZodNumber;
        omitted: z.ZodArray<z.ZodString, "many">;
        autoCompacted: z.ZodBoolean;
        source: z.ZodOptional<z.ZodEnum<["estimated", "provider"]>>;
        measuredAt: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
        modelAlias: z.ZodOptional<z.ZodString>;
        contextWindowIsFallback: z.ZodOptional<z.ZodBoolean>;
        cacheHitRate: z.ZodOptional<z.ZodNumber>;
        breakdown: z.ZodOptional<z.ZodObject<{
            messages: z.ZodNumber;
            mcpTools: z.ZodNumber;
            systemTools: z.ZodNumber;
            skills: z.ZodNumber;
            systemPrompt: z.ZodNumber;
            other: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            other: number;
            skills: number;
            messages: number;
            mcpTools: number;
            systemTools: number;
            systemPrompt: number;
        }, {
            other: number;
            skills: number;
            messages: number;
            mcpTools: number;
            systemTools: number;
            systemPrompt: number;
        }>>;
        components: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            requestedTokens: z.ZodNumber;
            usedTokens: z.ZodNumber;
            disposition: z.ZodEnum<["included", "trimmed", "omitted"]>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            usedTokens: number;
            requestedTokens: number;
            disposition: "included" | "trimmed" | "omitted";
        }, {
            id: string;
            usedTokens: number;
            requestedTokens: number;
            disposition: "included" | "trimmed" | "omitted";
        }>, "many">>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        maxTokens: z.ZodNumber;
        usedTokens: z.ZodNumber;
        omitted: z.ZodArray<z.ZodString, "many">;
        autoCompacted: z.ZodBoolean;
        source: z.ZodOptional<z.ZodEnum<["estimated", "provider"]>>;
        measuredAt: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
        modelAlias: z.ZodOptional<z.ZodString>;
        contextWindowIsFallback: z.ZodOptional<z.ZodBoolean>;
        cacheHitRate: z.ZodOptional<z.ZodNumber>;
        breakdown: z.ZodOptional<z.ZodObject<{
            messages: z.ZodNumber;
            mcpTools: z.ZodNumber;
            systemTools: z.ZodNumber;
            skills: z.ZodNumber;
            systemPrompt: z.ZodNumber;
            other: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            other: number;
            skills: number;
            messages: number;
            mcpTools: number;
            systemTools: number;
            systemPrompt: number;
        }, {
            other: number;
            skills: number;
            messages: number;
            mcpTools: number;
            systemTools: number;
            systemPrompt: number;
        }>>;
        components: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            requestedTokens: z.ZodNumber;
            usedTokens: z.ZodNumber;
            disposition: z.ZodEnum<["included", "trimmed", "omitted"]>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            usedTokens: number;
            requestedTokens: number;
            disposition: "included" | "trimmed" | "omitted";
        }, {
            id: string;
            usedTokens: number;
            requestedTokens: number;
            disposition: "included" | "trimmed" | "omitted";
        }>, "many">>;
    }, z.ZodTypeAny, "passthrough">>;
    compactedMessages: z.ZodNumber;
    summary: z.ZodOptional<z.ZodString>;
    checkpoint: z.ZodOptional<z.ZodObject<{
        summary: z.ZodString;
        firstKeptMessageId: z.ZodOptional<z.ZodString>;
        firstKeptMessageIndex: z.ZodNumber;
        tokensBefore: z.ZodNumber;
        compactedMessages: z.ZodNumber;
        createdAt: z.ZodEffects<z.ZodString, string, string>;
        formatVersion: z.ZodOptional<z.ZodLiteral<1>>;
        state: z.ZodOptional<z.ZodObject<{
            goal: z.ZodArray<z.ZodString, "many">;
            constraints: z.ZodArray<z.ZodString, "many">;
            done: z.ZodArray<z.ZodString, "many">;
            inProgress: z.ZodArray<z.ZodString, "many">;
            blocked: z.ZodArray<z.ZodString, "many">;
            decisions: z.ZodArray<z.ZodString, "many">;
            errorsAndFixes: z.ZodArray<z.ZodString, "many">;
            userMessages: z.ZodArray<z.ZodString, "many">;
            nextSteps: z.ZodArray<z.ZodString, "many">;
            criticalContext: z.ZodArray<z.ZodString, "many">;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            goal: z.ZodArray<z.ZodString, "many">;
            constraints: z.ZodArray<z.ZodString, "many">;
            done: z.ZodArray<z.ZodString, "many">;
            inProgress: z.ZodArray<z.ZodString, "many">;
            blocked: z.ZodArray<z.ZodString, "many">;
            decisions: z.ZodArray<z.ZodString, "many">;
            errorsAndFixes: z.ZodArray<z.ZodString, "many">;
            userMessages: z.ZodArray<z.ZodString, "many">;
            nextSteps: z.ZodArray<z.ZodString, "many">;
            criticalContext: z.ZodArray<z.ZodString, "many">;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            goal: z.ZodArray<z.ZodString, "many">;
            constraints: z.ZodArray<z.ZodString, "many">;
            done: z.ZodArray<z.ZodString, "many">;
            inProgress: z.ZodArray<z.ZodString, "many">;
            blocked: z.ZodArray<z.ZodString, "many">;
            decisions: z.ZodArray<z.ZodString, "many">;
            errorsAndFixes: z.ZodArray<z.ZodString, "many">;
            userMessages: z.ZodArray<z.ZodString, "many">;
            nextSteps: z.ZodArray<z.ZodString, "many">;
            criticalContext: z.ZodArray<z.ZodString, "many">;
        }, z.ZodTypeAny, "passthrough">>>;
        evidence: z.ZodOptional<z.ZodArray<z.ZodObject<{
            field: z.ZodEnum<["goal", "constraints", "done", "inProgress", "blocked", "decisions", "errorsAndFixes", "userMessages", "nextSteps", "criticalContext"]>;
            itemIndex: z.ZodNumber;
            references: z.ZodArray<z.ZodObject<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>, "many">;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            field: z.ZodEnum<["goal", "constraints", "done", "inProgress", "blocked", "decisions", "errorsAndFixes", "userMessages", "nextSteps", "criticalContext"]>;
            itemIndex: z.ZodNumber;
            references: z.ZodArray<z.ZodObject<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>, "many">;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            field: z.ZodEnum<["goal", "constraints", "done", "inProgress", "blocked", "decisions", "errorsAndFixes", "userMessages", "nextSteps", "criticalContext"]>;
            itemIndex: z.ZodNumber;
            references: z.ZodArray<z.ZodObject<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>, "many">;
        }, z.ZodTypeAny, "passthrough">>, "many">>;
        parentCreatedAt: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
        coveredMessageCount: z.ZodOptional<z.ZodNumber>;
        tokensAfter: z.ZodOptional<z.ZodNumber>;
        summaryProvider: z.ZodOptional<z.ZodString>;
        summaryModel: z.ZodOptional<z.ZodString>;
        summaryPromptVersion: z.ZodOptional<z.ZodNumber>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        summary: z.ZodString;
        firstKeptMessageId: z.ZodOptional<z.ZodString>;
        firstKeptMessageIndex: z.ZodNumber;
        tokensBefore: z.ZodNumber;
        compactedMessages: z.ZodNumber;
        createdAt: z.ZodEffects<z.ZodString, string, string>;
        formatVersion: z.ZodOptional<z.ZodLiteral<1>>;
        state: z.ZodOptional<z.ZodObject<{
            goal: z.ZodArray<z.ZodString, "many">;
            constraints: z.ZodArray<z.ZodString, "many">;
            done: z.ZodArray<z.ZodString, "many">;
            inProgress: z.ZodArray<z.ZodString, "many">;
            blocked: z.ZodArray<z.ZodString, "many">;
            decisions: z.ZodArray<z.ZodString, "many">;
            errorsAndFixes: z.ZodArray<z.ZodString, "many">;
            userMessages: z.ZodArray<z.ZodString, "many">;
            nextSteps: z.ZodArray<z.ZodString, "many">;
            criticalContext: z.ZodArray<z.ZodString, "many">;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            goal: z.ZodArray<z.ZodString, "many">;
            constraints: z.ZodArray<z.ZodString, "many">;
            done: z.ZodArray<z.ZodString, "many">;
            inProgress: z.ZodArray<z.ZodString, "many">;
            blocked: z.ZodArray<z.ZodString, "many">;
            decisions: z.ZodArray<z.ZodString, "many">;
            errorsAndFixes: z.ZodArray<z.ZodString, "many">;
            userMessages: z.ZodArray<z.ZodString, "many">;
            nextSteps: z.ZodArray<z.ZodString, "many">;
            criticalContext: z.ZodArray<z.ZodString, "many">;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            goal: z.ZodArray<z.ZodString, "many">;
            constraints: z.ZodArray<z.ZodString, "many">;
            done: z.ZodArray<z.ZodString, "many">;
            inProgress: z.ZodArray<z.ZodString, "many">;
            blocked: z.ZodArray<z.ZodString, "many">;
            decisions: z.ZodArray<z.ZodString, "many">;
            errorsAndFixes: z.ZodArray<z.ZodString, "many">;
            userMessages: z.ZodArray<z.ZodString, "many">;
            nextSteps: z.ZodArray<z.ZodString, "many">;
            criticalContext: z.ZodArray<z.ZodString, "many">;
        }, z.ZodTypeAny, "passthrough">>>;
        evidence: z.ZodOptional<z.ZodArray<z.ZodObject<{
            field: z.ZodEnum<["goal", "constraints", "done", "inProgress", "blocked", "decisions", "errorsAndFixes", "userMessages", "nextSteps", "criticalContext"]>;
            itemIndex: z.ZodNumber;
            references: z.ZodArray<z.ZodObject<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>, "many">;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            field: z.ZodEnum<["goal", "constraints", "done", "inProgress", "blocked", "decisions", "errorsAndFixes", "userMessages", "nextSteps", "criticalContext"]>;
            itemIndex: z.ZodNumber;
            references: z.ZodArray<z.ZodObject<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>, "many">;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            field: z.ZodEnum<["goal", "constraints", "done", "inProgress", "blocked", "decisions", "errorsAndFixes", "userMessages", "nextSteps", "criticalContext"]>;
            itemIndex: z.ZodNumber;
            references: z.ZodArray<z.ZodObject<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>, "many">;
        }, z.ZodTypeAny, "passthrough">>, "many">>;
        parentCreatedAt: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
        coveredMessageCount: z.ZodOptional<z.ZodNumber>;
        tokensAfter: z.ZodOptional<z.ZodNumber>;
        summaryProvider: z.ZodOptional<z.ZodString>;
        summaryModel: z.ZodOptional<z.ZodString>;
        summaryPromptVersion: z.ZodOptional<z.ZodNumber>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        summary: z.ZodString;
        firstKeptMessageId: z.ZodOptional<z.ZodString>;
        firstKeptMessageIndex: z.ZodNumber;
        tokensBefore: z.ZodNumber;
        compactedMessages: z.ZodNumber;
        createdAt: z.ZodEffects<z.ZodString, string, string>;
        formatVersion: z.ZodOptional<z.ZodLiteral<1>>;
        state: z.ZodOptional<z.ZodObject<{
            goal: z.ZodArray<z.ZodString, "many">;
            constraints: z.ZodArray<z.ZodString, "many">;
            done: z.ZodArray<z.ZodString, "many">;
            inProgress: z.ZodArray<z.ZodString, "many">;
            blocked: z.ZodArray<z.ZodString, "many">;
            decisions: z.ZodArray<z.ZodString, "many">;
            errorsAndFixes: z.ZodArray<z.ZodString, "many">;
            userMessages: z.ZodArray<z.ZodString, "many">;
            nextSteps: z.ZodArray<z.ZodString, "many">;
            criticalContext: z.ZodArray<z.ZodString, "many">;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            goal: z.ZodArray<z.ZodString, "many">;
            constraints: z.ZodArray<z.ZodString, "many">;
            done: z.ZodArray<z.ZodString, "many">;
            inProgress: z.ZodArray<z.ZodString, "many">;
            blocked: z.ZodArray<z.ZodString, "many">;
            decisions: z.ZodArray<z.ZodString, "many">;
            errorsAndFixes: z.ZodArray<z.ZodString, "many">;
            userMessages: z.ZodArray<z.ZodString, "many">;
            nextSteps: z.ZodArray<z.ZodString, "many">;
            criticalContext: z.ZodArray<z.ZodString, "many">;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            goal: z.ZodArray<z.ZodString, "many">;
            constraints: z.ZodArray<z.ZodString, "many">;
            done: z.ZodArray<z.ZodString, "many">;
            inProgress: z.ZodArray<z.ZodString, "many">;
            blocked: z.ZodArray<z.ZodString, "many">;
            decisions: z.ZodArray<z.ZodString, "many">;
            errorsAndFixes: z.ZodArray<z.ZodString, "many">;
            userMessages: z.ZodArray<z.ZodString, "many">;
            nextSteps: z.ZodArray<z.ZodString, "many">;
            criticalContext: z.ZodArray<z.ZodString, "many">;
        }, z.ZodTypeAny, "passthrough">>>;
        evidence: z.ZodOptional<z.ZodArray<z.ZodObject<{
            field: z.ZodEnum<["goal", "constraints", "done", "inProgress", "blocked", "decisions", "errorsAndFixes", "userMessages", "nextSteps", "criticalContext"]>;
            itemIndex: z.ZodNumber;
            references: z.ZodArray<z.ZodObject<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>, "many">;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            field: z.ZodEnum<["goal", "constraints", "done", "inProgress", "blocked", "decisions", "errorsAndFixes", "userMessages", "nextSteps", "criticalContext"]>;
            itemIndex: z.ZodNumber;
            references: z.ZodArray<z.ZodObject<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>, "many">;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            field: z.ZodEnum<["goal", "constraints", "done", "inProgress", "blocked", "decisions", "errorsAndFixes", "userMessages", "nextSteps", "criticalContext"]>;
            itemIndex: z.ZodNumber;
            references: z.ZodArray<z.ZodObject<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                role: z.ZodOptional<z.ZodEnum<["user", "assistant", "toolResult"]>>;
                kind: z.ZodEnum<["message", "tool_call", "tool_result", "archive", "checkpoint"]>;
                messageId: z.ZodOptional<z.ZodString>;
                messageIndex: z.ZodOptional<z.ZodNumber>;
                toolCallId: z.ZodOptional<z.ZodString>;
                tool: z.ZodOptional<z.ZodString>;
                archivePath: z.ZodOptional<z.ZodString>;
                checkpointCreatedAt: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>, "many">;
        }, z.ZodTypeAny, "passthrough">>, "many">>;
        parentCreatedAt: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
        coveredMessageCount: z.ZodOptional<z.ZodNumber>;
        tokensAfter: z.ZodOptional<z.ZodNumber>;
        summaryProvider: z.ZodOptional<z.ZodString>;
        summaryModel: z.ZodOptional<z.ZodString>;
        summaryPromptVersion: z.ZodOptional<z.ZodNumber>;
    }, z.ZodTypeAny, "passthrough">>>;
    lastCompactedAt: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    usageAnchor: z.ZodOptional<z.ZodObject<{
        fixedFingerprint: z.ZodString;
        messageFingerprints: z.ZodArray<z.ZodString, "many">;
        inputTokens: z.ZodNumber;
        measuredAt: z.ZodEffects<z.ZodString, string, string>;
    }, "strip", z.ZodTypeAny, {
        inputTokens: number;
        measuredAt: string;
        fixedFingerprint: string;
        messageFingerprints: string[];
    }, {
        inputTokens: number;
        measuredAt: string;
        fixedFingerprint: string;
        messageFingerprints: string[];
    }>>;
    compactionFailure: z.ZodOptional<z.ZodEffects<z.ZodObject<{
        inputFingerprint: z.ZodString;
        kind: z.ZodEnum<["invalid_structure", "invalid_evidence", "empty_checkpoint", "output_truncated", "incomplete_response", "input_budget", "no_savings", "provider_error"]>;
        failedAt: z.ZodNumber;
        retryAfter: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        kind: "provider_error" | "invalid_structure" | "invalid_evidence" | "empty_checkpoint" | "output_truncated" | "incomplete_response" | "input_budget" | "no_savings";
        inputFingerprint: string;
        failedAt: number;
        retryAfter: number;
    }, {
        kind: "provider_error" | "invalid_structure" | "invalid_evidence" | "empty_checkpoint" | "output_truncated" | "incomplete_response" | "input_budget" | "no_savings";
        inputFingerprint: string;
        failedAt: number;
        retryAfter: number;
    }>, {
        kind: "provider_error" | "invalid_structure" | "invalid_evidence" | "empty_checkpoint" | "output_truncated" | "incomplete_response" | "input_budget" | "no_savings";
        inputFingerprint: string;
        failedAt: number;
        retryAfter: number;
    }, {
        kind: "provider_error" | "invalid_structure" | "invalid_evidence" | "empty_checkpoint" | "output_truncated" | "incomplete_response" | "input_budget" | "no_savings";
        inputFingerprint: string;
        failedAt: number;
        retryAfter: number;
    }>>;
    promptEpoch: z.ZodOptional<z.ZodNumber>;
    promptEpochReason: z.ZodOptional<z.ZodEnum<["initial", "compaction", "rewind", "fork", "provider_changed", "model_changed", "tool_schema_changed"]>>;
    promptEpochCreatedAt: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    promptProvider: z.ZodOptional<z.ZodString>;
    promptModel: z.ZodOptional<z.ZodString>;
    toolSchemaHash: z.ZodOptional<z.ZodString>;
    personalization: z.ZodOptional<z.ZodObject<{
        personality: z.ZodOptional<z.ZodString>;
        configVersion: z.ZodOptional<z.ZodNumber>;
        instructionsHash: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        personality: z.ZodOptional<z.ZodString>;
        configVersion: z.ZodOptional<z.ZodNumber>;
        instructionsHash: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        personality: z.ZodOptional<z.ZodString>;
        configVersion: z.ZodOptional<z.ZodNumber>;
        instructionsHash: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>>;
}, z.ZodTypeAny, "passthrough">>;
