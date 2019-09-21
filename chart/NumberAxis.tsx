import * as React from 'react';
import { select } from 'd3';
import { AxisProps, getScale, getAxisPositionalProperties, getValidatedInjectedProps, getFirstValueType } from './Axis';

const NumberAxis: React.FunctionComponent<AxisProps> = (props) => {

    const [{ position, scaleBuild, chart, data }, _] = React.useState(props);
    const validated = getValidatedInjectedProps({ chart, data });
    const axisRef = React.useRef(null);
    const { translation, generator, start, end } = getAxisPositionalProperties(position, validated.chart);
    const dataType = getFirstValueType(validated.data, scaleBuild.valuesFromProperty);
    const scale = getScale(dataType, scaleBuild, validated.data, start, end)

    const axisGenerator = generator(scale);

    React.useEffect(() => {
        select(axisRef.current).call(axisGenerator);
    });

    return (
        <g ref={axisRef} transform={translation} />
    );
}

export default NumberAxis;