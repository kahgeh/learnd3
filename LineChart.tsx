import * as React from 'react';
import { getMayRainfall } from './data';
import { scaleTime, extent, scaleLinear, line, axisBottom, axisLeft, timeFormat, select, Axis, ScaleLinear, ScaleTime } from "d3";
import './LineChart.css';
import DateAxis from './DateAxis';

interface LineChartProps {
    width: number,
    height: number,
    margin: number;
}

type Measurement = {
    date: Date;
    value: number;
};

function getXScale(
    measurements: Measurement[],
    margin: number,
    width: number) {
    const minMaxDates = extent(measurements, d => d.date);
    return scaleTime()
        .domain(minMaxDates as Date[])
        .range([margin, margin + width]);
}


function getYScale(measurements: Measurement[],
    margin: number,
    height: number) {
    const minMaxValues = extent(measurements, d => d.value);
    return scaleLinear()
        .domain(minMaxValues as number[])
        .range([margin + height, margin]);
}

function getXAxisGenerator(xScale: ScaleTime<number, number>) {
    const formatDateToDayMonth = timeFormat("%d %B");
    return axisBottom(xScale)
        .tickFormat((d) => formatDateToDayMonth(d as Date));
}

function getLinePath(
    measurements: Measurement[],
    xScale: ScaleTime<number, number>,
    yScale: ScaleLinear<number, number>) {
    const lineGenerator = line<{ date: Date; value: number }>();
    lineGenerator.x(d => xScale(d.date));
    lineGenerator.y(d => yScale(d.value))

    return lineGenerator(measurements) as string;
}

const LineChart: React.FunctionComponent<LineChartProps> = (props) => {
    const [{ width, height, margin }, _] = React.useState(props);

    const yAxisRef = React.useRef(null);
    const measurements = getMayRainfall().map(d => ({ date: new Date(Date.parse(d.date)), value: d.value }));
    const xScale = getXScale(measurements, margin, width)
    const yScale = getYScale(measurements, margin, height)
    const linePath = getLinePath(measurements, xScale, yScale);
    const xAxisGenerator = getXAxisGenerator(xScale);
    const yAxisGenerator = axisLeft(yScale);
    // React.useEffect(() => {
    //     select(xAxisRef.current).call(xAxisGenerator);
    //     select(yAxisRef.current).call(yAxisGenerator);
    // });
    const children = Array.isArray(props.children) ? props.children : [props.children];
    return (<svg width={width + 2 * margin} height={height + 2 * margin} className="chart-svg">
        <path d={linePath} fill="none" stroke="red" />
        <g>
            {
                children.map((child, i) => {
                    const originalProps = child.props;
                    if (child.type.name == 'DateAxis') {
                        return React.cloneElement(child, { ...originalProps, key: i, chart: { height, width, margin }, scale: xScale });
                    }
                })
            }
            {/* <g ref={xAxisRef} transform={`translate(0,${height + margin})`} />
            <g ref={yAxisRef} transform={`translate(${margin},0)`} /> */}
        </g>
    </svg>);
}

export default LineChart;