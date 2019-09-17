import * as React from 'react'
import { Component } from 'react'
import { render } from 'react-dom'
import './app.css';
import LineChart from './LineChart'
import DateAxis, { AxisPosition } from './DateAxis';

class App extends Component {
    render() {
        return (<>
            <div className='drawer-container'>
                <div className="drawer-item">Line chart</div>
            </div>
            <div className="content-container">
                <div className="chart-title">
                    Line Chart
                </div>
                <div className="chart-container">
                    <LineChart width={640} height={480} margin={50}>
                        <DateAxis position={AxisPosition.Bottom} label="Day of month" />
                    </LineChart>
                </div>
                <div className="chart-footer">

                </div>
            </div>
        </>);
    }
}

render(<App />, document.getElementById('root'))