import * as React from 'react';
import './Chart.css';
import { ScaleBuild, AxisPosition } from './Axis';
import { ScaleContinuousNumeric } from 'd3';
import { InjectedChartProps, ChartDimension, ValueSource } from '.';

interface ChartProps {
    width: number;
    height: number;
    margin: number;
    data: Datum[];
    axes: JSX.Element[];
}

export interface ChartAxis {
    valueSource: ValueSource;
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

function getArray(obj: any) {
    if (obj === null || obj == undefined) {
        return obj;
    }
    return (Array.isArray(obj)) ? obj : [obj];
}

export function getValidatedInjectedProps(injectedProps: InjectedChartProps): { chart: ChartDimension; data: Datum[] } {
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

    console.log("***chart function component called***");
    console.log(chartAxes);
    console.log("***********");

    return (<svg width={width + 2 * margin} height={height + 2 * margin} className="chart-svg">
        {
            props.children ? getArray(props.children).map((child, i) => {
                const originalProps = child.props;
                return React.cloneElement(child, { ...originalProps, key: i, chart: { height, width, margin }, data, chartAxes });
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
    </svg>);
}

export default Chart;