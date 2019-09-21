import { AxisScale, ScaleTime, timeFormat, axisBottom, axisLeft, scaleTime, scaleLinear, ScaleLinear, extent, Numeric, axisTop } from "d3";

export enum AxisPosition {
    Left = "Left",
    Bottom = "Bottom"
}

export interface ScaleBuild {
    valuesFromProperty: string;
}

export interface AxisProps extends InjectedChartProps {
    position: AxisPosition;
    label: string;
    scaleBuild: ScaleBuild;
}

export interface InjectedChartProps {
    chart?: ChartDimension;
    data?: Datum[];
}

export function getValidatedInjectedProps(injectedProps: InjectedChartProps): { chart: ChartDimension; data: Datum[] } {
    const { chart, data } = injectedProps;
    if (chart === undefined || chart === null) {
        throw new Error("Injected chart property is empty")
    }


    if (data === undefined || data === null) {
        throw new Error("Injected data property is empty")
    }

    return { chart, data };
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

    const start = margin;
    const end = margin;
    return { translation: `translate(0,0)`, generator: axisTop, start, end }
}

function isDate(value: string | number | Date): boolean {
    const d = new Date(value);
    return (d instanceof Date && isFinite(d));
}


type AllScaleTypes = ScaleLinear<number, number> | ScaleTime<Date, Date> | ScaleTime<number, number>;

export function getFirstValueType(data: Datum[], propertyName: string) {
    const firstValue = data[0][propertyName];

    if (!Number.isNaN(firstValue)) {
        return 'number'
    }
    if (isDate(firstValue)) {
        return 'Date';
    }

    return 'number';
}

export function getScale(
    type: string,
    scaleBuild: ScaleBuild,
    data: Datum[],
    start: number,
    end: number) {
    const propertyName = scaleBuild.valuesFromProperty;

    if (type == "Date") {
        const dates = data.map(row => new Date(row[propertyName]));
        const minMaxDates = extent(dates);
        return scaleTime()
            .domain(minMaxDates as Date[])
            .range([start, end]);
    }

    const numbers = data.map(row => row[propertyName] as number);
    const minMaxNumbers = extent(numbers);
    return scaleLinear()
        .domain(minMaxNumbers as Numeric[])
        .range([start, end]);
}