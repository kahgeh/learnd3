import * as React from 'react';
import { ValueType } from "..";

export type PointVisualGenerator = (index: number, x: number, y: number, color: string, size: number) => JSX.Element;

export interface PointValueSource {
    fixedSize?: number;
    values?: number[];
    valuesFromProperty?: string;
}

export interface Point {
    x: number;
    y: number;
}

export interface PointVisual {
    generator: PointVisualGenerator;
    size: PointValueSource;
}

export function generate(pointVisual: PointVisual, color: string, points: Point[], data?: Datum[]) {

    const { fixedSize } = pointVisual.size;
    let beads = []

    if (fixedSize) {
        let i = 0;
        for (const point of points) {
            beads.push(pointVisual.generator(i, point.x, point.y, color, fixedSize));
            i++;
        }
    }
    return beads;



}


export function circle(index: number, x: number, y: number, color: string, size: number) {
    return (<circle cx={x} cy={y} fill={color} r={size} />);
}