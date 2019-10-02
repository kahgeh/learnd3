import * as React from 'react';
import { line, extent } from 'd3';
import { getScale, getValues, getValueType, getAxisPositionalProperties, AxisPosition } from './Axis';
import { InjectedChartProps, ValueSource } from '.';
import { ChartAxis, getValidatedInjectedProps } from './Chart';
import { ValueType } from '..';

function getLinePath(
    x: Date[] | number[],
    y: Date[] | number[],
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

function calculateScale(
    chart: any,
    values: Date[] | number[],
    dataType: ValueType,
    position: AxisPosition) {
    const { start, end } = getAxisPositionalProperties(position, chart);
    return getScale(dataType, values, start, end);
}



function getLineScale(chart: any, data: any, positions: AxisPosition[], valueSource: ValueSource, chartAxes?: ChartAxis[]) {
    const validated = getValidatedInjectedProps({ chart, data });
    const values = getValues(valueSource, validated.data);
    const dataType = getValueType(values[0]);
    if (chartAxes === null || chartAxes === undefined) {
        return {
            values,
            scale: calculateScale(chart, values, dataType, positions[0])
        }
    }

    const suitableAxes = chartAxes.filter((axis) =>
        positions.indexOf(axis.position) >= 0 &&
        axis.scaleBuild.dataType == dataType &&
        ((axis.scaleBuild.valueSource.values
            && valueSource.values
            && extent(valueSource.values) == axis.scaleBuild.valueSource.values) ||
            axis.scaleBuild.valueSource.valuesFromProperty == valueSource.valuesFromProperty));
    const scale = (suitableAxes.length > 0) ? suitableAxes[0].scale : calculateScale(chart, values, dataType, positions[0]);
    return {
        values,
        scale
    };
}
