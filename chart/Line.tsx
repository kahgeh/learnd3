import * as React from 'react';
import { line, extent, values } from 'd3';
import { getScale, getValues, getValueTypeName, getAxisPositionalProperties, AxisPosition } from './Axis';
import { rd3 } from '.';
import { ChartAxis, getValidatedInjectedProps, ValueTypeName, SeriesAction, SeriesActionNames, getVisibility, mapXYtoPoints, ValueBuild } from './Chart';
import { ValueType } from '..';
import ChartAxesFinder from './ChartAxesFinder';
import { PointVisual, generate } from './PointVisual';
function getLinePath<T extends ValueType>(
    x: T[],
    y: T[],
    xScale: any,
    yScale: any,
    curve?: any) {
    let lineGenerator = line();
    lineGenerator.x(d => xScale(d[0]));
    lineGenerator.y(d => yScale(d[1]));

    if (curve) {
        lineGenerator = lineGenerator.curve(curve);
    }
    return lineGenerator(x.map((xi, i) => [xi, y[i]])) as string;
}

interface LineProps extends rd3.InjectedChartProps {
    index?: number;
    visible?: boolean;
    color: string;
    x: rd3.ValueSource;
    y: rd3.ValueSource;
    name?: string;
    pointVisual?: PointVisual;
    chartAxes?: ChartAxis[];
    curve?: any;
    dispatchSeriesAction?: (action: any) => void;
}

function getSeriesName(props: LineProps) {
    const { index, y, name } = props;

    if (name) {
        return name;
    }

    if (y && y.valuesFromProperty) {
        return y.valuesFromProperty;
    }

    return `series-${index}`
}

function getDispatchSeriesAction(props: LineProps) {
    const { dispatchSeriesAction } = props;
    if (!dispatchSeriesAction) {
        return (action: SeriesAction) => { console.log('WARNING: empty dispatch being called') };
    }
    return dispatchSeriesAction;
}

function calculateScale<T extends ValueType>(
    chart: any,
    range: [T, T],
    dataType: ValueTypeName,
    position: AxisPosition) {
    const { start, end } = getAxisPositionalProperties(position, chart);
    return getScale(dataType, range, start, end);
}

function getLineScale(chart: any, positions: AxisPosition[], valueSource: rd3.ValueSource, data?: any, chartAxes?: ChartAxis[]): ValueBuild {
    const values = getValues(valueSource, data);
    const dataType = getValueTypeName(values[0]);
    const range = extent(values) as [ValueType, ValueType];
    if (chartAxes === null || chartAxes === undefined) {
        return {
            values,
            scale: calculateScale(chart, range, dataType, positions[0])
        }
    }

    let mostNarrowRange = (new ChartAxesFinder(chartAxes))
        .getSimilarPositionAndType(positions, dataType)
        .withinRange(range)
        .mostNarrowRange();

    const scale = (mostNarrowRange) ? mostNarrowRange.scale : calculateScale(chart, range, dataType, positions[0]);
    return {
        values,
        scale
    };

}

const Line: React.FunctionComponent<LineProps> = (props) => {

    const { color, x, y, chart, data, pointVisual, chartAxes, index, visible, curve, exponent } = props;
    if (!chart) {
        throw new Error("Injected chart property is empty")
    }
    const xBuild = getLineScale(chart, [AxisPosition.Bottom], x, data, chartAxes);
    const yBuild = getLineScale(chart, [AxisPosition.Left, AxisPosition.Right], y, data, chartAxes);
    const linePath = getLinePath(xBuild.values, yBuild.values, xBuild.scale, yBuild.scale, curve)
    const seriesName = getSeriesName(props);
    const dispatchSeriesAction = getDispatchSeriesAction(props);
    const points = mapXYtoPoints(xBuild, yBuild, pointVisual);

    React.useEffect(() => {
        dispatchSeriesAction({ type: SeriesActionNames.add, payload: { color, seriesName, index, xBuild, yBuild } });
    }, [dispatchSeriesAction, color, seriesName]);
    return (
        !getVisibility(visible) ? null :
            <>
                <path d={linePath} fill="none" stroke={color} />
                {
                    (pointVisual) ?
                        generate(pointVisual, color, points) : null
                }
            </>
    );
}

export default Line;