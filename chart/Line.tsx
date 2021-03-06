import * as React from 'react';
import { line } from 'd3';
import { AxisPosition, getContinuousValuesScale, getValueList } from './Axis';
import { rd3 } from '.';
import { SeriesActionNames, getVisibility, mapXYtoPoints, chartContext } from './Chart';
import { ValueType } from '..';
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
    curve?: any;
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


const Line: React.FunctionComponent<LineProps> = (props) => {
    const { axes, dimensions, data, dispatchSeriesAction } = React.useContext(chartContext);

    const { color, x, y, pointVisual, index, visible, curve } = props;
    const xList = getValueList(x, data);
    const yList = getValueList(y, data);
    const xScale = getContinuousValuesScale(dimensions, [AxisPosition.Bottom], xList, axes);
    const yScale = getContinuousValuesScale(dimensions, [AxisPosition.Left, AxisPosition.Right], yList, axes);

    const xBuild = { ...xList, scale: xScale };
    const yBuild = { ...yList, scale: yScale };

    const linePath = getLinePath(xList.values, yList.values, xScale, yScale, curve)
    const seriesName = getSeriesName(props);
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