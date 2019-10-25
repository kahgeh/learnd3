import * as React from 'react';
import { AxisPosition, getContinuousValuesScale, getBandValuesScale, getValueList } from './Axis';
import { rd3 } from '.';
import { SeriesActionNames, getVisibility, chartContext } from './Chart';
import { ValueType } from '..';

function bar() {
    let _fx: (d: [number, number]) => number;
    let _fy: (d: [number, number]) => number
    const barObj = function (points: [number, number][], width: number) {
        const rects = [];
        for (const point of points) {
            rects.push({ x: _fx(point), y: _fy(point), width, height: _fy([point[0], 0]) - _fy(point) });
        }
        return rects;
    }
    barObj.x = (fx: (d: [number, number]) => number) => {
        _fx = fx;
        return barObj;
    }
    barObj.y = (fy: (d: [number, number]) => number) => {
        _fy = fy;
        return barObj;
    }
    return barObj;
}

function getBarRects<T extends ValueType>(
    x: T[],
    y: T[],
    xScale: any,
    yScale: any) {
    let barGenerator = bar()
        .x(d => xScale(d[0]))
        .y(d => yScale(d[1]));

    return barGenerator(x.map((xi, i) => [xi as number, y[i] as number]), xScale.bandwidth());
}

interface BarProps {
    index?: number;
    visible?: boolean;
    color: string;
    x: rd3.ValueSource;
    y: rd3.ValueSource;
    name?: string;
}

function getSeriesName(props: BarProps) {
    const { index, y, name } = props;

    if (name) {
        return name;
    }

    if (y && y.valuesFromProperty) {
        return y.valuesFromProperty;
    }

    return `series-${index}`
}

const Bar: React.FunctionComponent<BarProps> = (props) => {
    const { axes, dimensions, data, dispatchSeriesAction } = React.useContext(chartContext);
    const { color, x, y, index, visible } = props;
    const xList = getValueList(x, data);
    const yList = getValueList(y, data);
    const xScale = getBandValuesScale(dimensions, [AxisPosition.Bottom], xList, axes);
    const yScale = getContinuousValuesScale(dimensions, [AxisPosition.Left, AxisPosition.Right], yList, axes);

    const xBuild = { ...xList, scale: xScale };
    const yBuild = { ...yList, scale: yScale };

    const rects = getBarRects(xList.values, yList.values, xScale, yScale)
    const seriesName = getSeriesName(props);

    React.useEffect(() => {
        dispatchSeriesAction({ type: SeriesActionNames.add, payload: { color, seriesName, index, xBuild, yBuild } });
    }, [dispatchSeriesAction, color, seriesName]);
    return (<>
        {
            !getVisibility(visible) ? null :
                rects.map(
                    (rect, i) => {
                        console.log(rect);
                        const { x, y, width, height } = rect;
                        return (<rect key={i} x={x} y={y} width={width} height={height} stroke={color} fill={color} />);
                    })
        }
    </>);

}

export default Bar;