import { axisBottom, axisLeft, scaleTime, scaleLinear, extent, Numeric, axisTop, axisRight, scalePow } from "d3";
import { rd3 } from ".";
import { ValueType } from "..";
import { ValueTypeName, ChartAxis } from "./Chart";
import ChartAxesFinder from "./ChartAxesFinder";
import * as d3 from 'd3';

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
    index?: number;
}

export function getInjectedAxisProps(props: any) {
    const { index } = props;
    if (index === null || index === undefined) {
        throw new Error("Injected property index cannot be null or undefined")
    }
    return { index };
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
    end: number,
    exponent?: number) {

    if (type == "Date") {
        return scaleTime()
            .domain(range as [T, T])
            .range([start, end]);
    }

    if (exponent) {
        return scalePow()
            .domain(range as [T, T])
            .range([start, end])
            .exponent(exponent);
    }

    return scaleLinear()
        .domain(range as [T, T])
        .range([start, end]);
}

function calculateLineScale<T extends ValueType>(
    chart: any,
    range: [T, T],
    dataType: ValueTypeName,
    position: AxisPosition) {
    const { start, end } = getAxisPositionalProperties(position, chart);
    return getScale(dataType, range, start, end);
}

export function getLineScale(chart: any, positions: AxisPosition[], valueSource: rd3.ValueSource, data?: any, chartAxes?: ChartAxis[]): ValueBuild {
    const values = getValues(valueSource, data);
    const dataType = getValueTypeName(values[0]);
    const range = extent(values) as [ValueType, ValueType];
    if (chartAxes === null || chartAxes === undefined) {
        return {
            values,
            scale: calculateLineScale(chart, range, dataType, positions[0])
        }
    }

    let mostNarrowRange = (new ChartAxesFinder(chartAxes))
        .getSimilarPositionAndType(positions, dataType)
        .withinRange(range)
        .mostNarrowRange();

    const scale = (mostNarrowRange) ? mostNarrowRange.scale : calculateLineScale(chart, range, dataType, positions[0]);
    return {
        values,
        scale
    };

}

function calculateBarScale<T extends ValueType>(
    chart: any,
    range: T[],
    dataType: ValueTypeName,
    position: AxisPosition) {
    const { start, end } = getAxisPositionalProperties(position, chart);
    return d3.scaleBand()
        .range([start, end])
        .padding(0.1)
        .domain(range);
}

export function getBarScale(chart: any, positions: AxisPosition[], valueSource: rd3.ValueSource, data?: any, chartAxes?: ChartAxis[]) {
    const values = getValues(valueSource, data);
    const dataType = getValueTypeName(values[0]);
    const range = extent(values) as [ValueType, ValueType];
    if (chartAxes === null || chartAxes === undefined) {
        return {
            values,
            scale: calculateBarScale(chart, values, dataType, positions[0])
        }
    }
    return {
        values,
        scale: calculateBarScale(chart, values, dataType, positions[0])
    }
}