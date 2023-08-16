import { util } from "@timeax/utilities";
import { Range } from "..";
import { Displacement, Offset } from "./displacement";

interface Fillers {
    prefix?: string;
    suffix?: string;
    clear?: boolean;
    pE?: boolean;
    sE?: boolean
}

export function fillIn(fillers: Fillers, [start, end]: Range, mainText: string, builder: Displacement) {
    if (fillers.clear) {
        for (let i = start; i < end; i++) {
            const ch = mainText.charAt(1);
            if (ch === '\n') builder.set(ch, i);
            else builder.set(' ', i);
        }
    } else {
        for (let i = start; i < end; i++) {
            builder.set(mainText.charAt(i), i);
        }
    }

    if (!util.unset(fillers.prefix)) builder.distort(fillers.prefix + (fillers.pE ? builder.get(start) : ''), start, Offset.PREFIX);
    if (!util.unset(fillers.suffix)) builder.distort(((fillers.sE ? builder.get(end - 1) : '')) + fillers.suffix, end - 1, fillers.sE ? Offset.SUFFIX : Offset.PREFIX);
}