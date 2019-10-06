import * as React from 'react';
import './Chart.css';
import { AxisPosition, ScaleBuild } from './Axis';
import { rd3 } from '.';
import Legend from './Legend';

interface ChartProps {
    width: number;
    height: number;
    margin: number;
    data: Datum[];
    axes?: JSX.Element[];
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
    hide = 'hide'
}

export type SeriesAction = {
    type: SeriesActionNames;
    payload: any;
}

function seriesReducer(state: rd3.Series[], action: SeriesAction) {
    switch (action.type) {
        case 'add':
            return [...state, action.payload];
        case 'hide':

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
    const [series, dispatchSeriesAction] = React.useReducer(seriesReducer, []);

    return (<div className="chart">
        <svg width={width + 2 * margin} height={height + 2 * margin} className="chart-svg">
            {
                props.children ? getArray(props.children).map((child: React.DetailedReactHTMLElement<any, HTMLElement>, i: number) => {
                    const originalProps = child.props;
                    return React.cloneElement(child, { ...originalProps, key: i, chart: { height, width, margin }, data, index: i, chartAxes, dispatchSeriesAction });
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
        <Legend chartSeries={series} />
    </div>);
}

export default Chart;