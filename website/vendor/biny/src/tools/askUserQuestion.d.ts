import { type UserInputQuestions, type UserInputRequests, type UserInputResult } from "../runtime/userInput.js";
import type { Tool } from "./types.js";
export declare function createAskUserQuestionTool(requests: UserInputRequests): Tool<UserInputQuestions, UserInputResult>;
