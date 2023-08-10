import { ArrayList } from "trim-engine/util";

export interface Displacement {
    /**
     * Return number showing how much the content is being distorted at given offset
     * @param offset offset from the original text
     */
    distortionAt(offset: number): number;
    /**
     * Returns number showing the equivalent offset in edited document content
     * @param offset offset from the original text
     */
    offsetAt(offset: number): number;
    /**
     * Returns an Position Object
     * @param offset offset from the original text
     */
    positionAt(offset: number | ((arg: Distortion) => boolean)): DisplacedPosition | undefined;
    /**
     * Returns number showing the equivalent offset in original document content
     * @param offset offset from edited document
     */
    inverseOffsetAt(offset: number): number;
    /**
     * Distorts text in the original document at the provided offset
     * @param replaceWith value to replace the text in the original document
     * @param offset offset in the original document
     */
    distort(replaceWith: string, offset: number, type?: Offset): void;

    /**
     * Use this function to set the values in your new document
     * @param value value to set to new document
     * @param pos position to which new values are set
     */
    set(value: any, pos: number): void;
    /**
     * Use this function to get values from your new document
     * @param pos position where value requested is based
     */
    get(pos: number): string
    // sort(): void;
}

export interface Position {
    displacement: number, offset: number, index: number
}

export interface Distortion {
    displacement: number, offset: number, pos: Offset
}


interface DisplacedPosition extends Position {
    origin: number;
}

export enum Offset {
    SUFFIX,
    PREFIX
}

export default function (jsDoc: string[]): Displacement {
    const list = ArrayList<Distortion>(function (e) {
        if (e.displacement < 1) return false;
        if (this.length === 0) return true;
        let index = -1;
        let size = -1;
        //---------
        for (let i = 0; i < this.length; i++) {
            const item = this[i];
            if ((item.offset > e.offset) && (size > item.offset || size == -1)) {
                index = i;
                size = item.offset;
            } else if (item.offset === e.offset) {
                this.splice(i, 1, e);
                return false;
            }

            if (i === this.length - 1) {
                if (index > -1) this.splice(index, 0, e);
                else this.push(e);
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
            return this.positionAt(offset)?.displacement || 0;
        },

        positionAt(offset) {
            const values = list.filter(item => typeof offset === 'number'
                ? item.offset <= offset
                : offset(item));
            if (values.length === 0) return;
            const result = values.reduce((a, b) => ({ displacement: a.displacement + b.displacement, offset: b.offset, pos: Offset.PREFIX }));
            ///------------
            let last = values[values.length - 1];
            if (typeof offset === 'number'
                && (last.offset === (offset - 1)
                    || (
                        last.offset === offset
                        && (values[values.length - 2]?.offset || -1) < offset
                    )
                )
                && last.pos === Offset.SUFFIX) {
                if (values[values.length - 2]?.offset !== last.offset)
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
                return (counter + start) <= offset
            });
            ///-----
            return offset - (loc?.displacement || 0);
        },

        set(value, pos) {
            jsDoc[pos] = value;
        },

        get(pos) {
            return jsDoc[pos]
        },
    } as Displacement
}