"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRegions = exports.UNWANTED = void 0;
const utilities_1 = require("@timeax/utilities");
const editor_1 = require("trim-engine/editor");
const parser_1 = require("trim-engine/parser");
const util_1 = require("trim-engine/util");
exports.UNWANTED = '__UNWANTED';
global.TrimVsCode = {
    stopScanner: false,
    started: false
};
function getRegions(uri, content, filter = []) {
    const regions = [];
    regions.nameList = [];
    const nodes = [];
    //----
    const ast = (0, parser_1.scanner)({
        ecmaVersion: 'latest',
        sourceFile: uri,
        processor: false,
        preserveParens: true,
        loc: false,
        range: true
    }, content);
    let errors = [];
    if (ast.errors)
        errors = ast.errors;
    (0, editor_1.transverse)(ast, () => {
        return {
            Scriptlet(node) {
                regions.push({
                    languageId: 'javascript',
                    start: node.start + 2,
                    end: node.end - 2,
                    type: 'tscript'
                });
            },
            Attribute(node) {
                var _a, _b, _c;
                if (node.type == 'Attribute') {
                    ///@ts-ignore
                    if (node.isComponent) {
                        if (((_a = node.value) === null || _a === void 0 ? void 0 : _a.type) === 'JsContainer'
                            || ((_b = node.value) === null || _b === void 0 ? void 0 : _b.type) === 'AlpineContainer') {
                            node.value.isFromAttribute = true;
                        }
                    }
                    else {
                        if (((_c = node.value) === null || _c === void 0 ? void 0 : _c.type) === 'JsContainer' && node.name.name === 'style' || node.name.name === ':style') {
                            node.value.styleComponent = true;
                        }
                    }
                }
            },
            TrimElement(node) {
                var _a, _b, _c;
                const name = getName(node);
                if (name && name.charAt(0) === name.charAt(0).toLowerCase()) {
                    regions.push(Object.assign(Object.assign({}, node), { languageId: 'html', start: node.start, end: node.end, script: hasScript(node) }));
                }
                else {
                    const reg = Object.assign(Object.assign({ languageId: 'trim', name: getName(node) }, node), { type: 'mix-html', script: hasScript(node) });
                    // if()
                    if (Boolean(name))
                        reg.type = 'trim-element';
                    regions.push(reg);
                    if (name && utilities_1.util.is(name.charAt(0)).uppercase()) {
                        const alias = util_1.TrimAssets.asset.uuid(name, 'ids', true) + exports.UNWANTED, start = node.openingElement.name.start, end = node.openingElement.name.end;
                        regions.push({
                            languageId: 'javascript',
                            start, end,
                            type: 'jsx',
                            alias, name
                        });
                        (_a = regions.nameList) === null || _a === void 0 ? void 0 : _a.push({ name, alias, source: uri + [start, end] });
                        if ((((_b = node.openingElement.attributes) === null || _b === void 0 ? void 0 : _b.length) || -1) > 0) {
                            (_c = node.openingElement.attributes) === null || _c === void 0 ? void 0 : _c.forEach((item) => {
                                item.isComponent = true;
                                regions.push(Object.assign(Object.assign({ languageId: 'javascript' }, item), { type: item.type === 'Attribute' ? `attribute` : 'spreadAttr', alias }));
                            });
                        }
                        regions.push({
                            alias,
                            type: 'mix-html',
                            languageId: 'javascript',
                            end: node.openingElement.end, start: node.openingElement.name.end + 1,
                        });
                    }
                }
            },
            JsRule(node) {
                var _a, _b, _c;
                regions.push(Object.assign(Object.assign({}, node), { languageId: 'trim', type: 'rule', script: hasScript(node) }));
                const name = (_b = (_a = node.openingElement) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.name;
                if ((_c = node.openingElement) === null || _c === void 0 ? void 0 : _c.params) {
                    const region = Object.assign(Object.assign({ languageId: 'javascript', isUseRule: name === 'use', parentName: name }, node.openingElement.params), { type: 'tscript' });
                    regions.push(region);
                    if (name === 'use' || name === 'import') {
                        region.useSuffix = true;
                        region.subType = 'ImportDeclaration';
                    }
                    if (['export', 'for'].includes(name))
                        region.type = 'any';
                }
            },
            AlpineContainer(node) {
                let end = content.charAt(node.end - 1) == '}' ? node.end - 1 : node.end;
                regions.push({
                    start: node.start + 1,
                    end: end,
                    languageId: 'javascript',
                    type: 'container',
                    attr: node.isFromAttribute
                });
            },
            JsContainer(node) {
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
            FrontendContainer(node) {
                let end = content.charAt(node.end - 1) == '}' ? node.end - 1 : node.end;
                regions.push({
                    start: node.start + 2,
                    end: end,
                    languageId: 'javascript',
                    type: 'container',
                    attr: node.isFromAttribute
                });
            }
        };
    });
    return {
        regions,
        errors,
        nodes
    };
}
exports.getRegions = getRegions;
function getName(node) {
    var _a, _b;
    return (_b = (_a = node.openingElement) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.name;
}
function useSuffix(node) {
    if (node === undefined || node === null || !['JsContainer', 'AlpineContainer'].includes(node.type))
        return true;
    return false;
}
function hasScript(node) {
    var _a;
    return (_a = node.children) === null || _a === void 0 ? void 0 : _a.some((item) => 'Scriptlet' === item.type);
}
//, 'JsContainer', 'AlpineContainer'
//# sourceMappingURL=regions.js.map