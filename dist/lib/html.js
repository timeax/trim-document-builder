"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildDoc = void 0;
const utils_1 = require("../utils");
const displacement_1 = __importDefault(require("../utils/displacement"));
const filler_1 = require("../utils/filler");
function buildDoc(regions, uri, code, type) {
    const htmlDoc = (0, utils_1.getDocTrim)(code, uri);
    const builder = (0, displacement_1.default)(htmlDoc);
    //----------
    regions.forEach(region => {
        let range = [region.start, region.end];
        if (region.type === 'rule' && type === 'rules') {
            let opening = region.openingElement.name;
            ///--
            if (opening) {
                (0, filler_1.fillIn)({
                    suffix: '();',
                    sE: true
                }, opening.range, code, builder);
            }
        }
        else if (type == 'html' && region.languageId === 'html' || region.languageId === 'html-attr') {
            if (region.type == 'htmlAttr') {
            }
        }
    });
    if (type === 'rules') {
        htmlDoc.push(lib);
    }
    return {
        doc: htmlDoc.join(''),
        builder
    };
}
exports.buildDoc = buildDoc;
const lib = /**/ `
/**
 * This rule is used to import javascript files, but can also be used to import .trx and text files 
 * @isBlock false
 * @param ImportDeclaration Es6 import declaration
 * @example {@import name from '../lib'}
 */
declare function import() {}

/**
 * This rule is used to import .trx and \`only\` .trx files
 * @isBlock false
 * @param ImportDeclaration Es6 import declaration
 * @example {@use name from '../lib'}
 */
declare function use() {}

/**
 * This rule is used to import javascript files that will be used on the browser window... works for programs like electron.js
 * @isBlock false
 * @param ImportDeclaration Es6 import declaration
 * @example {@require name from '../lib'}
 */
declare function require() {}

/**
 * @isBlock true
 * @param BinaryExpression
 * @example {@each item in items}...{/each} Or {@each item of items}...{/each}
 */
declare function each(): string {}

/**
 * @isBlock true
 * @param AlpineJsForLoop 
 * @see https://alpinejs.dev/essentials/installation
 * @example {@for item in items, key}...{/for}
 */
declare function for(): string {}

declare function switch(): string {}
declare function case(): string {}
declare function default(): string {}


declare function if(): string{}
declare function elseif(): string{}
declare function else(): string;
declare function condition(): string;

/**
 * Router rule is used to create a routing system within your project
 * @note - It must be used within the root page of your program
 * @isBlock true
*/
declare function Router(): string;
/**
 * Routes rule is where the routes are inserted.. 
 * @note - It must be used within the \`@Router\` rule
 * @isBlock true
*/
declare function Routes(): string;

/**
 * @isBlock true
 * @param BinaryExpression
 * @example {@export 'Button'}...{/export}
 */
declare function export(): string;
`;
//# sourceMappingURL=html.js.map