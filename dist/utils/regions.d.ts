export declare const UNWANTED = "__UNWANTED";
export interface SourceLocation extends Any {
    start: number;
    end: number;
}
export type Range = [number, number];
export interface Node extends SourceLocation {
    type: string;
    [x: string]: any;
}
export interface Region extends SourceLocation {
    languageId: 'javascript' | 'trim' | 'html' | 'html-attr';
    type?: {} | 'container' | 'rule' | 'mix-html' | 'tscript' | 'jsx' | 'attribute' | 'spreadAttr' | 'htmlAttr';
    script?: boolean;
    subType?: {} | 'ImportDeclaration';
}
export type EmbededRegion = Region[] & {
    nameList?: {
        name: string;
        alias: string;
        source: string;
    }[];
};
export declare function getRegions(uri: string, content: string, filter?: string[]): RegionList;
export interface RegionList {
    regions: EmbededRegion;
    errors: Error[];
    nodes: any[];
}
