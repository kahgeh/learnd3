import { ScaleBuild } from "./Axis";
import { ScaleContinuousNumeric } from "d3";
import { ChartAxis, ValueTypeName } from "./Chart";
import { ValueType } from "..";


declare module rd3 {
    interface InjectedChartProps {
        chart?: Dimension;
        data?: Datum[];
        dispatchAxesAction?: (action: any) => void;
        exponent?: number;
    }
    interface Dimension {
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

    interface ValueList {
        values: ValueType[],
        typeName?: ValueTypeName
    }
}
