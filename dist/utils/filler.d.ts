import { Range } from "..";
import { Displacement } from "./displacement";
interface Fillers {
    prefix?: string;
    suffix?: string;
    clear?: boolean;
    pE?: boolean;
    sE?: boolean;
}
export declare function fillIn(fillers: Fillers, [start, end]: Range, mainText: string, builder: Displacement): void;
export {};
