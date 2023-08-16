"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fillIn = void 0;
const utilities_1 = require("@timeax/utilities");
const displacement_1 = require("./displacement");
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
exports.fillIn = fillIn;
//# sourceMappingURL=filler.js.map