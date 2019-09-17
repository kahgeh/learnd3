import * as React from 'react';
import { ScaleTime, axisBottom, axisLeft, timeFormat, Axis, AxisDomain, AxisScale, select } from 'd3';
import { ChartDimension } from '.';

export enum AxisPosition {
    Left = "Left",
    Bottom = "Bottom"
}

interface DateAxisProps {
    position: AxisPosition;
    label: string;
    chart?: ChartDimension;
    scale?: ScaleTime<number, number>
}

function getAxisGenerator(generator: AxisScale<ScaleTime<Date, Date>>, scale: ScaleTime<Date, Date>) {

    const formatDateToDayMonth = timeFormat("%d %B");

    return generator(scale)
        .tickFormat((d) => formatDateToDayMonth(d as Date));
}

function getAxisPositionalProperties(position: AxisPosition, chart: ChartDimension) {
    if (position === AxisPosition.Bottom) {
        const start = chart.height + chart.margin;
        return { translation: `translate(0,${start})`, generator: axisBottom, start };
    }

    if (position === AxisPosition.Left) {
        const start = chart.margin;
        return { translation: `translate(${start},0)`, generator: axisLeft };
    }
}
const DateAxis: React.FunctionComponent<DateAxisProps> = (props) => {
    const [{ position, label, chart, scale }, _] = React.useState(props);

    const axisRef = React.useRef(null);
    const { translation, generator, _ } = getAxisPositionalProperties(position, chart);
    const axisGenerator = getAxisGenerator(generator, scale);

    React.useEffect(() => {
        select(axisRef.current).call(axisGenerator);
    });

    return (
        <g ref={axisRef} transform={translation} />
    );
}

export default DateAxis;