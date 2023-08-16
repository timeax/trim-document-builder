import { Elements as em } from 'trim-engine/core';
import { EmbededRegion, Range } from "..";
import { getDocTrim } from "../utils";
import getSearcher from "../utils/displacement";
import { fillIn } from '../utils/filler';

export function buildDoc(regions: EmbededRegion, uri: string, code: string, type: 'html' | 'rules') {
    const htmlDoc = getDocTrim(code, uri);
    const builder = getSearcher(htmlDoc);
    //----------
    regions.forEach(region => {
        let range: Range = [region.start, region.end];

        if (region.type === 'rule' && type === 'rules') {
            let opening: em.jsRule['openingElement']['name'] | undefined = region.openingElement.name;
            ///--
            if (opening) {
                fillIn({
                    suffix: '();',
                    sE: true 
                }, opening.range as Range, code, builder);
            }
        } else if (type == 'html' && region.languageId === 'html' || region.languageId === 'html-attr') {
            if (region.type == 'htmlAttr') {

            }
        }
    });

    if (type === 'rules') {
        htmlDoc.push(lib)
    }

    return {
        doc: htmlDoc.join(''),
        builder
    }
}


const lib = /**/`
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
`