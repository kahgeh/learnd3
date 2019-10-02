import * as React from 'react'
import { render } from 'react-dom'
import './app.css';
import Chart from './chart/Chart'
import DateAxis from './chart/DateAxis';
import NumberAxis from './chart/NumberAxis';
import { getMayRainfall } from './data/rainfall';
import { AxisPosition } from './chart/Axis';
import Line from './chart/Line';

const App: React.FunctionComponent = () => {
    const measurements = getMayRainfall().map(d => ({ date: new Date(Date.parse(d.date)), value: d.value }));
    return (<>
        <div className='drawer-container'>
            <div className="drawer-item">Line chart</div>
        </div>
        <div className="content-container">
            <div className="chart-title">
                Line Chart
            </div>
            <div className="chart-container">
                <Chart width={640} height={480} margin={50} data={measurements}
                    axes={
                        [(<DateAxis
                            position={AxisPosition.Bottom}
                            label="Day of month"
                            valueSource={{ valuesFromProperty: 'date' }}
                            format="%d %B" />),
                        (<NumberAxis
                            position={AxisPosition.Left}
                            label="Rainfal(mm)"
                            valueSource={{ valuesFromProperty: 'value' }} />),
                        (<NumberAxis
                            name="redaxis"
                            position={AxisPosition.Right}
                            label="Arbitray"
                            valueSource={{ values: [0, 40] }} />)]}
                >
                    <Line color="green"
                        x={{ valuesFromProperty: 'date' }}
                        y={{ valuesFromProperty: 'value' }} />
                    <Line color="red"
                        x={{ values: [1, 2, 3, 4] }}
                        y={{ values: [10, 20, 30, 40] }} />
                </Chart>
            </div>
            <div className="chart-footer">

            </div>
        </div>
    </>);
}

render(<App />, document.getElementById('root'))