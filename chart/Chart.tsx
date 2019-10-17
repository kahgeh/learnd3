import * as React from 'react';
import './Chart.css';
import { AxisPosition, ScaleBuild } from './Axis';
import { rd3 } from '.';
import Legend from './Legend';
import { ValueType } from '..';
import { Point, PointVisual, renderToolTip } from './PointVisual';
import { format } from 'd3';
import PowerScaleSlider from './PowerScaleSlider';

interface ChartProps {
    width: number;
    height: number;
    margin: number;
    data?: Datum[];
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

function getToolTip(value: any, pointVisual?: PointVisual) {
    if (!pointVisual || !pointVisual.toolTipTemplate) {
        return null;
    }

    return renderToolTip(pointVisual.toolTipTemplate, value);
}

export function mapXYtoPoints(x: ValueBuild, y: ValueBuild, pointVisual?: PointVisual): Point[] {
    let baseArray = x.values.length < y.values.length ? x.values : y.values;

    return baseArray.map((_, i) => {
        return {
            x: x.scale(x.values[i]),
            y: y.scale(y.values[i]),
            toolTip: getToolTip({ x: x.values[i], y: y.values[i] }, pointVisual)
        };
    });
}

function axesReducer(state, action) {
    switch (action.type) {
        case 'add':
            return [...(state.filter((axis: any) => axis.id != action.payload.id)), action.payload];
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

interface ContextMenuState {
    visibility: boolean;
    generators?: ((index: number) => JSX.Element)[];
}

enum ContextMenuActionNames {
    show = 'show',
    hide = 'hide'
}

interface ContextMenuActions {
    type: ContextMenuActionNames;
    payload: ContextMenuState;
}

function contextMenuReducer(state: ContextMenuState, action: ContextMenuActions) {
    switch (action.type) {
        case ContextMenuActionNames.show:
            return { visibility: true, ...action.payload };
        default:
            throw new Error(`unexpected action ${action.type}`);
    }
}

function exponentReducer(state: any, action: any) {
    switch (action.type) {
        case 'update':
            return action.payload;
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

export const ChartAxesContext = React.createContext<ChartAxis[]>([]);

const Chart: React.FunctionComponent<ChartProps> = (props) => {
    const { width, height, margin, data, axes } = props;
    const [chartAxes, dispatchAxesAction] = React.useReducer(axesReducer, []);
    const [chartSeries, dispatchSeriesAction] = React.useReducer(seriesReducer, []);
    const [contextMenu, dispatchContextMenuAction] = React.useReducer(contextMenuReducer, { visibility: false });
    const [exponent, dispatchExponent] = React.useReducer(exponentReducer, 1);

    return (<div className="chart">
        <ChartAxesContext.Provider value={chartAxes}>
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
                            visible: getSeriesVisibity(i, chartSeries),
                            dispatchSeriesAction,
                            exponent
                        });
                    }) : null
                }
                <g>
                    {
                        axes ? axes.map((axis, i) => {
                            const originalProps = axis.props;
                            return React.cloneElement(axis, { ...originalProps, key: i, index: i, chart: { height, width, margin }, data, dispatchAxesAction, dispatchContextMenuAction, exponent });
                        }) : null
                    }
                </g>
            </svg>
            <Legend
                chartSeries={chartSeries}
                dispatchSeriesAction={dispatchSeriesAction}
            />
            {
                contextMenu.visibility ? (<div className="chart-contextmenu" style={{ left: 100, top: 100 }}>
                    <PowerScaleSlider value={exponent} dispatchExponent={dispatchExponent} />
                </div>) : null
            }
        </ChartAxesContext.Provider>
    </div>);
}

export default Chart;