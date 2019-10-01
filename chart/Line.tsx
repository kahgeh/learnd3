import * as React from 'react';
import { select, line } from 'd3';
import { getScale, getValues, getValueType, getAxisPositionalProperties, AxisPosition, AxisProps } from './Axis';
import { InjectedChartProps, ValueSource } from '.';
import { ChartAxis, getValidatedInjectedProps } from './Chart';

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

    const xBuild = getLineScale(chart, data, AxisPosition.Bottom, x, chartAxes);
    const yBuild = getLineScale(chart, data, AxisPosition.Left, y, chartAxes);

    const linePath = getLinePath(xBuild.values, yBuild.values, xBuild.scale, yBuild.scale)

    return (
        <path d={linePath} fill="none" stroke={color} />
    );
}

export default Line;

function calculateScale(chart: any, values: any, position: AxisPosition, valueSource: ValueSource) {
    const { start, end } = getAxisPositionalProperties(position, chart);
    const dataType = getValueType(values[0]);
    return getScale(dataType, values, start, end);
}

function getLineScale(chart: any, data: any, position: AxisPosition, valueSource: ValueSource, chartAxes?: ChartAxis[]) {
    const validated = getValidatedInjectedProps({ chart, data });
    const values = getValues(valueSource, validated.data);
    if (chartAxes === null || chartAxes === undefined) {
        return {
            values,
            scale: calculateScale(chart, values, position, valueSource)
        }
    }

    const suitableAxes = chartAxes.filter((axis) =>
        axis.position == position &&
        axis.valueSource.valuesFromProperty == valueSource.valuesFromProperty);
    const scale = (suitableAxes.length > 0) ? suitableAxes[0].scale : calculateScale(chart, values, position, valueSource);
    return {
        values,
        scale
    };
}
