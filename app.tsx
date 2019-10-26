import * as React from 'react'
import { render } from 'react-dom'
import './app.css';
import Chart from './chart/Chart'
import DateAxis from './chart/DateAxis';
import NumberAxis from './chart/NumberAxis';
import { getMayRainfall } from './data/rainfall';
import { AxisPosition } from './chart/Axis';
import Line from './chart/Line';
import { circle, rectangle } from './chart/PointVisual';
import { curveMonotoneX, curveStep } from 'd3';
import Slider, { SliderPosition } from './Slider';
import Bar from './chart/Bar';

const App: React.FunctionComponent = () => {
    const measurements = getMayRainfall().map(d => ({ date: new Date(Date.parse(d.date)), value: d.value }));

    return (<>
        <div className='drawer-container'>
            <div className="drawer-item">Line chart</div>
            <Slider position={SliderPosition.Vertical} range={[0.1, 0, 10]} size={200} />
        </div>
        <div className="content-container">
            <div className="chart-title">
                Line Chart
            </div>
            <div className="chart-container">
                {<Chart width={640} height={480} margin={50} data={measurements}
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
                }
            </div>
            <div className="chart-footer">
            </div>
        </div>
    </>);
}

render(<App />, document.getElementById('root'))