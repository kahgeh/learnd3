import * as React from 'react';
import { select, extent } from 'd3';
import { AxisProps, getScale, getAxisPositionalProperties, getValidatedInjectedAxisProps, getValueTypeName, getValues } from './Axis';

const NumberAxis: React.FunctionComponent<AxisProps> = (props) => {

    const { position, valueSource, chart, data, dispatchAxesAction } = props;
    const injected = getValidatedInjectedAxisProps({ chart, data, dispatchAxesAction });
    const axisRef = React.useRef(null);
    const { translation, generator, start, end } = getAxisPositionalProperties(position, injected.chart);
    const values = getValues(valueSource, injected.data);
    const dataType = getValueTypeName(values[0]);
    const range = extent(values);
    const scale = getScale(dataType, range, start, end)

    const axisGenerator = generator(scale);

    React.useEffect(() => {
        injected.dispatchAxesAction({ type: 'add', payload: { type: 'numberAxis', position, scaleBuild: { position, dataType, range, valueSource }, scale } });
        select(axisRef.current).call(axisGenerator);
    }, [injected.dispatchAxesAction, valueSource]);

    return (
        <g ref={axisRef} transform={translation} />
    );
}

export default NumberAxis;