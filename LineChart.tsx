import * as React from 'react'
import { getMayRainfall } from './data';
import { scaleTime, extent, scaleLinear, line, axisBottom, axisLeft, timeFormat, select, Axis } from "d3";
import './LineChart.css';

interface LineChartProps {
    width: number,
    height: number,
    margin: number;
}

interface LineChartState {
    linePath: string;
    xAxis: Axis<number | Date | { valueOf(): number; }>;
    yAxis: Axis<number | Date | { valueOf(): number; }>;
}

export default class LineChart extends React.Component<LineChartProps, LineChartState> {

    componentDidMount() {
        const { width, height, margin } = this.props;

        const measurements = getMayRainfall().map(d => ({ date: new Date(Date.parse(d.date)), value: d.value }));

        const minMaxDates = extent(measurements, d => d.date);
        const xScale = scaleTime()
            .domain(minMaxDates as Date[])
            .range([margin, margin + width]);

        const minMaxValues = extent(measurements, d => d.value);
        const yScale = scaleLinear()
            .domain(minMaxValues as number[])
            .range([margin + height, margin]);

        const formatDate = timeFormat("%d %B");
        const xAxis = axisBottom(xScale)
            .tickFormat((d) => formatDate(d as Date));
        const yAxis = axisLeft(yScale);

        const lineGenerator = line<{ date: Date; value: number }>();
        lineGenerator.x(d => xScale(d.date));
        lineGenerator.y(d => yScale(d.value))

        const linePath = lineGenerator(measurements) as string;

        this.setState({ linePath, xAxis, yAxis });
    }

    componentDidUpdate() {
        const { _, xAxis, yAxis } = this.state;
        select(this.refs.xAxis).call(xAxis);
        select(this.refs.yAxis).call(yAxis);
    }

    render() {
        if (this.state === null) {
            return null;
        }
        const { width, height, margin } = this.props;
        const { linePath, _, _ } = this.state;

        return (<svg width={width + 2 * margin} height={height + 2 * margin} className="chart-svg">
            <path d={linePath} fill="none" stroke="red" />
            <g>
                <g ref="xAxis" transform={`translate(0,${height + margin})`} />
                <g ref="yAxis" transform={`translate(${margin},0)`} />
            </g>
        </svg>);
    }
}