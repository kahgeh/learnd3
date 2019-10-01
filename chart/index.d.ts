import { ScaleBuild } from "./Axis";
import { ScaleContinuousNumeric } from "d3";
import { ChartAxis } from "./Chart";


declare interface InjectedChartProps {
    chart?: ChartDimension;
    data?: Datum[];
    dispatchAxesAction?: (action: any) => void;
}

declare interface ChartDimension {
    width: number;
    height: number;
    margin: number;
}

declare interface ValueSource {
    values?: number[] | Date[];
    valuesFromProperty?: string;
}