"use strict";
/// <reference path="../../node_modules/trim-engine/dist/core/init/globals.d.ts" />
/// <reference path="../../node_modules/trim-engine/dist/lib/globals.d.ts" />
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getObject = exports.getInterfaces = exports.getDocTrim = exports.getDoc = void 0;
const parser_1 = require("trim-engine/parser");
const utilities_1 = require("@timeax/utilities");
const cc = __importStar(require("charcodes"));
const eslint_1 = require("eslint");
function getDoc(originalText, uri) {
    const extension = utilities_1.Fs.ext(uri), jsDoc = extension === '.trx'
        ? originalText.split(/.|\r|\n/).map(() => ' ')
        : originalText.split('');
    //------
    if (extension === '.trx')
        jsDoc.pop();
    return jsDoc;
}
exports.getDoc = getDoc;
function getDocTrim(originalText, uri) {
    return getDoc(originalText, uri + '.trx');
}
exports.getDocTrim = getDocTrim;
function getInterfaces(originalText, name, jsDoc) {
    const propType = getObject(originalText, name, false);
    // console.log(propType, name)
    if (propType)
        jsDoc.push('\n', '\n', propType);
    return propType;
}
exports.getInterfaces = getInterfaces;
function getObject(code, name, replace = true) {
    const regex = RegExp(`(${name}((\\s?|\\n?)*)\\.((\\s?|\\n?)*)propTypes((\\s?|\\n?)*)\\=((\\s?|\\n)*))\\{`);
    const regex2 = RegExp(`${name}((\\s?|\\n?)*)\\.propTypes((\\s?|\\n?)*)\\=((\\s?|\\n)*)`);
    let list = code.match(regex);
    let prefix = `type ${name}Props = `;
    // let prefix2 = `type ${name + UNWANTED} = `
    //-------------
    if (list) {
        list = list.filter(item => item && item.startsWith(name)
            && item.includes('propTypes')
            && item.endsWith('{'));
        //-----------
        let match = list[list.length - 1], typings = match.replace(regex2, ' '), start = code.lastIndexOf(match), end = start + match.length;
        //-------
        let parsed = parseObj(code, [start, end,]);
        let prefix2 = `let _______iididi = `;
        let propType = prefix + typings + parsed;
        // let propType2 = prefix2 + typings + parsed;
        //--------
        if (propType.includes('`'))
            propType = adjustProps(propType.replace(prefix, prefix2)).replace(prefix2, prefix);
        return replace
            ? propType.replace(prefix, '')
            : propType;
    }
    if (!replace)
        return prefix + '{children?: any[] | any};';
}
exports.getObject = getObject;
var Context;
(function (Context) {
    Context[Context["brace"] = 0] = "brace";
    Context[Context["literal"] = 1] = "literal";
})(Context || (Context = {}));
var Tokens;
(function (Tokens) {
    Tokens[Tokens["dbquotes"] = 0] = "dbquotes";
    Tokens[Tokens["quoutes"] = 1] = "quoutes";
    Tokens[Tokens["braceL"] = 2] = "braceL";
    Tokens[Tokens["braceR"] = 3] = "braceR";
    Tokens[Tokens["esc"] = 4] = "esc";
    Tokens[Tokens["any"] = 5] = "any";
})(Tokens || (Tokens = {}));
function parseObj(code, [start, end]) {
    let context = [Context.brace];
    let quote;
    let type, pos = end;
    //----------
    while (pos < code.length) {
        if (context.length < 1)
            break;
        getToken(code.charCodeAt(pos));
    }
    function eof() {
        return pos >= code.length;
    }
    function getToken(ch) {
        if (ch === cc.quotationMark)
            return finishToken(Tokens.dbquotes);
        if (ch === cc.apostrophe)
            return finishToken(Tokens.quoutes);
        if (ch === cc.backslash)
            return finishToken(Tokens.esc);
        if (curContext() !== Context.literal) {
            if (ch === cc.rightCurlyBrace)
                return finishToken(Tokens.braceR);
            if (ch === cc.leftCurlyBrace)
                return finishToken(Tokens.braceL);
        }
        //----
        return finishToken(Tokens.any);
    }
    function update(prevType) {
        const ctx = curContext();
        if (type === Tokens.esc) {
            ++pos;
            if (ctx !== Context.literal)
                type = prevType;
            return;
        }
        //----
        if (type === Tokens.braceL && ctx !== Context.literal) {
            context.push(Context.brace);
            return ++pos;
        }
        if (isQuote(type)) {
            if (ctx === Context.literal) {
                if (matchQuote()) {
                    if (prevType === Tokens.esc)
                        return ++pos;
                    context.pop();
                }
            }
            else
                context.push(Context.literal);
            return ++pos;
        }
        if (type === Tokens.braceR) {
            ++pos;
            context.pop();
        }
    }
    function matchQuote() {
        return type === quote;
    }
    function curContext() {
        return context[context.length - 1];
    }
    function isQuote(type) {
        return [Tokens.quoutes, Tokens.dbquotes].includes(type);
    }
    function finishToken(token) {
        let prevType = type;
        type = token;
        if (isQuote(type))
            quote = type;
        if (type === Tokens.any)
            return ++pos;
        update(prevType);
    }
    return code.slice(end, pos);
}
const linter = new eslint_1.Linter();
function adjustProps(code) {
    linter.defineParser('@babel/parser', {
        parse(text, options) {
            const node = (0, parser_1.parse)(options, text);
            node.tokens = [];
            node.comments = [];
            return node;
        },
    });
    linter.defineRule('format-props', {
        meta: {
            fixable: 'code',
        },
        create(context) {
            function getText(node) {
                return context.sourceCode.getText(node);
            }
            return {
                Property(node) {
                    if (node.parent.type !== 'ObjectExpression')
                        return;
                    let value = node.value;
                    if (value.type === 'TemplateLiteral') {
                        context.report({
                            node,
                            fix(fixer) {
                                return fixer.replaceText(value, getText(value).slice(1, -1));
                            }, message: 'Fixing rule'
                        });
                    }
                    else if (value.type === 'CallExpression') {
                        const values = value.arguments.map(item => {
                            if (item.type == 'ObjectExpression') {
                                let prefix = 'let test = ';
                                //----
                                let code = getText(item);
                                return adjustProps(prefix + code).replace(prefix, '');
                            }
                            return getText(item);
                        });
                        context.report({
                            node,
                            fix(fixer) {
                                return fixer.replaceText(value, values.join(' | '));
                            }, message: 'Fixing rule'
                        });
                    }
                }
            };
        },
    });
    try {
        const msg = linter.verifyAndFix(code, {
            rules: {
                'format-props': 'error'
            },
            parser: '@babel/parser',
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                sourceFile: 'index.trim',
                loc: true,
                processor: false,
                tokens: false,
                range: true
            }
        });
        return msg.output;
    }
    catch (error) {
        return code;
    }
}
//# sourceMappingURL=index.js.map