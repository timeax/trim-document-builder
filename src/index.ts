import { Fs, util } from "@timeax/utilities";
import { getDoc, getInterfaces, getObject } from "./utils";
import getSearcher, { Offset } from "./utils/displacement";
import { EmbededRegion, Range, SourceLocation, UNWANTED, getRegions } from "./utils/regions";
import { Elements as em } from 'trim-engine/core';
import { scanner } from "trim-engine/parser";
const DEFNAME = '__DefaultExport';
import * as estree from 'estree';
import { fillIn } from "./utils/filler";
import { FileExtensions } from "trim-engine/util";
const FC = 'CALL_COMPONENT' + UNWANTED;
// const EXPORT = '__'

export function build(regions: EmbededRegion, uri: string, code: string) {
    const jsDoc = getDoc(code, uri);
    const builder = getSearcher(jsDoc);
    //---
    regions.forEach(region => {
        if (region.languageId === 'html-attr') return;
        // ---
        let range: Range = [region.start, region.end];
        if (region.languageId === 'javascript') {
            switch (region.type) {
                case 'jsx': {
                    return fillIn({
                        prefix: FC + '(',
                        suffix: ',',
                        sE: true,
                        pE: true
                    }, range, code, builder);
                }

                case 'container': {
                    let prefix = region.attr ? "" : '(',
                        suffix = region.attr ? "" : ');';
                    //-----
                    if (region.isStyle) {
                        prefix = "(";
                        suffix = " as import('trim.js').CSSProps);";
                    }
                    //---
                    return fillIn({
                        suffix,
                        prefix,
                        pE: true,
                        sE: true
                    }, range, code, builder);
                }

                case 'attribute': {
                    const node = region as unknown as em.attributes;
                    const name = node.name;
                    //----
                    fillIn({
                        prefix: "'",
                        suffix: "':",
                        pE: true,
                        sE: true
                        //@ts-ignore
                    }, [name.start, name.end], code, builder);
                    if (node.value && !node.value.type.endsWith('Container')) fillIn({}, node.value.range as TrimRange, code, builder);
                    //-----------
                    builder.distort(!node.value ? 'null,' : ',', region.end);
                    return;
                }

                case 'spreadAttr': {
                    return fillIn({
                        suffix: ',',
                        sE: true
                    }, [region.start + 2, region.end - 2], code, builder);
                }

                case 'tscript': {
                    if (region.subType === 'ImportDeclaration' && region.isUseRule) {
                        let source = region.source;
                        let raw = source.raw;
                        let value = source.value;
                        if (Fs.ext(value) !== '.trx') {
                            fillIn({}, [region.start, region.source.start], code, builder);
                            //----
                            let name = Fs.name(value);
                            let fixed = `'${value.slice(0, value.length - name.length) + `_${name}.trx`}`;
                            for (let i = 0; i < raw.length; i++) {
                                jsDoc[i + source.start] = fixed.charAt(i);
                                if (i === raw.length - 1 && fixed.length > i) {
                                    builder.distort(fixed.substring(i), i + source.start, Offset.SUFFIX);
                                    builder.distort("';", source.end);
                                }
                            }

                            return;
                        }
                    }

                    return fillIn({ suffix: region.useSuffix ? ';' : undefined, sE: true }, range, code, builder);
                }

                case 'mix-html': {
                    if (region.hasAttr) builder.distort('{' + builder.get(region.start), region.start);
                    else {
                        // console.log(builder.get(region.start - 2), '<regions>')
                        builder.distort(builder.get(region.start - 2) + '{', region.start - 2, Offset.SUFFIX);
                    }
                    builder.distort(`} as typeof ${region.name}['propTypes'])`, region.end - 1);
                    return;
                }
            }
        } else if (region.languageId === 'html') fillIn({ clear: true }, range, code, builder);
        else {
            let opening: em.jsRule['openingElement'] | undefined = region.openingElement,
                params = opening?.params;
            fillIn({ clear: true }, range, code, builder);
            //---------
            if (region.type == 'rule') {
                if (opening?.name.name) {
                    switch (opening.name.name) {
                        case 'use': {
                            return builder.distort('import', region.start + 2);
                        }

                        case 'require': {
                            return builder.distort('import', region.start + 2);
                        }

                        case 'import': {
                            const len = region.start + 2;
                            let i = len;
                            while (i < len + 6) jsDoc[i] = 'import'.charAt(i - len), i++;
                            return;
                        }

                        case 'each': {
                            const len = region.start + 2;
                            let i = len;
                            while (i < len + 6) jsDoc[i] = 'for('.charAt(i - len), i++;
                            //---
                            builder.distort('){', opening.end);
                            jsDoc[region.end] = '}';
                            return;
                        }

                        case 'for': {

                            break;
                        }

                        case 'export': {
                            let name: string = DEFNAME;
                            let id: em.text | undefined;
                            let props: ((estree.Identifier | estree.ArrayExpression | estree.ObjectExpression) & SourceLocation) | undefined = undefined;
                            // console.log(params);
                            const param = (params as { body: estree.Expression }).body;
                            if (param.type === 'SequenceExpression') {
                                param.expressions.forEach(item => {
                                    // console.log(item)
                                    if (item.type === 'Literal') {
                                        name = item.value as string || DEFNAME;
                                        id = item as any;
                                    }
                                    if (item.type === 'Identifier' || item.type === 'ObjectExpression' || item.type === 'ArrayExpression') props = item as any;
                                });
                            } else {
                                if (param.type === 'Identifier' || param.type === 'ObjectExpression' || param.type === 'ArrayExpression') props = param as any;
                                else if (param.type === 'Literal') {
                                    name = param.value as string || DEFNAME;
                                    id = param as any;
                                }
                            }

                            if (id) {
                                fillIn({
                                    prefix: `export ${name == DEFNAME ? 'default' : 'var'} `,
                                    suffix: `:import('trim.js').FC<${name + 'Props'}> =(${(props?.start || -1) < id.start ? ')=>{' : ''}`
                                }, [id.start, id.end], code, builder)
                            }
                            if (props) {
                                const b = props.start > (id?.start || 0);
                                // fillIn({ clear: true }, [opening.start, opening.end], code, builder);
                                fillIn({
                                    prefix: !b ? `(` : '',
                                    suffix: ` ${!b ? 'as' : ':'} ${name}Props${!b ? ')' : ''}${b ? ')=>{' : ';'}`,
                                    pE: true,
                                    sE: true
                                }, [props.start, props.end], code, builder);
                                //--------------
                            }
                            
                            builder.distort('}', region.end);
                            return getInterfaces(code, name, jsDoc);
                        }
                    }
                }
            }
        }

        if (region.script) {
            builder.distort('{' + builder.get(region.start), region.start)
            builder.distort(builder.get(region.end) + '}', region.end)
        }
    });

    // console.log(jsDoc.join(''))
    jsDoc.push(`\ndeclare function ${FC}<T = any>(name: string, props: T): string`)

    return {
        doc: jsDoc.join(''),
        builder
    }
}


export function createTypes(code: string, uri: string) {
    if (!FileExtensions.supports(Fs.ext(uri))) return code;
    return build(getRegions(uri, code).regions, uri, code);
}


function getNames(code: string) {
    const names = new Set<string>();
    util.avoid(() => {
        const ast = scanner({
            processor: false,
            range: true,
            sourceFile: 'index.trx',
            ecmaVersion: 'latest',
        }, code);

        ast?.body?.forEach(item => {
            if (item.type === 'JsRule' && item.openingElement.name?.name === 'export') {
                const params = item.openingElement.params?.body;
                const parseParams = (params: any) => {
                    switch (params.type) {
                        case "AssignmentExpression": {
                            if (params.left.type === 'Identifier' && params.left.name === 'name') {
                                if (params.right.type === 'Literal') names.add(params.right.value as string);
                            }
                            break;
                        }
                        case "Literal": {
                            names.add(params.value as string)
                            break;
                        }
                    }
                }
                //----
                if (params)
                    if (params.type == 'AssignmentExpression'
                        || params.type == 'Identifier'
                        || params.type === 'Literal'
                        || params.type === 'ObjectExpression')
                        parseParams(params);
                    else if (params.type === 'SequenceExpression') params.expressions.forEach((item: any) => parseParams(item as any));
            }
        });
    });

    return Array.from(names);
}


function validName(name: string) {
    return true;
}

export * from './utils/regions';
export * from './lib/html';