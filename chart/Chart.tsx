import * as React from 'react';
import './Chart.css';
import { AxisPosition, ScaleBuild } from './Axis';
import { rd3 } from '.';
import Legend from './Legend';
import { ValueType } from '..';
import { Point } from './PointVisual';

interface ChartProps {
    width: number;
    height: number;
    margin: number;
    data: Datum[];
    axes?: JSX.Element[];
}

export interface ValueBuild {
    scale: any;
    values: ValueType[];
}

export enum ValueTypeName {
    number = 'number',
    Date = 'Date',
    unknown = 'unknown'
}

export interface ChartAxis {
    scaleBuild: ScaleBuild;
    scale: any;
    position: AxisPosition;
    type: string;
}

export function mapXYtoPoints(x: ValueBuild, y: ValueBuild): Point[] {
    let baseArray = x.values.length < y.values.length ? x.values : y.values;
    return baseArray.map((_, i) => { return { x: x.scale(x.values[i]), y: y.scale(y.values[i]) }; });
}

function axesReducer(state, action) {
    switch (action.type) {
        case 'add':
            return [...state, action.payload];
        default:
            throw new Error(`unexpected action ${action.type}`);
    }
}

export enum SeriesActionNames {
    add = 'add',
    toggleVisibility = 'toggleVisibility'
}

export type SeriesAction = {
    type: SeriesActionNames;
    payload: any;
}

export function getSeriesName(series: rd3.Series, index: number) {
    let seriesName = series.seriesName;
    if (!series.seriesName) {
        seriesName = `Series ${index}`;
    }
    return seriesName;
}

export function getVisibility(visible?: boolean) {
    if (visible === null || visible === undefined) {
        return true;
    }
    return visible;
}

function disableSeries(chartSeries: rd3.Series[], index: number) {
    return chartSeries.map((series, i) =>
        (i === index) ? { ...series, visible: !getVisibility(series.visible) } :
            { ...series });
}

function getSeriesVisibity(index: number, chartSeries?: rd3.Series[]) {
    if (!chartSeries) {
        return null;
    }

    if (chartSeries.length <= index) {
        return null
    }

    return chartSeries[index].visible;
}

function seriesReducer(state: rd3.Series[], action: SeriesAction) {
    switch (action.type) {
        case SeriesActionNames.add:
            return [...state, action.payload];
        case SeriesActionNames.toggleVisibility:
            return disableSeries(state, action.payload.index);
        default:
            throw new Error(`unexpected action ${action.type}`);
    }
}

function getArray(obj: any) {
    if (obj === null || obj == undefined) {
        return obj;
    }
    return (Array.isArray(obj)) ? obj : [obj];
}

export function getValidatedInjectedProps(injectedProps: rd3.InjectedChartProps): { chart: rd3.ChartDimension; data: Datum[] } {
    const { chart, data } = injectedProps;
    if (chart === undefined || chart === null) {
        throw new Error("Injected chart property is empty")
    }


    if (data === undefined || data === null) {
        throw new Error("Injected data property is empty")
    }

    return { chart, data };
}

const Chart: React.FunctionComponent<ChartProps> = (props) => {

    const { width, height, margin, data, axes } = props;
    const [chartAxes, dispatchAxesAction] = React.useReducer(axesReducer, []);
    const [chartSeries, dispatchSeriesAction] = React.useReducer(seriesReducer, []);

    return (<div className="chart">
        <svg width={width + 2 * margin} height={height + 2 * margin} className="chart-svg">
            {
                props.children ? getArray(props.children).map((child: React.DetailedReactHTMLElement<any, HTMLElement>, i: number) => {
                    const originalProps = child.props;
                    return React.cloneElement(child, {
                        ...originalProps,
                        key: i,
                        chart: { height, width, margin },
                        data,
                        index: i,
                        chartAxes,
                        visible: getSeriesVisibity(i, chartSeries),
                        dispatchSeriesAction
                    });
                }) : null
            }
            <g>
                {
                    axes ? axes.map((axis, i) => {
                        const originalProps = axis.props;
                        return React.cloneElement(axis, { ...originalProps, key: i, chart: { height, width, margin }, data, dispatchAxesAction });
                    }) : null
                }
            </g>
        </svg>
        <Legend
            chartSeries={chartSeries}
            dispatchSeriesAction={dispatchSeriesAction}
        />
    </div>);
}

export default Chart;