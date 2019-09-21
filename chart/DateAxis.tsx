import * as React from 'react';
import { select, timeFormat } from 'd3';
import { getAxisPositionalProperties, AxisProps, getScale, getValidatedInjectedProps, getFirstValueType } from './Axis';
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
    const [{ position, scaleBuild, chart, data, format }, _] = React.useState(props);
    const validated = getValidatedInjectedProps({ chart, data });
    const axisRef = React.useRef(null);
    const { translation, generator: axisGenerator, start, end } = getAxisPositionalProperties(position, validated.chart);
    const dataType = getFirstValueType(validated.data, scaleBuild.valuesFromProperty);

    const scale = getScale(dataType, scaleBuild, validated.data, start, end);
    let effectiveFormat = (format === null || format === undefined) ?
        defaults.DateAxis.format : format;

    const formattedAxisGenerator = getFormattedAxisGenerator(effectiveFormat, axisGenerator, scale);

    React.useEffect(() => {
        select(axisRef.current).call(formattedAxisGenerator);
    });

    return (
        <g ref={axisRef} transform={translation} />
    );
}

export default DateAxis;