import type { Crystal, CrystalBundle, CrystalMaterial, CrystalMaterialKind, CrystalMaterialSource, CrystalTerm, CrystalTermStatus } from "./crystalTypes.js";
export interface CrystalStorageOptions {
    agentDir?: string;
    now?: () => Date;
}
export declare class CrystalStorage {
    readonly databasePath: string;
    private readonly now;
    private database;
    constructor(options?: CrystalStorageOptions);
    initialize(): Promise<void>;
    close(): void;
    getTerm(id: string): CrystalTerm | undefined;
    listTerms(status?: CrystalTermStatus): CrystalTerm[];
    putTerm(term: CrystalTerm): void;
    getCrystal(id: string): Crystal | undefined;
    listCrystals(): Crystal[];
    putCrystal(crystal: Crystal): void;
    insertBundle(input: Omit<CrystalBundle, "id" | "createdAt"> & {
        id?: string;
        createdAt?: string;
    }): CrystalBundle;
    getBundle(id: string): CrystalBundle | undefined;
    listBundles(threadId?: string): CrystalBundle[];
    addMaterial(crystalId: string, kind: CrystalMaterialKind, ref: unknown, source: CrystalMaterialSource): boolean;
    listMaterials(crystalId: string): CrystalMaterial[];
    importMaterial(material: CrystalMaterial): boolean;
    hasProcessedAnchor(anchorId: string): boolean;
    markAnchorProcessed(anchorId: string, processedAt?: string): boolean;
    transaction<T>(work: () => T): T;
    private requireDatabase;
}
