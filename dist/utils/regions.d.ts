/// <reference types="./globals.d.ts" />
import { AST } from 'eslint';
export declare const UNWANTED = "__UNWANTED";
export interface SourceLocation extends Dynamic {
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
    [x: string]: any;
}
export type EmbededRegion = Region[] & {
    nameList?: {
        name: string;
        alias: string;
        source: string;
    }[];
    type?: 'js' | 'ts';
};
export declare function getRegions(uri: string, content: string, options?: Options): RegionList;
export interface RegionList {
    regions: EmbededRegion;
    errors: Error[];
    nodes: any[];
}
interface Options {
    type?: 'js' | 'ts';
}
export declare function parse(input: string, options: {
    sourceFile: string;
    type: 'js' | 'ts';
}): AST.Program;
export {};
