import { EmbededRegion } from "./utils/regions";
export declare function build(regions: EmbededRegion, uri: string, code: string): {
    doc: string;
    builder: import("./utils/displacement").Displacement;
};
export declare function createTypes(code: string, uri: string): string | {
    doc: string;
    builder: import("./utils/displacement").Displacement;
};
export * from './utils/regions';
export * from './lib/html';
