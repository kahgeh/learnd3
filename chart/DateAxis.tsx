import * as React from 'react';
import { select, timeFormat, extent } from 'd3';
import { getAxisPositionalProperties, AxisProps, getScale, getInjectedAxisProps, getValueTypeName, getValues } from './Axis';
import defaults from '../defaults';
interface DateAxisProps {
    format?: string;
}

function getFormattedAxisGenerator(formatSpecification: string, generator: any, scale: any) {
    const formatDateToDayMonth = timeFormat(formatSpecification);

    return generator(scale)
        .tickFormat((d) => formatDateToDayMonth(d as Date));
}

const DateAxis: React.FunctionComponent<AxisProps & DateAxisProps> = (props) => {
    const { position, valueSource, data, format } = props;
    const { chart, dispatchAxesAction, index } = getInjectedAxisProps(props);
    const axisRef = React.useRef(null);
    const { translation, generator: axisGenerator, start, end } = getAxisPositionalProperties(position, chart);
    const values = getValues(valueSource, data);
    const dataType = getValueTypeName(values[0]);
    const range = extent(values);
    const scale = getScale(dataType, range, start, end);
    const id = `${position}-${index}`;
    let effectiveFormat = (format === null || format === undefined) ?
        defaults.DateAxis.format : format;

    const formattedAxisGenerator = getFormattedAxisGenerator(effectiveFormat, axisGenerator, scale);

    React.useEffect(() => {
        dispatchAxesAction({ type: 'add', payload: { type: 'dateAxis', id, position, scaleBuild: { position, dataType, range, valueSource }, scale } });
        select(axisRef.current).call(formattedAxisGenerator);
    }, [dispatchAxesAction, valueSource]);

    return (
        <g ref={axisRef} transform={translation} id={id} />
    );
}

export default DateAxis;