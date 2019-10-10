import { ScaleBuild } from "./Axis";
import { ScaleContinuousNumeric } from "d3";
import { ChartAxis } from "./Chart";
import { ValueType } from "..";


declare module rd3 {
    interface InjectedChartProps {
        chart?: ChartDimension;
        data?: Datum[];
        dispatchAxesAction?: (action: any) => void;
    }
    interface ChartDimension {
        width: number;
        height: number;
        margin: number;
    }
    interface ValueSource {
        values?: ValueType[];
        valuesFromProperty?: string;
    }

    interface Series {
        seriesName: string;
        color: string;
        visible: boolean;
        point: PointVisual;
    }
}
