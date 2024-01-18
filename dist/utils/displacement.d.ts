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
    get(pos: number): string;
}
export interface Position {
    displacement: number;
    offset: number;
    index: number;
}
export interface Distortion {
    displacement: number;
    offset: number;
    pos: Offset;
    content?: string;
    extra?: DistortionType;
}
interface DisplacedPosition extends Position {
    origin: number;
}
type DistortionSize = Array<Offset.PREFIX | Offset.SUFFIX>;
interface DistortionType {
    type: DistortionSize;
    size: number[];
}
export declare enum Offset {
    PREFIX = 0,
    SUFFIX = 1,
    NONE = 2
}
export default function (jsDoc: string[]): Displacement;
export {};
