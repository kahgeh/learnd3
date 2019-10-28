import * as React from 'react';
import d3, { arc, pie, scaleOrdinal, schemeBlues, schemeAccent, scaleLinear } from 'd3';
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

function getAnnulusPath(categories: rd3.ValueList, radius: number, innerRadius: number, colorScheme: string[]): { color: string; path: string }[] {
    const arcs = pie()(categories.values as number[]);
    var color = scaleOrdinal(colorScheme)
    const all: { color: string; path: string }[] = []
    for (const a of arcs) {
        const arcd = arc()
            .innerRadius(innerRadius)
            .outerRadius(radius)
            .startAngle(a.startAngle)
            .padAngle(0.02)
            .endAngle(a.endAngle);

        all.push({ color: color(a.startAngle), path: arcd() });

    }
    return all;
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

    const paths = getAnnulusPath(valueList, radius, innerRadius, colorScheme);
    const total = valueList.values.reduce((prev, cur) => (prev as number) + (cur as number));
    return (<g transform={`translate(${scaleX(radius)},${scaleY(radius)})`}>
        {
            paths.map(({ color, path }, i) => <path key={i} d={path} fill={color} stroke={color} />)
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