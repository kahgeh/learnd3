import * as React from 'react';
import d3, { arc, pie, scaleOrdinal, schemeBlues, schemeAccent, scaleLinear, selectAll, select } from 'd3';
import { ValueType } from '..';
import { chartContext } from './Chart';
import { rd3 } from '.';
import { getValueList } from './Axis';

export interface AnnulusProps {
    categories: rd3.ValueSource;
    totalText?: string;
    radius: number;
    innerRadius: number;
    colorScheme: any;
}

type CategoryArc = {
    color: string;
    path: string;
    center: [number, number];
    pulledCenter: [number, number];
    value: number;
    textStart: number;
};

function getAnnulusPath(categories: rd3.ValueList, radius: number, innerRadius: number, labelCalloutLength?: number, colorScheme: string[]): CategoryArc[] {
    const arcs = pie()(categories.values as number[]);
    var color = scaleOrdinal(colorScheme)
    const all: CategoryArc[] = []
    const values = categories.values;
    let i = 0
    for (const a of arcs) {
        const arcd = arc()
            .innerRadius(innerRadius)
            .outerRadius(radius)
            .startAngle(a.startAngle)
            .padAngle(0.02)
            .endAngle(a.endAngle);

        const centerAngle = (a.startAngle + a.endAngle) / 2;
        const center = arcd.centroid();
        let pulledCenter = [...center] as [number, number];

        if (labelCalloutLength) {
            const labelArc = arc()
                .innerRadius(radius)
                .outerRadius(radius + labelCalloutLength)
                .startAngle(a.startAngle)
                .padAngle(0.02)
                .endAngle(a.endAngle);

            pulledCenter = labelArc.centroid();

        }

        all.push({
            color: color(a.startAngle),
            path: arcd(),
            center,
            pulledCenter,
            value: values[i] as number,
            textStart: calculateTextStart(pulledCenter)
        });
        i++;

    }
    return all;
}


function calculateX2(data: CategoryArc) {
    //console.log(`${selection.getComputedTextLength()} ${paths[Number(selection.getAttribute("dataindex"))].pulledCenter} `);
    const factor = 1;//Math.abs(data.pulledCenter[1] / 290)
    const length = 25;
    return factor * ((data.pulledCenter[0] < 0) ? -length : length);
}


function calculateTextStart(pulledCenter: [number, number]) {
    const factor = 1;//Math.abs(data.pulledCenter[1] / 290)
    const length = 25;
    return factor * ((pulledCenter[0] < 0) ? pulledCenter[0] - length : pulledCenter[0] + length);
}

function createAdjustTextHorizontalPositionUsingTextWidth(paths) {
    const localPaths = paths;
    const padding = 3;
    return function (d, i) {
        return (localPaths[i].pulledCenter[0] < 0) ? (-1 * (select(this).node().getComputedTextLength() + padding)) : padding;
    }
}

const Annulus: React.FunctionComponent<AnnulusProps> = ({ categories, totalText, colorScheme, radius, innerRadius }) => {
    const { dimensions, data } = React.useContext(chartContext);
    const { height, width, margin } = dimensions;
    const valueList = getValueList(categories, data);

    const scaleX = scaleLinear()
        .domain([0, 2 * radius])
        .range([margin, margin + width]);

    const scaleY = scaleLinear()
        .domain([0, 2 * radius])
        .range([margin, margin + height]);

    const paths = getAnnulusPath(valueList, radius, innerRadius, 50, colorScheme);

    const adjustTextHorizontalPositionUsingTextWidth = createAdjustTextHorizontalPositionUsingTextWidth(paths)

    React.useEffect(() => {
        selectAll("[id^=callouthoriz]")
            .attr("y1", "0")
            .attr("y2", "0")
            .attr("x1", "0")
            .attr("x2", (s, i) => calculateX2(paths[i]));

        selectAll("[id^=arclabel-]")
            .attr("x", adjustTextHorizontalPositionUsingTextWidth)
    });
    console.log(paths);
    const total = valueList.values.reduce((prev, cur) => (prev as number) + (cur as number));
    return (<g transform={`translate(${scaleX(radius)},${scaleY(radius)})`}>
        {
            paths.map(({ color, path }, i) => <path key={`arc-${i}`} d={path} fill={color} stroke={color} />)
        }
        {
            paths.map(({ value, pulledCenter, textStart }, i) => <text id={`arclabel-${i}`} dataindex={i} key={`arclabel-${i}`} transform={`translate(${textStart},${pulledCenter[1]})`} dominantBaseline="middle" stroke="black">{value}</text>)
        }
        {
            paths.map(({ value, pulledCenter }, i) => <line id={`callouthoriz-${i}`} dataindex={i} key={`callouthoriz-${i}`} transform={`translate(${pulledCenter})`} stroke="black" />)
        }
        {
            paths.map(({ value, center, pulledCenter }, i) => <line key={`callout-${i}`} x1={center[0]} x2={pulledCenter[0]} y1={center[1]} y2={pulledCenter[1]} stroke="black" />)
        }
        {
            totalText ? (<>
                <circle dx={radius} dy={radius} r={innerRadius - 10} fill="beige" stroke="lightgray" strokeWidth="5"></circle>
                <text textAnchor="middle" stroke="black" strokeWidth="2px" fontSize="3em">
                    <tspan>{total}</tspan>
                </text>
                <text textAnchor="middle" stroke="black" strokeWidth="0.5px">
                    <tspan dy="1.5em">Total cuppas</tspan>
                </text>
            </>) : null
        }
    </g>)
}

export default Annulus;