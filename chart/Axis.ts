import { axisBottom, axisLeft, scaleTime, scaleLinear, extent, Numeric, axisTop, axisRight } from "d3";
import { InjectedChartProps, ChartDimension, ValueSource } from ".";
import { ValueType } from "..";

export enum AxisPosition {
    Left = "Left",
    Bottom = "Bottom",
    Right = "Right"
}

export interface ScaleBuild {
    position: AxisPosition;
    dataType: ValueType;
    valueSource: ValueSource;
}

export interface AxisProps extends InjectedAxisProps {
    position: AxisPosition;
    label: string;
    valueSource: ValueSource;
    name?: string;
}

export interface InjectedAxisProps extends InjectedChartProps {
    dispatchAxesAction?: (action: any) => void;
}

export function getValidatedInjectedAxisProps(injectedProps: InjectedAxisProps): { chart: ChartDimension; data: Datum[], dispatchAxesAction: (action: any) => void } {
    const { chart, data, dispatchAxesAction } = injectedProps;
    if (chart === undefined || chart === null) {
        throw new Error("Injected chart property is empty")
    }


    if (data === undefined || data === null) {
        throw new Error("Injected data property is empty")
    }

    if (dispatchAxesAction === undefined || dispatchAxesAction === null) {
        throw new Error("Injected dispatchAxesAction property is empty")
    }

    return { chart, data, dispatchAxesAction };
}

export function getAxisPositionalProperties(position: AxisPosition, chart: ChartDimension) {
    const { width, height, margin } = chart;
    if (position === AxisPosition.Bottom) {
        const start = margin;
        const end = margin + width;
        return { translation: `translate(0,${height + margin})`, generator: axisBottom, start, end };
    }

    if (position === AxisPosition.Left) {
        const start = height + margin;
        const end = margin;
        return { translation: `translate(${margin},0)`, generator: axisLeft, start, end };
    }

    if (position === AxisPosition.Right) {
        const start = height + margin;
        const end = margin;
        return { translation: `translate(${margin + width},0)`, generator: axisRight, start, end };
    }

    const start = margin;
    const end = margin;
    return { translation: `translate(0,0)`, generator: axisTop, start, end }
}

function isDate(value: string | number | Date): boolean {
    const d = new Date(value);
    return (d instanceof Date && isFinite(d));
}



export function getValueType(value: any): ValueType {

    if (!Number.isNaN(value)) {
        return 'number'
    }
    if (isDate(value)) {
        return 'Date';
    }

    return 'unknown';
}

export function getValues(
    valueSource: ValueSource,
    data?: Datum[]) {
    const { values, valuesFromProperty } = valueSource;
    if (values === undefined && valuesFromProperty === undefined) {
        throw new Error("scale build must have either values or valuesFromProperty defined");
    }

    if (values != undefined && valuesFromProperty != undefined) {
        throw new Error("either values or valuesFromProperty must defined not both");
    }

    if (values) {
        return values;
    }

    return data.map(d => d[valuesFromProperty]) as Date[] | number[];

}

export function getScale(
    type: string,
    values: Date[] | number[],
    start: number,
    end: number) {

    if (type == "Date") {
        const dates = values as Date[];
        const minMaxDates = extent(dates);
        return scaleTime()
            .domain(minMaxDates as Date[])
            .range([start, end]);
    }

    const numbers = values as number[];
    const minMaxNumbers = extent(numbers);
    return scaleLinear()
        .domain(minMaxNumbers as Numeric[])
        .range([start, end]);
}
