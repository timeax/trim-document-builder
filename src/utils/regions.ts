//@ts-nocheck
import { Fs, util } from '@timeax/utilities';
import { transverse } from 'trim-engine/editor';
import { scanner, parse as jsParse, TrimOptions } from 'trim-engine/parser';
import trim from 'trim-engine/parser/plugin';
import * as acorn from 'acorn';
import { FileExtensions as extensions, TrimAssets as as } from 'trim-engine/util';
import { Elements as em } from 'trim-engine/core'
import { tsPlugin } from '@timeax/acorn-typescript';
import { AST } from 'eslint';

export const UNWANTED = '__UNWANTED';
export interface SourceLocation extends Dynamic {
    start: number;
    end: number;
}

export type Range = [number, number];

export interface Node extends SourceLocation { type: string, [x: string]: any }


export interface Region extends SourceLocation {
    languageId: 'javascript' | 'trim' | 'html' | 'html-attr';
    type?: {} | 'container' | 'rule' | 'mix-html' | 'tscript' | 'jsx' | 'attribute' | 'spreadAttr' | 'htmlAttr';
    script?: boolean;
    subType?: {} | 'ImportDeclaration';
    [x: string]: any
}

export type EmbededRegion = Region[] & {
    nameList?: {
        name: string,
        alias: string;
        source: string;
    }[],
    type?: 'js' | 'ts'
}

global.TrimVsCode = {
    stopScanner: false,
    started: false
}

export function getRegions(uri: string, content: string, options: Options = {}): RegionList {
    const regions: EmbededRegion = [];
    regions.nameList = [];
    let nodes = [] as string[];
    //----
    let ast: any;
    regions.type = options.type || 'js';

    util.avoid(() => {
        ast = parse(content, { sourceFile: uri, type: options.type || 'js' })
        // console.log(ast)
    }).then((e) => {
        if (e) {
            ast = scanner({
                ecmaVersion: 'latest',
                sourceFile: uri,
                processor: false,
                preserveParens: true,
                loc: false,
                range: true
            }, content);
        }
    })

    let errors: any = [];
    if (ast.errors) errors = ast.errors;
    if (ast.nodes) nodes = ast.nodes
    //@ts-ignore
    transverse(ast, () => {
        return {
            Scriptlet(node: Node) {
                regions.push({
                    languageId: 'javascript',
                    start: node.start + 2,
                    end: node.end - 2,
                    type: 'tscript'
                });
            },

            Attribute(node: Node) {
                if (node.type == 'Attribute') {
                    ///@ts-ignore
                    if (node.isComponent) {
                        if (node.value?.type === 'JsContainer'
                            || node.value?.type === 'AlpineContainer') {
                            (node.value as any).isFromAttribute = true;
                        }
                    } else {
                        if (node.value?.type === 'JsContainer' && node.name.name === 'style' || node.name.name === ':style') {
                            node.value.styleComponent = true;
                        }
                    }

                    regions.push({
                        type: 'htmlAttr',
                        end: node.end,
                        start: node.start,
                        languageId: 'html-attr'
                    })
                }
            },

            TrimFragment(node) {
                regions.push({
                    ...node,
                    languageId: 'trim',
                    start: node.start,
                    type: 'mix-html',
                    end: node.end
                })
            },

            TrimElement(node: Node) {
                const name = getName(node);
                if (name && name.charAt(0) === name.charAt(0).toLowerCase()) {
                    regions.push({
                        ...node,
                        languageId: 'html',
                        start: node.start,
                        end: node.end,
                        script: hasScript(node)
                    });
                } else {
                    const reg = {
                        languageId: 'trim',
                        name: getName(node),
                        ...node,
                        type: 'mix-html',
                        script: hasScript(node)
                    };

                    // if()
                    if (Boolean(name)) reg.type = 'trim-element';
                    regions.push(reg as any);

                    if (name && util.is(name.charAt(0)).uppercase()) {
                        const alias = as.asset.uuid(name, 'ids', true) + UNWANTED,
                            start = node.openingElement.name.start,
                            end = node.openingElement.name.end;
                        regions.push({
                            languageId: 'javascript',
                            start, end,
                            type: 'jsx',
                            closing: node.closingElement,
                            alias, name
                        });


                        regions.nameList?.push({ name, alias, source: uri + [start, end] })

                        if ((node.openingElement.attributes?.length || -1) > 0) {
                            (node as unknown as em.trimElement).openingElement.attributes?.forEach((item) => {
                                (item as any).isComponent = true;
                                regions.push({
                                    languageId: 'javascript',
                                    ...item,
                                    type: item.type === 'Attribute' ? `attribute` : 'spreadAttr',
                                    alias
                                });
                            });
                        }

                        regions.push({
                            alias,
                            name,
                            type: 'mix-html',
                            hasAttr: node.openingElement.attributes?.length > 0,
                            languageId: 'javascript',
                            end: node.openingElement.end, start: node.openingElement.name.end + 1,
                        });
                    }
                }
            },

            ImportDeclaration(node) {
                if (extensions.isJS(Fs.ext(node.loc?.source || '')) || node.parent.type === 'Program') {
                    regions.push({
                        languageId: 'javascript',
                        isUseRule: false,
                        ...node as unknown as Node,
                        type: 'tscript',
                        subType: 'ImportDeclaration',
                    });
                }
            },

            JsRule(node: Node) {
                regions.push({
                    ...node,
                    languageId: 'trim',
                    type: 'rule',
                    script: hasScript(node)
                });
                const name = node.openingElement?.name?.name;
                if (node.openingElement?.params) {
                    const region = {
                        languageId: 'javascript',
                        isUseRule: name === 'use',
                        parentName: name,
                        ...node.openingElement.params,
                        type: 'tscript'
                    }
                    regions.push(region);
                    if (name === 'use' || name === 'import' || name === 'require') {
                        region.useSuffix = true;
                        region.subType = 'ImportDeclaration';
                    }

                    if (['export', 'for'].includes(name)) region.type = 'any';
                }
            },

            AlpineContainer(node: Node) {
                let end = content.charAt(node.end - 1) == '}' ? node.end - 1 : node.end;
                regions.push({
                    start: node.start + 1,
                    end: end,
                    languageId: 'javascript',
                    type: 'container',
                    attr: node.isFromAttribute
                });
            },

            JsContainer(node: Node) {
                let end = content.charAt(node.end - 2) == '}' ? node.end - 1 : node.end;
                end -= content.charAt(node.end - 1) === '}' ? 1 : 0;
                regions.push({
                    start: node.start + 2,
                    end: end,
                    languageId: 'javascript',
                    type: 'container',
                    attr: node.isFromAttribute,
                    isStyle: node.styleComponent
                });
            },

            FrontendContainer(node: Node) {
                let end = content.charAt(node.end - 1) == '}' ? node.end - 1 : node.end;
                regions.push({
                    start: node.start + 2,
                    end: end,
                    languageId: 'javascript',
                    type: 'container',
                    attr: node.isFromAttribute
                });
            }
        }
    });

    return {
        regions,
        errors,
        nodes
    }
}

export interface RegionList {
    regions: EmbededRegion;
    errors: Error[],
    nodes: any[]
}

function getName(node: any): string | null {
    return node.openingElement?.name?.name;
}

function hasScript(node: Any) {
    return node.children?.some((item: Any) => 'Scriptlet' === item.type);
}

//, 'JsContainer', 'AlpineContainer'


const start = {
    trim: null as unknown as typeof acorn.Parser,
    get parser() {
        if (!this.trim) {
            this.trim = acorn.Parser.extend(tsPlugin() as any, trim({
                processor: false,
                ignore: true
            }) as any) as any;
        };

        return this.trim;
    }
}

interface Options {
    type?: 'js' | 'ts';
}

export function parse(input: string, options: { sourceFile: string, type: 'js' | 'ts' }): AST.Program {
    const parserOptions: TrimOptions = {
        ecmaVersion: 'latest',
        sourceFile: options.sourceFile,
        processor: false,
        preserveParens: true,
        nodelist: true,
        sourceType: 'module',
        loc: true,
        range: true
    }


    if (options.type === 'js') {
        let ast;
        util.avoid(() => {
            ast = jsParse(parserOptions, input);
        }).then((e) => {
            if (e) {
                ast = scanner(parserOptions, input);
            }
        });

        return ast as any;
    }

    const Base = start.parser;
    //@ts-ignore------
    const parser = new Base(parserOptions, input);
    return parser.parse() as any;
}