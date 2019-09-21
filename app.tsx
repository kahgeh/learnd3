import * as React from 'react'
import { render } from 'react-dom'
import './app.css';
import Chart from './chart/Chart'
import DateAxis from './chart/DateAxis';
import NumberAxis from './chart/NumberAxis';
import { getMayRainfall } from './data/rainfall';
import { AxisPosition } from './chart/Axis';

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
                <Chart width={640} height={480} margin={50} data={measurements}>
                    <DateAxis
                        position={AxisPosition.Bottom}
                        label="Day of month"
                        scaleBuild={{ valuesFromProperty: 'date' }}
                        format="%d %B" />
                    <NumberAxis
                        position={AxisPosition.Left}
                        label="Rainfal(mm)"
                        scaleBuild={{ valuesFromProperty: 'value' }} />
                </Chart>
            </div>
            <div className="chart-footer">

            </div>
        </div>
    </>);
}

render(<App />, document.getElementById('root'))