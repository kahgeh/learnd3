import * as React from 'react';
import { getValueList, getContinuousValuesScale, AxisPosition, getValueTypeName } from './Axis';
import { rd3 } from '.';
import { scaleOrdinal, selectAll, select, interpolateTransformSvg, easeLinear, easeBounceIn, easeCubic, easeElastic, easeBounceInOut, easeExpIn, easeExpOut } from 'd3';
import { chartContext, SeriesActionNames, ValueTypeName } from './Chart';
import { ValueType } from '..';

interface BubbleProps extends rd3.InjectedChartProps {
    size: rd3.ValueSource;
    x?: rd3.ValueSource;
    y?: rd3.ValueSource;
    colorScheme: any;
    transitionDuration?: number;
    name?: string;
    index?: number;
}

function getSeriesName(props: BubbleProps) {
    const { index, y, name } = props;

    if (name) {
        return name;
    }

    if (y && y.valuesFromProperty) {
        return y.valuesFromProperty;
    }

    return `series-${index}`
}

function generateDefaultValueList(count: number): rd3.ValueList {
    const generatedValues = []
    for (let i = 0; i < count; i++) {
        generatedValues.push(i + 1);
    }

    return {
        values: generatedValues,
        typeName: ValueTypeName.number
    }
}

const Bubble: React.FunctionComponent<BubbleProps> = (props) => {
    const { size, colorScheme, x, y, transitionDuration, index } = props;
    const { axes, dimensions, data, dispatchSeriesAction } = React.useContext(chartContext);

    const sizeList = getValueList(size, data);
    let xList = generateDefaultValueList(sizeList.values.length);
    let yList = xList;

    let xBuild = {};
    let yBuild = {};
    if (x && y) {
        xList = getValueList(x, data);
        yList = getValueList(y, data);
    }

    const xScale = getContinuousValuesScale(dimensions, [AxisPosition.Bottom], xList, axes);
    xBuild = { ...xList, scale: xScale };
    const yScale = getContinuousValuesScale(dimensions, [AxisPosition.Left, AxisPosition.Right], yList, axes);
    yBuild = { ...yList, scale: yScale };

    const color = scaleOrdinal(colorScheme);
    const seriesName = getSeriesName(props);
    React.useEffect(() => {
        dispatchSeriesAction({ type: SeriesActionNames.add, payload: { color, seriesName, index, xBuild, yBuild } });
    }, [dispatchSeriesAction, seriesName]);

    React.useEffect(() => {
        selectAll("[id^=bubble-]")
            .each(
                function (_, i) {
                    if (transitionDuration) {
                        const current = `translate(${xScale(xList.values[i])},${yScale(yList.values[i])})`
                        const previous = select(this)
                            .attr('transform');

                        select(this)
                            .transition()
                            .duration(transitionDuration / 4)
                            .ease(easeExpOut)
                            .attrTween('transform', function () {
                                return interpolateTransformSvg(previous, current)
                            })
                            .select('circle')
                            .transition()
                            .delay(transitionDuration / 2)
                            .duration(transitionDuration / 4)
                            .attr("r", sizeList.values[i] / 2);
                        return;
                    }
                    select(this)
                        .select('circle')
                        .attr("r", sizeList.values[i] / 2);
                }
            )
    }, [sizeList]);

    return (<>
        {
            sizeList.values.map((value, index) => (
                <g key={index} id={`bubble-${index}`}>
                    <circle fill={color(index)} />
                </g>))
        }
    </>);
}
export default Bubble; 