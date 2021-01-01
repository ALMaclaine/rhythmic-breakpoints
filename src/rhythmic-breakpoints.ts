import {RhythmicBreakpointParams} from "./types";
import {MusicalRatios, ratioToPower} from "musical-ratios";
import {MediaQueryManager} from "media-query-manager";

export function centeredRange(start: number, end: number, stpSize: number = 1): number[] {
    const out = new Set<number>();
    let count = 0;

    for (let i = -stpSize; i > start - 1; i -= stpSize) {
        out.add(start + stpSize * count++);
    }

    out.add(0);
    count = 1;

    for (let i = stpSize; i < end + 1; i += stpSize) {
        out.add(stpSize * count++);
    }
    return Array.from<number>(out) ;
}

const rhymicBreakpointsDefaultParams: RhythmicBreakpointParams = {
    baseWidth: 1280,
    ratio: MusicalRatios.PerfectFifth,
    highBpCount: 3,
    lowBpCount: -3,
    stepSize: 1
}

export function rhythmicBreakpoints(params: RhythmicBreakpointParams = {}): MediaQueryManager {
    const {baseWidth, ratio, highBpCount, lowBpCount, stepSize} = {...rhymicBreakpointsDefaultParams, ...params};
    const range = centeredRange(lowBpCount, highBpCount, stepSize);
    const bpWidths = range.map(e => baseWidth * ratioToPower(ratio, e));
    return new MediaQueryManager(bpWidths);
}
