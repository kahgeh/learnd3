import * as React from 'react'
import { Component } from 'react'
import { render } from 'react-dom'
import './app.css';

class App extends Component {
    render() {
        return (<>
            <div className='drawer-container'>
                <div className="drawer-item">Line chart</div>
            </div>
            <div className='chart-container'>
            </div>
        </>);
    }
}

render(<App />, document.getElementById('root'))