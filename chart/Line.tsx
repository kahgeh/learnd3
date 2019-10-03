import * as React from 'react';
import { line, extent } from 'd3';
import { getScale, getValues, getValueTypeName, getAxisPositionalProperties, AxisPosition } from './Axis';
import { InjectedChartProps, ValueSource } from '.';
import { ChartAxis, getValidatedInjectedProps, ValueTypeName } from './Chart';
import { ValueType } from '..';
import ChartAxesFinder from './ChartAxesFinder';

function getLinePath<T extends ValueType>(
    x: T[],
    y: T[],
    xScale: any,
    yScale: any) {
    const lineGenerator = line();
    lineGenerator.x(d => xScale(d[0]));
    lineGenerator.y(d => yScale(d[1]));

    return lineGenerator(x.map((xi, i) => [xi, y[i]])) as string;
}

interface LineProps extends InjectedChartProps {
    color: string;
    x: ValueSource;
    y: ValueSource;
    chartAxes?: ChartAxis[];
}

const Line: React.FunctionComponent<LineProps> = (props) => {

    const { color, x, y, chart, data, chartAxes } = props;

    const xBuild = getLineScale(chart, data, [AxisPosition.Bottom], x, chartAxes);
    const yBuild = getLineScale(chart, data, [AxisPosition.Left, AxisPosition.Right], y, chartAxes);

    const linePath = getLinePath(xBuild.values, yBuild.values, xBuild.scale, yBuild.scale)

    return (
        <path d={linePath} fill="none" stroke={color} />
    );
}

export default Line;

function calculateScale<T extends ValueType>(
    chart: any,
    range: [T, T],
    dataType: ValueTypeName,
    position: AxisPosition) {
    const { start, end } = getAxisPositionalProperties(position, chart);
    return getScale(dataType, range, start, end);
}


function getLineScale(chart: any, data: any, positions: AxisPosition[], valueSource: ValueSource, chartAxes?: ChartAxis[]) {
    const validated = getValidatedInjectedProps({ chart, data });
    const values = getValues(valueSource, validated.data);
    const dataType = getValueTypeName(values[0]);
    const range = extent(values) as [ValueType, ValueType];
    if (chartAxes === null || chartAxes === undefined) {
        return {
            values,
            scale: calculateScale(chart, range, dataType, positions[0])
        }
    }

    let widestRange = (new ChartAxesFinder(chartAxes))
        .getSimilarPositionAndType(positions, dataType)
        .withinRange(range)
        .mostNarrowRange();

    const scale = (widestRange) ? widestRange.scale : calculateScale(chart, range, dataType, positions[0]);
    return {
        values,
        scale
    };

}
