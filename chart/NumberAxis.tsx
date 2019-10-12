import * as React from 'react';
import { select, extent } from 'd3';
import { AxisProps, getScale, getAxisPositionalProperties, getValidatedInjectedAxisProps, getValueTypeName, getValues } from './Axis';
import './Axis.css';

const NumberAxis: React.FunctionComponent<AxisProps> = (props) => {

    const { position, valueSource, chart, data, dispatchAxesAction, showGridLines } = props;
    const injected = getValidatedInjectedAxisProps({ chart, dispatchAxesAction });
    const axisRef = React.useRef(null);
    const axisGridlinesRef = React.useRef(null);
    const { translation, generator, start, end, perpendicularWidth } = getAxisPositionalProperties(position, injected.chart);
    const values = getValues(valueSource, data);
    const dataType = getValueTypeName(values[0]);
    const range = extent(values);
    const scale = getScale(dataType, range, start, end)

    const axisGenerator = generator(scale);
    const axisGridLineGenerator = generator(scale);

    React.useEffect(() => {
        injected.dispatchAxesAction({ type: 'add', payload: { type: 'numberAxis', position, scaleBuild: { position, dataType, range, valueSource }, scale } });
        select(axisRef.current).call(axisGenerator);
        if (showGridLines) {
            const gridAxisGenerator = axisGridLineGenerator
                .tickValues(axisGenerator.scale().ticks().slice(1))
                .tickFormat("")
                .tickSize(perpendicularWidth)
                .tickSizeOuter(0);
            select(axisGridlinesRef.current).call(axisGridLineGenerator);
        }

    }, [injected.dispatchAxesAction, valueSource]);

    return (
        <>
            <g className="gridlines" ref={axisGridlinesRef} transform={translation} />
            <g ref={axisRef} transform={translation} />
        </>
    );
}

export default NumberAxis;