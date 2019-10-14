import * as React from 'react';
import { event as currentEvent, select, extent } from 'd3';
import { AxisProps, getScale, getAxisPositionalProperties, getInjectedAxisProps, getValueTypeName, getValues } from './Axis';
import './Axis.css';

const NumberAxis: React.FunctionComponent<AxisProps> = (props) => {
    const { position, valueSource, data, showGridLines } = props;
    const { chart, dispatchAxesAction, dispatchContextMenuAction, exponent, index } = getInjectedAxisProps(props);
    const axisRef = React.useRef(null);
    const axisGridlinesRef = React.useRef(null);
    const { translation, generator, start, end, perpendicularWidth } = getAxisPositionalProperties(position, chart);
    const values = getValues(valueSource, data);
    const dataType = getValueTypeName(values[0]);
    const range = extent(values);
    const scale = getScale(dataType, range, start, end, exponent)
    const id = `${position}-${index}`;
    const axisGenerator = generator(scale);
    const axisGridLineGenerator = generator(scale);

    React.useEffect(() => {
        dispatchAxesAction({ type: 'add', payload: { type: 'numberAxis', id, position, scaleBuild: { position, dataType, range, valueSource }, scale } });
        select(axisRef.current).call(axisGenerator);
        select(axisRef.current)
            .on("contextmenu", function (d, index) {
                console.log(`${axisRef.current} ${d}`);
                dispatchContextMenuAction({ type: 'show', payload: [] })
                currentEvent.preventDefault();
            })
        if (showGridLines) {
            const gridAxisGenerator = axisGridLineGenerator
                .tickValues(axisGenerator.scale().ticks().slice(1))
                .tickFormat("")
                .tickSize(perpendicularWidth)
                .tickSizeOuter(0);
            select(axisGridlinesRef.current).call(axisGridLineGenerator);
        }

    }, [dispatchAxesAction, valueSource, exponent]);

    return (
        <>
            <g className="gridlines" ref={axisGridlinesRef} transform={translation} />
            <g ref={axisRef} transform={translation} id={id} />
        </>
    );
}

export default NumberAxis;