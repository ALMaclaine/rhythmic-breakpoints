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
    return Array.from<number>(out);
}

const rhymicBreakpointsDefaultParams: RhythmicBreakpointParams = {
    baseWidth: 1280,
    ratio: MusicalRatios.PerfectFifth,
    highBpCount: 3,
    lowBpCount: -3,
    stepSize: 1
}

export class RhythmicBreakpoints extends MediaQueryManager {
    private _breakpointRatioMap;

    constructor(params: RhythmicBreakpointParams = {}) {
        const {baseWidth, ratio, highBpCount, lowBpCount, stepSize} = {...rhymicBreakpointsDefaultParams, ...params};
        const range = centeredRange(lowBpCount, highBpCount, stepSize);
        const bpWidths = range.map(e => baseWidth * ratioToPower(ratio, e));
        super(bpWidths);
        this._breakpointRatioMap = new Map<number, string>();
        for (const breakPt of this.breaks) this._breakpointRatioMap.set(breakPt, MusicalRatios.PerfectFifth);
    }

    setBpInterval(breakPt: number, interval: string | MusicalRatios): void {
        if (!this._breakpointRatioMap.has(breakPt)) throw new Error(`Invalid breakpoint: ${breakPt}`);
        this._breakpointRatioMap.set(breakPt, interval);
    }

    getBpInterval(breakPt: number): string | MusicalRatios {
        if (!this._breakpointRatioMap.has(breakPt)) throw new Error(`Invalid breakpoint: ${breakPt}`);
        return this._breakpointRatioMap.get(breakPt);
    }

    get breakpointRatioMap(): Map<number, string> {
        return new Map(this._breakpointRatioMap);
    }

    set breakpointRatioMap(map: Map<number, string>) {
        const keys = Object.keys(map);
        if(keys.sort().join(',') !== this.breaks.join(',')) {
            throw new Error('invalid keys in map');
        }
        this._breakpointRatioMap = map;
    }

    shiftBreakpoint(breakpoint: number, shift: number) {
        const index = this.breaks.indexOf(breakpoint);
        if (index === -1) throw new Error('Invalid breakpoint');
        const shiftedIndex = index + shift;
        if (shiftedIndex < 0) {
            return this.breaks[0];
        }
        if (shiftedIndex >= this.breaks.length) {
            return this.breaks[this.breaks.length - 1];
        } else {
            return this.breaks[shiftedIndex];
        }
    }
}
