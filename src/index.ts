import { Fs, util } from "@timeax/utilities";
import { getDoc, getInterfaces, getObject } from "./utils";
import getSearcher, { Displacement, Offset } from "./utils/displacement";
import { EmbededRegion, Range, SourceLocation } from "./utils/regions";
import { Elements as em } from 'trim-engine/core';
const DEFNAME = '__DefaultExport';
import * as estree from 'estree';

export function build(regions: EmbededRegion, uri: string, code: string) {
    const jsDoc = getDoc(code, uri);
    const builder = getSearcher(jsDoc);
    //---
    regions.forEach(region => {
        // ---
        let range: Range = [region.start, region.end];
        if (region.languageId === 'javascript') {
            switch (region.type) {
                case 'jsx': {
                    return fillIn({
                        suffix: '["propTypes"];',
                        prefix: `type ${region.alias} = typeof `,
                        pE: true,
                        sE: true
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
                    if (node.value && !node.value.type.endsWith('Container')) fillIn({}, node.value.range, code, builder);
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
                    fillIn({ suffix: region.useSuffix ? ';' : undefined, sE: true }, range, code, builder);
                    if (region.subType === 'ImportDeclaration' && region.isUseRule) {
                        let source = region.source;
                        let raw = source.raw;
                        let value = source.value;
                        if (Fs.ext(value) === '.trx') return;
                        let name = Fs.name(value);
                        let fixed = `'${value.slice(0, value.length - name.length) + `_${name}.trx`}';`;
                        for (let i = 0; i < raw.length; i++) {
                            jsDoc[i + source.start] = fixed.charAt(i);
                            if (i === raw.length - 1 && fixed.length > i) {
                                builder.distort(fixed.substring(i), i + source.start);
                            }
                        }
                    }
                    return;
                }

                case 'mix-html': {
                    builder.distort('({' + builder.get(region.start), region.start);
                    builder.distort(`} as ${region.alias});`, region.end - 1);
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
                            let props: ((estree.Identifier | estree.ArrayExpression | estree.ObjectExpression) & SourceLocation) | undefined = undefined;
                            // console.log(params);
                            const param = (params as { body: estree.Expression }).body;
                            if (param.type === 'SequenceExpression') {
                                param.expressions.forEach(item => {
                                    // console.log(item)
                                    if (item.type === 'Literal') name = item.value as string || DEFNAME;
                                    if (item.type === 'Identifier' || item.type === 'ObjectExpression' || item.type === 'ArrayExpression') props = item as any;
                                });
                            } else {
                                if (param.type === 'Identifier' || param.type === 'ObjectExpression' || param.type === 'ArrayExpression') props = param as any;
                            }

                            if (props) {
                                // fillIn({ clear: true }, [opening.start, opening.end], code, builder);
                                fillIn({
                                    prefix: `exports.${name}=(`,
                                    suffix: `:${name})=>{`,
                                    pE: true,
                                    sE: true
                                }, [props.start, props.end], code, builder);
                                //--------------
                                getInterfaces(code, name, jsDoc);
                                return builder.distort('}', region.end);
                            }
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

    return {
        doc: jsDoc.join(''),
        builder
    }
}

interface Fillers {
    prefix?: string;
    suffix?: string;
    clear?: boolean;
    pE?: boolean;
    sE?: boolean
}

function fillIn(fillers: Fillers, [start, end]: Range, mainText: string, builder: Displacement) {
    if (fillers.clear) {
        for (let i = start; i < end; i++) {
            const ch = mainText.charAt(1);
            if (ch === '\n') builder.set(ch, i);
            else builder.set(' ', i);
        }
    } else {
        for (let i = start; i < end; i++) {
            builder.set(mainText.charAt(i), i);
        }
    }

    if (!util.unset(fillers.prefix)) builder.distort(fillers.prefix + (fillers.pE ? builder.get(start) : ''), start, Offset.PREFIX);
    if (!util.unset(fillers.suffix)) builder.distort(((fillers.sE ? builder.get(end - 1) : '')) + fillers.suffix, end - 1, fillers.sE ? Offset.SUFFIX : Offset.PREFIX);
}

export function createTypes(code: string): string {
    if (!code.includes('{@export')) return '';

    const names = code.match(/exports((\s?|\n?)*)\.((\s?|\n?)*)[^\.]*/gm);
    if (!names) return '';
    return names.map(item => {
        const name = item.trim().slice(7).trim().slice(1);
        if (!validName(name)) return '';
        const model = getObject(code, name);
        if (!model) return '';
        if (name === 'default') return `export default {} as FC<${model}>`
        return `export var ${name}: FC<${model}>`
    }).join('\n')
}


function validName(name: string) {
    return true;
}

export * from './utils/regions';