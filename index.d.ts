import { Numeric } from "d3";

interface ChartDimension {
    width: number;
    height: number;
    margin: number;
}

type RainFallMeasurement = { date: Date, value: number };