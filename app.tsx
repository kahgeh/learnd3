import * as React from 'react';
import { render } from 'react-dom'
import { Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { ChartTypes } from './MainLayout';


const App: React.FunctionComponent = () => {
    return (
        <BrowserRouter>
            <Route exact path="/" component={ChartTypes[0].component} />
            {ChartTypes.map((chartType, i) => (<Route key={i} exact path={`/${chartType.name}`} component={chartType.component} />))}
        </BrowserRouter>);
}

render(<App />, document.getElementById('root'))