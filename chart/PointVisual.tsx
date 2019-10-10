import * as React from 'react';
import { ValueType } from "..";

export type PointVisualGenerator = (index: number, x: number, y: number, color: string, size: number, toolTip?: string) => JSX.Element;

export interface PointValueSource {
    fixedSize?: number;
    values?: number[];
    valuesFromProperty?: string;
}

export interface Point {
    x: number;
    y: number;
    toolTip?: string;
}

export interface PointVisual {
    generator: PointVisualGenerator;
    size: PointValueSource;
    toolTipTemplate?: string;
}

export function generate(pointVisual: PointVisual, color: string, points: Point[], data?: Datum[]) {
    const { size } = pointVisual;
    const { fixedSize } = size;
    let beads = []

    if (fixedSize) {
        let i = 0;
        for (const point of points) {
            beads.push(pointVisual.generator(i, point.x, point.y, color, fixedSize, point.toolTip));
            i++;
        }
    }
    return beads;
}

export function renderToolTip(template: string, value: any) {
    "use strict";
    var str = template;
    for (const key in value) {
        str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), value[key]);
    }

    return str;
};

export function rectangle(index: number, x: number, y: number, color: string, size: number, toolTip?: string) {
    if (toolTip) {
        return (<rect key={index} x={x - size} y={y - size} width={size * 2} height={size * 2} fill={color}>
            <title>{toolTip}</title>
        </rect>);
    }
    return (<rect key={index} x={x - size} y={y - size} width={size * 2} height={size * 2} fill={color} />);
}

export function circle(index: number, x: number, y: number, color: string, size: number, toolTip?: string) {
    if (toolTip) {
        return (<circle key={index} cx={x} cy={y} fill={color} r={size} >
            <title>{toolTip}</title>
        </circle>);
    }
    return (<circle key={index} cx={x} cy={y} fill={color} r={size} />);
}