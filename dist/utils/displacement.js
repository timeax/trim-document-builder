"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Offset = void 0;
const util_1 = require("trim-engine/util");
var Offset;
(function (Offset) {
    Offset[Offset["SUFFIX"] = 0] = "SUFFIX";
    Offset[Offset["PREFIX"] = 1] = "PREFIX";
})(Offset = exports.Offset || (exports.Offset = {}));
function default_1(jsDoc) {
    const list = (0, util_1.ArrayList)(function (e) {
        if (e.displacement < 1)
            return false;
        if (this.length === 0)
            return true;
        let index = -1;
        let size = -1;
        //---------
        for (let i = 0; i < this.length; i++) {
            const item = this[i];
            if ((item.offset > e.offset) && (size > item.offset || size == -1)) {
                index = i;
                size = item.offset;
            }
            else if (item.offset === e.offset) {
                this.splice(i, 1, e);
                return false;
            }
            if (i === this.length - 1) {
                if (index > -1)
                    this.splice(index, 0, e);
                else
                    this.push(e);
                return false;
            }
        }
        return false;
    });
    return {
        distort(content, pos, position = Offset.PREFIX) {
            jsDoc[pos] = content;
            list.add({
                displacement: content.length - 1,
                offset: pos,
                pos: position
            });
        },
        distortionAt(offset) {
            var _a;
            return ((_a = this.positionAt(offset)) === null || _a === void 0 ? void 0 : _a.displacement) || 0;
        },
        positionAt(offset) {
            var _a, _b;
            const values = list.filter(item => typeof offset === 'number'
                ? item.offset <= offset
                : offset(item));
            if (values.length === 0)
                return;
            const result = values.reduce((a, b) => ({ displacement: a.displacement + b.displacement, offset: b.offset, pos: Offset.PREFIX }));
            ///------------
            let last = values[values.length - 1];
            if (typeof offset === 'number'
                && (last.offset === (offset - 1)
                    || (last.offset === offset
                        && (((_a = values[values.length - 2]) === null || _a === void 0 ? void 0 : _a.offset) || -1) < offset))
                && last.pos === Offset.SUFFIX) {
                if (((_b = values[values.length - 2]) === null || _b === void 0 ? void 0 : _b.offset) !== last.offset)
                    result.displacement -= last.displacement;
            }
            return result;
        },
        offsetAt(offset) {
            return this.distortionAt(offset) + offset;
        },
        inverseOffsetAt(offset) {
            let counter = 0;
            //---
            let loc = this.positionAt(({ displacement, offset: start, pos }) => {
                counter += displacement;
                return (counter + start) <= offset;
            });
            ///-----
            return offset - ((loc === null || loc === void 0 ? void 0 : loc.displacement) || 0);
        },
        set(value, pos) {
            jsDoc[pos] = value;
        },
        get(pos) {
            return jsDoc[pos];
        },
    };
}
exports.default = default_1;
//# sourceMappingURL=displacement.js.map