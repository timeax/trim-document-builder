import { EmbededRegion } from "..";
export declare function buildDoc(regions: EmbededRegion, uri: string, code: string, type: 'html' | 'rules'): {
    doc: string;
    builder: import("../utils/displacement").Displacement;
};
