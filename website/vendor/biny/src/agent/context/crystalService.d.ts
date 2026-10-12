import type { AgentModel } from "../core/types.js";
import { CrystalStorage } from "./crystalStorage.js";
import { type Crystal, type CrystalAnchor, type CrystalChecklist, type CrystalMaterial, type CrystalMaterialKind, type CrystalMaterialSource, type CrystalOverview, type CrystalProcessResult, type CrystalTerm, type CrystalType, type CrystalConfig } from "./crystalTypes.js";
export interface CrystalServiceOptions {
    storage?: CrystalStorage;
    getModel?: () => AgentModel | undefined;
    extractTerms?: (text: string, signal?: AbortSignal) => Promise<readonly string[]>;
    embedText?: (text: string, signal?: AbortSignal) => Promise<Float32Array | undefined>;
    readAnchorText?: (anchor: {
        threadId?: string;
        anchorId: string;
    }) => Promise<string | undefined>;
    getConfig?: () => CrystalConfig;
    allowActivity?: () => boolean;
    now?: () => Date;
    onEvent?: (event: CrystalServiceEvent) => void;
}
export interface CrystalServiceEvent {
    type: "term_contoured" | "crystal_created" | "crystal_woken" | "material_added" | "crystal_ready";
    crystalId?: string;
    term?: string;
}
export interface ProcessAnchorOptions {
    threadId: string;
    anchorId: string;
    day: string;
    text: string;
    source?: CrystalAnchor["source"];
    signal?: AbortSignal;
    terms?: readonly string[];
}
export interface CrystalDetail {
    checklistSpec: readonly string[] | null;
    termStats: {
        count: number;
        turns: number;
        threads: number;
        days: number;
    } | null;
    crystal: Crystal;
    materials: CrystalMaterial[];
    term?: CrystalTerm;
    validation: CrystalValidation;
    related: Array<{
        id: string;
        name: string;
        stage: Crystal["stage"];
        origin: Crystal["origin"];
        shared: number;
    }>;
}
export interface CrystalValidation {
    ready: boolean;
    missing: string[];
    conflicted: string[];
}
export declare class CrystalService {
    private readonly options;
    readonly storage: CrystalStorage;
    private readonly getModel;
    private readonly customExtractTerms;
    private readonly embedText;
    private readonly seedVectors;
    private readonly readAnchorText;
    private readonly getConfig;
    private readonly now;
    private readonly onEvent;
    constructor(options?: CrystalServiceOptions);
    initialize(): Promise<void>;
    close(): void;
    processAnchor(options: ProcessAnchorOptions): Promise<CrystalProcessResult>;
    recordTerms(terms: readonly string[], anchor: CrystalAnchor, config?: CrystalConfig): Omit<CrystalProcessResult, "claimed" | "terms">;
    extract(text: string, signal?: AbortSignal): Promise<string[]>;
    overview(): CrystalOverview;
    detail(id: string): CrystalDetail | undefined;
    search(query?: string, limit?: number): Array<{
        id: string;
        title: string;
        uri: string;
        score: number;
    }>;
    createSeed(name: string, options?: {
        threadId?: string;
        bundleIds?: string[];
        anchorIds?: string[];
    }): Crystal;
    setSlot(id: string, slot: number | null): Crystal;
    setDormant(id: string, dormant: boolean): Crystal;
    setType(id: string, type: CrystalType): Crystal;
    updateChecklist(id: string, field: string, patch: {
        value?: string;
        sources?: string[];
        conflict?: boolean;
    }): Crystal;
    /** 预览与模型补全共用来源读取；材料组只读取其明确关联的锚点。 */
    readMaterialText(material: CrystalMaterial): Promise<string | undefined>;
    prefill(id: string, signal?: AbortSignal): Promise<Crystal>;
    confirm(id: string, patch?: {
        name?: string;
        checklist?: CrystalChecklist;
    }): Crystal;
    cancel(id: string, keepObserving: boolean): Crystal;
    addMaterial(id: string, kind: CrystalMaterialKind, ref: unknown, source?: CrystalMaterialSource): boolean;
    promptText(query: string, maxChars?: number, history?: readonly string[]): Promise<string | undefined>;
    private hasActivityMaterials;
    private requireCrystal;
    private notifyReady;
    private attachSeedMaterials;
    private attachSemanticSeedMaterials;
    dormantOldCrystals(): void;
}
export declare class CrystalSlotsFullError extends Error {
    readonly code = "slots_full";
    constructor();
}
export declare class CrystalNotReadyError extends Error {
    readonly validation: CrystalValidation;
    readonly code = "not_ready";
    constructor(validation: CrystalValidation);
}
export declare function normalizeCrystalConfig(value: Partial<CrystalConfig> | undefined): CrystalConfig;
export declare function normalizeTerms(values: readonly string[]): string[];
export declare function normalizeTerm(value: string): string | undefined;
export declare function cleanTermInput(value: string): string;
export declare function termId(term: string): string;
export declare function validateCrystal(crystal: Crystal): CrystalValidation;
