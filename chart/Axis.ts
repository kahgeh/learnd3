import { axisBottom, axisLeft, scaleTime, scaleLinear, extent, Numeric, axisTop, axisRight } from "d3";
import { rd3 } from ".";
import { ValueType } from "..";
import { ValueTypeName } from "./Chart";

export enum AxisPosition {
    Left = "Left",
    Bottom = "Bottom",
    Right = "Right"
}

export interface ScaleBuild {
    position: AxisPosition;
    range: [ValueType, ValueType];
    dataType: ValueTypeName;
    valueSource: rd3.ValueSource;
}

export interface AxisProps extends InjectedAxisProps {
    position: AxisPosition;
    label?: string;
    valueSource: rd3.ValueSource;
    name?: string;
    showGridLines?: boolean;
}

export interface InjectedAxisProps extends rd3.InjectedChartProps {
    dispatchAxesAction?: (action: any) => void;
}

export function getValidatedInjectedAxisProps(injectedProps: InjectedAxisProps): { chart: rd3.ChartDimension; dispatchAxesAction: (action: any) => void } {
    const { chart, dispatchAxesAction } = injectedProps;
    if (chart === undefined || chart === null) {
        throw new Error("Injected chart property is empty")
    }

    if (dispatchAxesAction === undefined || dispatchAxesAction === null) {
        throw new Error("Injected dispatchAxesAction property is empty")
    }

    return { chart, dispatchAxesAction };
}

export function getAxisPositionalProperties(position: AxisPosition, chart: rd3.ChartDimension) {
    const { width, height, margin } = chart;
    if (position === AxisPosition.Bottom) {
        const start = margin;
        const end = margin + width;
        return { translation: `translate(0,${height + margin})`, generator: axisBottom, start, end, perpendicularWidth: height };
    }

    if (position === AxisPosition.Left) {
        const start = height + margin;
        const end = margin;
        return { translation: `translate(${margin},0)`, generator: axisLeft, start, end, perpendicularWidth: -width };
    }

    if (position === AxisPosition.Right) {
        const start = height + margin;
        const end = margin;
        return { translation: `translate(${margin + width},0)`, generator: axisRight, start, end, perpendicularWidth: width };
    }

    const start = margin;
    const end = margin;
    return { translation: `translate(0,0)`, generator: axisTop, start, end, perpendicularWidth: height }
}

function isDate(value: string | number | Date): boolean {
    const d = new Date(value);
    return (d instanceof Date && isFinite(d));
}

export function getValueTypeName<T extends ValueType>(value: T): ValueTypeName {

    if (!Number.isNaN(value as any)) {
        return ValueTypeName.number;
    }
    if (isDate(value)) {
        return ValueTypeName.Date;
    }

    return ValueTypeName.unknown;
}

export function getValues(
    valueSource: rd3.ValueSource,
    data?: Datum[]) {
    const { values, valuesFromProperty } = valueSource;
    if (!(values || valuesFromProperty)) {
        throw new Error("scale build must have either values or valuesFromProperty defined");
    }

    if (!values && !valuesFromProperty) {
        throw new Error("either values or valuesFromProperty must defined not both");
    }

    if (values) {
        return values;
    }

    if (!data || !valuesFromProperty) {
        return [];
    }

    return data.map(d => d[valuesFromProperty]) as Date[] | number[];
}

export function getScale<T extends ValueType>(
    type: string,
    range: [T | undefined, T | undefined],
    start: number,
    end: number) {

    if (type == "Date") {
        return scaleTime()
            .domain(range as [T, T])
            .range([start, end]);
    }

    return scaleLinear()
        .domain(range as [T, T])
        .range([start, end]);
}

