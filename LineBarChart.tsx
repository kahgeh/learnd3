import * as React from 'react';
import MainLayout from './MainLayout';
import Chart from "./chart/Chart"
import DateAxis from "./chart/DateAxis"
import { AxisPosition } from "./chart/Axis"
import NumberAxis from "./chart/NumberAxis"
import Bar from "./chart/Bar"
import Line from "./chart/Line"
import { curveStep, curveMonotoneX } from "d3"
import { rectangle, circle } from "./chart/PointVisual"
import { getMayRainfall } from "./data/rainfall"

const LineBarChart: React.FunctionComponent = (props) => {
    const measurements = getMayRainfall().map(d => ({ date: new Date(Date.parse(d.date)), value: d.value }));

    return (
        <MainLayout>
            <Chart width={640} height={480} margin={50} data={measurements}
                axes={
                    [(<DateAxis
                        position={AxisPosition.Bottom}
                        label="Day of month"
                        valueSource={{ valuesFromProperty: 'date' }}
                        format="%d %B" />),
                    (<NumberAxis
                        position={AxisPosition.Left}
                        label="Rainfall(mm)"
                        showGridLines={true}
                        valueSource={{ valuesFromProperty: 'value' }} />),
                    (<NumberAxis
                        name="redaxis"
                        position={AxisPosition.Right}
                        label="Arbitray"
                        valueSource={{ values: [0, 40] }} />)]}
            >
                <Bar color="beige"
                    x={{ values: [1, 2, 3, 4] }}
                    y={{ values: [40, 30, 20, 10] }}
                />
                <Line color="red"
                    x={{ values: [1, 2, 3, 4] }}
                    y={{ values: [10, 20, 30, 40] }}
                    pointVisual={{ generator: rectangle, size: { fixedSize: 5 } }}
                    curve={curveStep} />
                <Line color="green"
                    x={{ valuesFromProperty: 'date' }}
                    y={{ valuesFromProperty: 'value' }}
                    pointVisual={{ generator: circle, toolTipTemplate: "value:{y}\ndate:{x}", size: { fixedSize: 5 } }}
                    curve={curveMonotoneX} />
                <Line color="blue"
                    x={{ values: [1, 2, 3, 4] }}
                    y={{ values: [40, 30, 20, 10] }}
                    pointVisual={{ generator: rectangle, size: { fixedSize: 5 } }}
                    curve={curveStep} />
            </Chart>
        </MainLayout>
    )
}

export default LineBarChart;