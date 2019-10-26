import * as React from 'react';
import { render } from 'react-dom'
import './app.css';
import LineBarChart from './LineBarChart';

enum ChartTypes {
    LineAndBar = "Line and bar chart",
    Annulus = "Annulus"
}

const getChart = (type: ChartTypes) => {
    if (type === ChartTypes.LineAndBar) {
        return (<LineBarChart />)
    }
}
const App: React.FunctionComponent = () => {
    const [selectedChart, setState] = React.useState(ChartTypes.LineAndBar)

    return (<>
        <div className='drawer-container'>
            <div className="drawer-item">
                <div className="button">{selectedChart}</div>
            </div>
            <div className="drawer-item">
                <div className="button">Annulus</div>
            </div>
        </div>
        <div className="content-container">
            <div className="chart-title">
                {selectedChart}
            </div>
            <div className="chart-container">
                {
                    getChart(selectedChart)
                }
            </div>
            <div className="chart-footer">
            </div>
        </div>
    </>);
}

render(<App />, document.getElementById('root'))