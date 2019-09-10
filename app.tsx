import * as React from 'react'
import { Component } from 'react'
import { render } from 'react-dom'
import './app.css';
import LineChart from './LineChart'

class App extends Component {
    render() {
        return (<>
            <div className='drawer-container'>
                <div className="drawer-item">Line chart</div>
            </div>
            <div className='chart-container'>
                <LineChart width={640} height={480} />
            </div>
        </>);
    }
}

render(<App />, document.getElementById('root'))