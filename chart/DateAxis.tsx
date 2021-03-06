import * as React from 'react';
import { select, timeFormat, extent } from 'd3';
import { getAxisPositionalProperties, AxisProps, getScale, getInjectedAxisProps, getValueList } from './Axis';
import defaults from '../defaults';
import { chartContext } from './Chart';
interface DateAxisProps {
    format?: string;
}

function getFormattedAxisGenerator(formatSpecification: string, generator: any, scale: any) {
    const formatDateToDayMonth = timeFormat(formatSpecification);

    return generator(scale)
        .tickFormat((d) => formatDateToDayMonth(d as Date));
}

const DateAxis: React.FunctionComponent<AxisProps & DateAxisProps> = (props) => {
    const { dispatchAxesAction, dimensions, data } = React.useContext(chartContext);

    const { position, valueSource, format } = props;
    const { index } = getInjectedAxisProps(props);
    const id = `${position}-${index}`;

    const axisRef = React.useRef(null);
    const { translation, generator: axisGenerator, start, end } = getAxisPositionalProperties(position, dimensions);
    const { values, typeName: dataType } = getValueList(valueSource, data);

    const range = extent(values as Date[]);
    const scale = getScale(dataType, range, start, end);
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