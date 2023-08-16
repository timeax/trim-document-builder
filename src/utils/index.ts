/// <reference path="../../node_modules/trim-engine/dist/core/init/globals.d.ts" />
/// <reference path="../../node_modules/trim-engine/dist/lib/globals.d.ts" />

import { TrimOptions, parse } from 'trim-engine/parser';
import { Fs } from '@timeax/utilities';
import * as cc from 'charcodes';
import { Linter } from 'eslint';
import { Range } from '..';
import { FileExtensions as extensions } from 'trim-engine/util';

export function getDoc(originalText: string, uri: string): string[] {
    const extension: '.trx' | '.js' | {} = Fs.ext(uri) as any,
        jsDoc = extension === '.trx'
            ? originalText.split(/.|\r|\n/).map(() => ' ')
            : originalText.split('');
    //------
    if (extension === '.trx') jsDoc.pop();
    return jsDoc;
}

export function getDocTrim(originalText: string, uri: string): string[] {
    return getDoc(originalText, uri + '.trx');
}

export function getInterfaces(originalText: string, name: string, jsDoc: string[]): string | void {
    const propType = getObject(originalText, name, false);
    // console.log(propType, name)
    if (propType) jsDoc.push('//----', '//-------', propType);
    return propType;
}

export function getObject(code: string, name: string, replace = true): string | void {
    const regex = RegExp(`(${name}((\\s?|\\n?)*)\\.((\\s?|\\n?)*)propTypes((\\s?|\\n?)*)\\=((\\s?|\\n)*))\\{`);
    const regex2 = RegExp(`${name}((\\s?|\\n?)*)\\.propTypes((\\s?|\\n?)*)\\=((\\s?|\\n)*)`)
    let list = code.match(regex) as string[] | undefined;
    let prefix = `type ${name} = `
    //-------------
    if (list) {
        list = list.filter(item => item && item.startsWith(name)
            && item.includes('propTypes')
            && item.endsWith('{'));
        //-----------
        let match = list[list.length - 1],
            typings = match.replace(regex2, ' '),
            start = code.lastIndexOf(match),
            end = start + match.length;
        //-------
        let parsed = parseObj(code, [start, end,])
        let prefix2 = `let _______iididi = `
        let propType = prefix + typings + parsed;
        //--------
        if (propType.includes('`')) propType = adjustProps(propType.replace(prefix, prefix2)).replace(prefix2, prefix);

        return replace
            ? propType.replace(prefix, '')
            : propType;
    }

    if (!replace) return prefix + '{children?: any[] | any};';
}

enum Context {
    brace,
    literal
}

enum Tokens {
    dbquotes,
    quoutes,
    braceL,
    braceR,
    esc,
    any
}

function parseObj(code: string, [start, end]: Range): string {
    let context = [Context.brace] as Context[];
    let quote: Tokens.dbquotes | Tokens.quoutes | undefined;
    let type: Tokens, pos = end;
    //----------
    while (pos < code.length) {
        if (context.length < 1) break;
        getToken(code.charCodeAt(pos));
    }

    function eof() {
        return pos >= code.length;
    }

    function getToken(ch: number) {
        if (ch === cc.quotationMark) return finishToken(Tokens.dbquotes);
        if (ch === cc.apostrophe) return finishToken(Tokens.quoutes);
        if (ch === cc.backslash) return finishToken(Tokens.esc);
        if (curContext() !== Context.literal) {
            if (ch === cc.rightCurlyBrace) return finishToken(Tokens.braceR);
            if (ch === cc.leftCurlyBrace) return finishToken(Tokens.braceL);
        }
        //----
        return finishToken(Tokens.any);
    }

    function update(prevType: Tokens): any {
        const ctx = curContext();
        if (type === Tokens.esc) {
            ++pos
            if (ctx !== Context.literal) type = prevType;
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
                    if (prevType === Tokens.esc) return ++pos;
                    context.pop();
                }
            } else context.push(Context.literal);
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

    function isQuote(type: Tokens): type is (Tokens.dbquotes | Tokens.quoutes) {
        return [Tokens.quoutes, Tokens.dbquotes].includes(type);
    }

    function finishToken(token: Tokens): any {
        let prevType = type;
        type = token;
        if (isQuote(type)) quote = type;
        if (type === Tokens.any) return ++pos;
        update(prevType);
    }

    return code.slice(end, pos);
}

const linter = new Linter();

function adjustProps(code: string) {
    linter.defineParser('@babel/parser', {
        parse(text, options) {
            const node = parse(options, text) as any;
            node.tokens = [];
            node.comments = [];
            return node;
        },
    })
    linter.defineRule('format-props', {
        meta: {
            fixable: 'code',
        },
        create(context) {
            function getText(node: any) {
                return context.sourceCode.getText(node);
            }
            return {
                Property(node) {
                    if (node.parent.type !== 'ObjectExpression') return;
                    let value = node.value;
                    if (value.type === 'TemplateLiteral') {
                        context.report({
                            node,
                            fix(fixer) {
                                return fixer.replaceText(
                                    value,
                                    getText(value).slice(1, -1))
                            }, message: 'Fixing rule'
                        });
                    } else if (value.type === 'CallExpression') {
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
                                return fixer.replaceText(
                                    value,
                                    values.join(' | '))
                            }, message: 'Fixing rule'
                        });
                    }
                }
            }
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
            } as TrimOptions
        });

        return msg.output;
    } catch (error) {
        return code;
    }
}