//@ts-nocheck
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
    positionAt(offset: number | ((arg: Distortion, next?: Distortion, prev?: Distortion[], isLast?: boolean) => boolean)): DisplacedPosition | undefined;
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
    displacement: number,
    offset: number,
    pos: Offset,
    content?: string,
    extra?: DistortionType
}


interface DisplacedPosition extends Position {
    origin: number;
}

type DistortionSize = Array<Offset.PREFIX | Offset.SUFFIX>;

interface DistortionType {
    type: DistortionSize;
    size: number[]
}


export enum Offset {
    PREFIX,
    SUFFIX,
    NONE
}

function mapValuesFromType(param: DistortionType) {
    let res = { [Offset.PREFIX]: -1, [Offset.SUFFIX]: 0 };
    //----
    param.type.forEach((pos, index) => res[pos] += param.size[index]);
    return res;
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
                //-----
                e.extra = {
                    type: [...(item.extra?.type || [item.pos]), e.pos as any],
                    size: [...(item.extra?.size || [item.displacement]), e.displacement - item.displacement]
                }
                ///----
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
        distort(content, pos, position = Offset.NONE) {
            jsDoc[pos] = content;
            list.add({
                displacement: content.length - 1,
                offset: pos,
                content,
                pos: position
            });
        },

        distortionAt(offset) {
            return this.positionAt(offset)?.displacement || 0;
        },

        positionAt(offset) {
            const prevList: Distortion[] = []
            const values = list.filter((item, i): any => (typeof offset === 'number'
                ? item.offset <= offset
                : offset(item, list.get(i + 1), (i > 0 && prevList.push(list.get(i - 1)), prevList))));
            if (values.length === 0) return;
            //=====
            let index = 0, result: Distortion = null as unknown as Distortion;
            for (const b of values) {
                const a = result || { displacement: 0, offset: 0 };
                //--------
                let curDIsplacement = b.displacement, curOffset = b.offset;

                result = {
                    displacement: a.displacement + curDIsplacement,
                    offset: curOffset,
                    pos: Offset.PREFIX
                }

                if (index === values.length - 1) {
                    let toBreak = false, cur: Distortion = b;

                    while (cur && (cur.extra?.type.includes(Offset.SUFFIX) || cur.pos === Offset.SUFFIX)) {
                        if (typeof offset == 'number') {
                            let diff = offset - cur.offset;
                            if (diff < 2) {
                                if (cur.extra) {
                                    const map = mapValuesFromType(cur.extra);
                                    curDIsplacement = map[Offset.SUFFIX]
                                }

                                result.displacement -= curDIsplacement;
                                if (offset === cur.offset) result.displacement += 1;
                                //----
                                toBreak = true;
                            } else break;
                        } else {

                        };
                        //---
                        cur = values[(index -= 1)];
                    }

                    if (toBreak) break;
                }

                index++;
            }

            return result;
        },

        offsetAt(offset) {
            return this.distortionAt(offset) + offset;
        },

        inverseOffsetAt(offset) {
            let counter = 0, stop = false, num = 0, tempCounter;
            //---
            let loc = this.positionAt(({ displacement, offset: start, pos, extra, content }, next, prev) => {
                if (stop) return false;
                counter += displacement;
                //---
                let temp = counter + start;
                if (temp > offset) {
                    tempCounter = counter;
                    counter -= displacement;
                    stop = true;
                    // ------
                    if (extra && start < offset) {
                        const map = mapValuesFromType(extra);
                        const prefix = map[Offset.PREFIX];
                        if (prefix !== -1
                            && ((counter + prefix) + start) <= offset) {
                            num = prefix;
                        }

                        if (map[Offset.SUFFIX] > -1 && pos !== Offset.SUFFIX) num -= map[Offset.SUFFIX]
                        else if (pos === Offset.SUFFIX && start < offset) {
                            num -= displacement;
                            if ((temp + num) > offset) num = 0;
                        }
                    } else if (pos === Offset.SUFFIX && start < offset) {
                        num -= (displacement - 1);
                        if ((temp + num) > offset) num = 0;
                    }
                    // for (const item of prev) {
                    //     if (prev.indexOf(item) === 0) {

                    //     }

                    //     //-------
                    //     if (num < 0 && ((counter - num) + item.offset) <= offset) break;
                    //     if (item.pos === Offset.SUFFIX) {
                    //         if (item.extra) {
                    //             if (item.extra.type.includes(Offset.PREFIX)) break;
                    //             let index = 0;
                    //             for (const _type of item.extra.type) {
                    //                 let displacement = ((counter - num) - item.extra.size[index])
                    //                 if (displacement + item.offset > offset) {
                    //                     num -= item.extra.size[index];
                    //                     temp = (tempCounter - num) + item.offset;
                    //                 }
                    //                 index++;
                    //             }
                    //         }
                    //         else {
                    //             num -= item.displacement;
                    //             temp = counter - num;
                    //         }
                    //     } else break;
                    // }

                }
                return (counter + start) <= offset
            });
            ///-----
            return (offset - (loc?.displacement || 0) - num);
        },

        set(value, pos) {
            jsDoc[pos] = value;
        },

        get(pos) {
            return jsDoc[pos]
        },
    } as Displacement
}