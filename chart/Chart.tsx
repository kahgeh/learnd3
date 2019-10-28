import * as React from 'react';
import './Chart.css';
import { AxisPosition, ScaleBuild } from './Axis';
import { rd3 } from '.';
import Legend from './Legend';
import { ValueType } from '..';
import { Point, PointVisual, renderToolTip } from './PointVisual';

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
    string = 'string',
    unknown = 'unknown'
}

export interface ChartAxis {
    id: string;
    scaleBuild: ScaleBuild;
    scale: any;
    position: AxisPosition;
    type: string;
    exponent: number;
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

export enum AxisActionNames {
    add = 'add',
    updateExponent = 'updateExponent'
}

export type AxisAction = {
    type: AxisActionNames;
    payload: any;
}

function axesReducer(state: ChartAxis[], action: AxisAction) {
    const { type, payload } = action;
    switch (type) {
        case AxisActionNames.add:
            return [...(state.filter((axis: any) => axis.id != payload.id)), payload];
        case AxisActionNames.updateExponent:
            const axis = state.filter((axis: any) => axis.id == payload.id)[0];
            console.log(`updating exponent value for axis ${axis.id} with new value ${payload.exponent}`);
            const updatedAxis = { ...axis, exponent: payload.exponent };
            console.log(updatedAxis);
            return [...(state.filter((axis: any) => axis.id != payload.id)), updatedAxis]
        default:
            throw new Error(`unexpected action ${type}`);
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
    const { type, payload } = action;
    switch (type) {
        case SeriesActionNames.add:
            return [...state, payload];
        case SeriesActionNames.toggleVisibility:
            return disableSeries(state, payload.index);
        default:
            throw new Error(`unexpected action ${action.type}`);
    }
}

export interface ContextMenuState {
    visibility: boolean;
    position: { x: number, y: number };
    source: any;
    menuItems: JSX.Element[];
}

enum ContextMenuActionNames {
    show = 'show',
    hide = 'hide'
}

interface ContextMenuAction {
    type: ContextMenuActionNames;
    payload: ContextMenuState;
}

function contextMenuReducer(state: ContextMenuState, action: ContextMenuAction) {
    switch (action.type) {
        case ContextMenuActionNames.show:
            return { visibility: true, ...action.payload };
        case ContextMenuActionNames.hide:
            return { visibility: false };
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

export interface ChartContext {
    dimensions: ChartDimensions;
    axes: ChartAxis[];
    series: rd3.Series[];
    dispatchSeriesAction: (action: SeriesAction) => void;
    dispatchAxesAction: (action: AxisAction) => void;
    dispatchContextMenuAction: (action: ContextMenuAction) => void;
    data?: Datum[];
}

interface ChartDimensions {
    width: number;
    height: number;
    margin: number;
}

export const emptyContextMenu = { visibility: false, source: null, menuItems: [], position: { x: 0, y: 0 } };
export const chartContext = React.createContext<ChartContext>({ axes: [], series: [] });
export const contextMenuContext = React.createContext<ContextMenuState>(emptyContextMenu)

const Chart: React.FunctionComponent<ChartProps> = (props) => {
    const { width, height, margin, data, axes } = props;
    const [chartAxes, dispatchAxesAction] = React.useReducer(axesReducer, []);
    const [chartSeries, dispatchSeriesAction] = React.useReducer(seriesReducer, []);
    const [contextMenu, dispatchContextMenuAction] = React.useReducer(contextMenuReducer, emptyContextMenu);

    const handleEscKey = (e: KeyboardEvent) => {
        if (e.keyCode === 27) {
            dispatchContextMenuAction({ type: ContextMenuActionNames.hide })
        }
    }

    React.useEffect(() => {
        document.addEventListener('keydown', handleEscKey, false);
        return () => document.removeEventListener('keydown', handleEscKey, false);
    })

    return (<div className="chart">
        <chartContext.Provider value={{
            dimensions: { width, height, margin },
            axes: chartAxes,
            series: chartSeries,
            data,
            dispatchAxesAction,
            dispatchSeriesAction,
            dispatchContextMenuAction,
        }}>
            <svg width={width + 2 * margin} height={height + 2 * margin} className="chart-svg">
                <g>
                    {
                        axes ? axes.map((axis, i) => {
                            const originalProps = axis.props;
                            return React.cloneElement(axis, { ...originalProps, key: i, index: i });
                        }) : null
                    }
                </g>
                {
                    props.children ? getArray(props.children).map((child: React.DetailedReactHTMLElement<any, HTMLElement>, i: number) => {
                        const originalProps = child.props;
                        return React.cloneElement(child, {
                            ...originalProps,
                            key: i,
                            index: i,
                            visible: getSeriesVisibity(i, chartSeries)
                        });
                    }) : null
                }
            </svg>
            <Legend
                chartSeries={chartSeries}
            />
            {
                contextMenu.visibility ? (<div className="chart-contextmenu" style={{ left: `${contextMenu.position.x}px`, top: `${contextMenu.position.y}px` }}>
                    {contextMenu.menuItems}
                </div>) : null
            }
        </chartContext.Provider>
    </div>);
}

export default Chart;