import * as React from 'react';
import d3, { event as currentEvent, select, extent } from 'd3';
import { AxisProps, getScale, getAxisPositionalProperties, getInjectedAxisProps, getValueList } from './Axis';
import './Axis.css';
import { chartContext, ChartAxis } from './Chart';
import PowerScaleSlider from './PowerScaleSlider';

const NumberAxis: React.FunctionComponent<AxisProps> = (props) => {
    const { dispatchAxesAction, dispatchContextMenuAction, dimensions, axes, data } = React.useContext(chartContext);

    const { position, valueSource, showGridLines } = props;
    const { index } = getInjectedAxisProps(props);
    const id = `${position}-${index}`;
    const existingAxis = axes.filter((axis: ChartAxis) => axis.id == id);
    let exponent = 1;
    if (existingAxis && Array.isArray(existingAxis) && existingAxis.length > 0) {
        exponent = existingAxis[0].exponent;
    }

    const axisRef = React.useRef(null);
    const axisGridlinesRef = React.useRef(null);
    const { translation, generator, start, end, perpendicularWidth } = getAxisPositionalProperties(position, dimensions);
    const { values, typeName: dataType } = getValueList(valueSource, data);

    const range = extent(values as number[]);
    const scale = getScale(dataType, range, start, end, exponent)
    const axisGenerator = generator(scale);
    const axisGridLineGenerator = generator(scale);
    React.useEffect(() => {
        dispatchAxesAction({ type: 'add', payload: { type: 'numberAxis', id, position, exponent, scaleBuild: { position, dataType, range, valueSource }, scale } });
        select(axisRef.current).call(axisGenerator);
        select(axisRef.current)
            .on("contextmenu", function (d, index) {
                dispatchContextMenuAction({ type: 'show', payload: { source: axisRef.current, position: { x: currentEvent.pageX, y: currentEvent.pageY }, menuItems: [(<PowerScaleSlider key={1} axisId={id} />)] } });
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