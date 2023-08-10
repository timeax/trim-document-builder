"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTypes = exports.build = void 0;
const utilities_1 = require("@timeax/utilities");
const utils_1 = require("./utils");
const displacement_1 = __importStar(require("./utils/displacement"));
const DEFNAME = '__DefaultExport';
function build(regions, uri, code) {
    const jsDoc = (0, utils_1.getDoc)(code, uri);
    const builder = (0, displacement_1.default)(jsDoc);
    //---
    regions.forEach(region => {
        // ---
        let range = [region.start, region.end];
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
                    let prefix = region.attr ? "" : '(', suffix = region.attr ? "" : ');';
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
                    const node = region;
                    const name = node.name;
                    //----
                    fillIn({
                        prefix: "'",
                        suffix: "':",
                        pE: true,
                        sE: true
                        //@ts-ignore
                    }, [name.start, name.end], code, builder);
                    if (node.value && !node.value.type.endsWith('Container'))
                        fillIn({}, node.value.range, code, builder);
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
                        if (utilities_1.Fs.ext(value) === '.trx')
                            return;
                        let name = utilities_1.Fs.name(value);
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
        }
        else if (region.languageId === 'html')
            fillIn({ clear: true }, range, code, builder);
        else {
            let opening = region.openingElement, params = opening === null || opening === void 0 ? void 0 : opening.params;
            fillIn({ clear: true }, range, code, builder);
            //---------
            if (region.type == 'rule') {
                if (opening === null || opening === void 0 ? void 0 : opening.name.name) {
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
                            while (i < len + 6)
                                jsDoc[i] = 'import'.charAt(i - len), i++;
                            return;
                        }
                        case 'each': {
                            const len = region.start + 2;
                            let i = len;
                            while (i < len + 6)
                                jsDoc[i] = 'for('.charAt(i - len), i++;
                            //---
                            builder.distort('){', opening.end);
                            jsDoc[region.end] = '}';
                            return;
                        }
                        case 'for': {
                            break;
                        }
                        case 'export': {
                            let name = DEFNAME;
                            let props = undefined;
                            // console.log(params);
                            const param = params.body;
                            if (param.type === 'SequenceExpression') {
                                param.expressions.forEach(item => {
                                    // console.log(item)
                                    if (item.type === 'Literal')
                                        name = item.value || DEFNAME;
                                    if (item.type === 'Identifier' || item.type === 'ObjectExpression' || item.type === 'ArrayExpression')
                                        props = item;
                                });
                            }
                            else {
                                if (param.type === 'Identifier' || param.type === 'ObjectExpression' || param.type === 'ArrayExpression')
                                    props = param;
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
                                (0, utils_1.getInterfaces)(code, name, jsDoc);
                                return builder.distort('}', region.end);
                            }
                        }
                    }
                }
            }
        }
        if (region.script) {
            builder.distort('{' + builder.get(region.start), region.start);
            builder.distort(builder.get(region.end) + '}', region.end);
        }
    });
    return {
        doc: jsDoc.join(''),
        builder
    };
}
exports.build = build;
function fillIn(fillers, [start, end], mainText, builder) {
    if (fillers.clear) {
        for (let i = start; i < end; i++) {
            const ch = mainText.charAt(1);
            if (ch === '\n')
                builder.set(ch, i);
            else
                builder.set(' ', i);
        }
    }
    else {
        for (let i = start; i < end; i++) {
            builder.set(mainText.charAt(i), i);
        }
    }
    if (!utilities_1.util.unset(fillers.prefix))
        builder.distort(fillers.prefix + (fillers.pE ? builder.get(start) : ''), start, displacement_1.Offset.PREFIX);
    if (!utilities_1.util.unset(fillers.suffix))
        builder.distort(((fillers.sE ? builder.get(end - 1) : '')) + fillers.suffix, end - 1, fillers.sE ? displacement_1.Offset.SUFFIX : displacement_1.Offset.PREFIX);
}
function createTypes(code) {
    if (!code.includes('{@export'))
        return '';
    const names = code.match(/exports((\s?|\n?)*)\.((\s?|\n?)*)[^\.]*/gm);
    if (!names)
        return '';
    return names.map(item => {
        const name = item.trim().slice(7).trim().slice(1);
        if (!validName(name))
            return '';
        const model = (0, utils_1.getObject)(code, name);
        if (!model)
            return '';
        if (name === 'default')
            return `export default {} as FC<${model}>`;
        return `export var ${name}: FC<${model}>`;
    }).join('\n');
}
exports.createTypes = createTypes;
function validName(name) {
    return true;
}
__exportStar(require("./utils/regions"), exports);
//# sourceMappingURL=index.js.map