import * as React from 'react';
import { select, timeFormat } from 'd3';
import { getAxisPositionalProperties, AxisProps, getScale, getValidatedInjectedAxisProps, getValueType, getValues } from './Axis';
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
    const { position, valueSource, chart, data, format, dispatchAxesAction } = props;
    const injected = getValidatedInjectedAxisProps({ chart, data, dispatchAxesAction });
    const axisRef = React.useRef(null);
    const { translation, generator: axisGenerator, start, end } = getAxisPositionalProperties(position, injected.chart);
    const values = getValues(valueSource, injected.data);
    const dataType = getValueType(values[0]);

    const scale = getScale(dataType, values, start, end);
    let effectiveFormat = (format === null || format === undefined) ?
        defaults.DateAxis.format : format;

    const formattedAxisGenerator = getFormattedAxisGenerator(effectiveFormat, axisGenerator, scale);

    React.useEffect(() => {
        injected.dispatchAxesAction({ type: 'add', payload: { type: 'dateAxis', position, scaleBuild: { position, dataType, valueSource }, scale } });
        select(axisRef.current).call(formattedAxisGenerator);
    }, [injected.dispatchAxesAction, valueSource]);

    return (
        <g ref={axisRef} transform={translation} />
    );
}

export default DateAxis;