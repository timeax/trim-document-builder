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
const regions_1 = require("./utils/regions");
const parser_1 = require("trim-engine/parser");
const DEFNAME = '__DefaultExport';
const filler_1 = require("./utils/filler");
const FC = 'CALL_COMPONENT' + regions_1.UNWANTED;
function build(regions, uri, code) {
    const jsDoc = (0, utils_1.getDoc)(code, uri);
    const builder = (0, displacement_1.default)(jsDoc);
    //---
    regions.forEach(region => {
        if (region.languageId === 'html-attr')
            return;
        // ---
        let range = [region.start, region.end];
        if (region.languageId === 'javascript') {
            switch (region.type) {
                case 'jsx': {
                    return (0, filler_1.fillIn)({
                        prefix: FC + '(',
                        suffix: ',',
                        sE: true,
                        pE: true
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
                    return (0, filler_1.fillIn)({
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
                    (0, filler_1.fillIn)({
                        prefix: "'",
                        suffix: "':",
                        pE: true,
                        sE: true
                        //@ts-ignore
                    }, [name.start, name.end], code, builder);
                    if (node.value && !node.value.type.endsWith('Container'))
                        (0, filler_1.fillIn)({}, node.value.range, code, builder);
                    //-----------
                    builder.distort(!node.value ? 'null,' : ',', region.end);
                    return;
                }
                case 'spreadAttr': {
                    return (0, filler_1.fillIn)({
                        suffix: ',',
                        sE: true
                    }, [region.start + 2, region.end - 2], code, builder);
                }
                case 'tscript': {
                    if (region.subType === 'ImportDeclaration' && region.isUseRule) {
                        let source = region.source;
                        let raw = source.raw;
                        let value = source.value;
                        if (utilities_1.Fs.ext(value) !== '.trx') {
                            (0, filler_1.fillIn)({}, [region.start, region.source.start], code, builder);
                            //----
                            let name = utilities_1.Fs.name(value);
                            let fixed = `'${value.slice(0, value.length - name.length) + `_${name}.trx`}`;
                            for (let i = 0; i < raw.length; i++) {
                                jsDoc[i + source.start] = fixed.charAt(i);
                                if (i === raw.length - 1 && fixed.length > i) {
                                    builder.distort(fixed.substring(i), i + source.start, displacement_1.Offset.SUFFIX);
                                    builder.distort("';", source.end);
                                }
                            }
                            return;
                        }
                    }
                    return (0, filler_1.fillIn)({ suffix: region.useSuffix ? ';' : undefined, sE: true }, range, code, builder);
                }
                case 'mix-html': {
                    if (region.hasAttr)
                        builder.distort('{' + builder.get(region.start), region.start);
                    else {
                        // console.log(builder.get(region.start - 2), '<regions>')
                        builder.distort(builder.get(region.start - 2) + '{', region.start - 2, displacement_1.Offset.SUFFIX);
                    }
                    builder.distort(`} as typeof ${region.name}['propTypes'])`, region.end - 1);
                    return;
                }
            }
        }
        else if (region.languageId === 'html')
            (0, filler_1.fillIn)({ clear: true }, range, code, builder);
        else {
            let opening = region.openingElement, params = opening === null || opening === void 0 ? void 0 : opening.params;
            (0, filler_1.fillIn)({ clear: true }, range, code, builder);
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
                                (0, filler_1.fillIn)({
                                    prefix: `exports.${name}=(`,
                                    suffix: `:${name})=>{`,
                                    pE: true,
                                    sE: true
                                }, [props.start, props.end], code, builder);
                                //--------------
                                const type = (0, utils_1.getInterfaces)(code, name, jsDoc);
                                // console.log(type)
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
    // console.log(jsDoc.join(''))
    jsDoc.push(`\ndeclare function ${FC}<T = any>(name: string, props: T): string`);
    return {
        doc: jsDoc.join(''),
        builder
    };
}
exports.build = build;
function createTypes(code) {
    if (!code.includes('{@export'))
        return '';
    let exports = getNames(code);
    //---------
    // console.log(exports, 'there are a lot')
    const fromProps = code.match(/exports((\s?|\n?)*)\.((\s?|\n?)*)[^\.]*/gm) || [];
    const names = new Set([...fromProps, ...exports]);
    // console.log(names)
    return Array.from(names).map(item => {
        const name = item.startsWith('exports.') ? item.trim().slice(7).trim().slice(1) : item;
        if (!validName(name))
            return '';
        const model = (0, utils_1.getObject)(code, name) || '{}';
        if (name === 'default')
            return `export default {} as FC<${model}>`;
        return `export var ${name}: FC<${model}>`;
    }).join('\n');
}
exports.createTypes = createTypes;
function getNames(code) {
    const names = new Set();
    utilities_1.util.avoid(() => {
        var _a;
        const ast = (0, parser_1.scanner)({
            processor: false,
            range: true,
            sourceFile: 'index.trx',
            ecmaVersion: 'latest',
        }, code);
        (_a = ast === null || ast === void 0 ? void 0 : ast.body) === null || _a === void 0 ? void 0 : _a.forEach(item => {
            var _a, _b;
            if (item.type === 'JsRule' && ((_a = item.openingElement.name) === null || _a === void 0 ? void 0 : _a.name) === 'export') {
                const params = (_b = item.openingElement.params) === null || _b === void 0 ? void 0 : _b.body;
                const parseParams = (params) => {
                    switch (params.type) {
                        case "AssignmentExpression": {
                            if (params.left.type === 'Identifier' && params.left.name === 'name') {
                                if (params.right.type === 'Literal')
                                    names.add(params.right.value);
                            }
                            break;
                        }
                        case "Literal": {
                            names.add(params.value);
                            break;
                        }
                    }
                };
                //----
                if (params)
                    if (params.type == 'AssignmentExpression'
                        || params.type == 'Identifier'
                        || params.type === 'Literal'
                        || params.type === 'ObjectExpression')
                        parseParams(params);
                    else if (params.type === 'SequenceExpression')
                        params.expressions.forEach((item) => parseParams(item));
            }
        });
    });
    return Array.from(names);
}
function validName(name) {
    return true;
}
__exportStar(require("./utils/regions"), exports);
__exportStar(require("./lib/html"), exports);
//# sourceMappingURL=index.js.map