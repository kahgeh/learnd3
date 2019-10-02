declare interface Datum {
    [key: string]: string | number | Date;
}

declare type RainFallMeasurement = { date: Date, value: number };