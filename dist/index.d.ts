import { Displacement } from "./utils/displacement";
import { EmbededRegion } from "./utils/regions";
export declare function build(regions: EmbededRegion, uri: string, code: string): {
    doc: string;
    builder: Displacement;
};
export declare function createTypes(code: string): string;
export * from './utils/regions';
