import * as React from 'react'
import { PureComponent } from "react";
import { getMayRainfall } from './data';
import { scaleTime, extent, scaleLinear, line, axisBottom, axisLeft, timeFormat } from "d3";

interface Props {
    width: number,
    height: number
}

export default class LineChart extends PureComponent<Props> {
    render() {
        const { width, height } = this.props;
        const margin = 50;

        const measurements = getMayRainfall().map(d => ({ date: new Date(Date.parse(d.date)), value: d.value }));

        const minMaxDates = extent(measurements, d => d.date);
        const xScale = scaleTime()
            .domain(minMaxDates as Date[])
            .range([0, width]);

        console.log(minMaxDates);
        const minMaxValues = extent(measurements, d => d.value);
        const yScale = scaleLinear()
            .domain(minMaxValues as number[])
            .range([height, 0]);

        console.log(minMaxValues);
        const formatDate = timeFormat("%d %B");
        const xAxis = axisBottom(xScale)
            .tickFormat((d) => formatDate(d as Date));
        const yAxis = axisLeft(yScale);

        const lineGenerator = line<{ date: Date; value: number }>();
        lineGenerator.x(d => xScale(d.date));
        lineGenerator.y(d => yScale(d.value))

        const linePath = lineGenerator(measurements);

        return (<svg width={width + 2 * margin} height={height + 2 * margin} style={{ backgroundColor: 'white' }}>
            <path d={linePath} fill="none" stroke="red" />
        </svg>);
    }
}