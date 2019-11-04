import * as React from "react";
import './MainLayout.css';
import { useHistory, useLocation } from "react-router";
import LineBarChart from "./LineBarChart";
import AnnulusChart from "./AnnulusChart";
import AnimatedBubble from './AnimatedBubble';
import ForcedDirectedGraph from './ForcedDirectedGraph';

export enum ChartTypeNames {
    LineAndBar = 'lineBarChart',
    Annulus = 'annulusChart',
    AnimatedBubble = 'animatedBubble',
    ForcedDirectGraph = 'forcedDirectedGraph'
}

export const ChartTypes = [{
    name: ChartTypeNames.LineAndBar,
    title: 'Line and Bar Chart',
    component: LineBarChart
}, {
    name: ChartTypeNames.Annulus,
    title: 'Annulus Chart',
    component: AnnulusChart
}, {
    name: ChartTypeNames.AnimatedBubble,
    title: 'Animated Bubble',
    component: AnimatedBubble
}, {
    name: ChartTypeNames.ForcedDirectGraph,
    title: 'Forced Direct Graph',
    component: ForcedDirectedGraph
}]

const MainLayout: React.FunctionComponent = ({ children }) => {
    const history = useHistory();
    const location = useLocation();
    let selectedChartTitle = ChartTypes[0].title;
    let selectedChartTypes = ChartTypes.filter((chartType) => location.pathname.endsWith(chartType.name));
    if (selectedChartTypes && selectedChartTypes.length > 0) {
        selectedChartTitle = selectedChartTypes[0].title;
    }
    return (<>
        <div className='drawer-container'>
            {
                ChartTypes.map((chartType, i) => (<div key={i} className="drawer-item">
                    <div className="button" onClick={() => history.push(chartType.name)}>{chartType.title}</div>
                </div>))
            }
        </div>
        <div className="content-container">
            <div className="chart-title">
                {selectedChartTitle}
            </div>
            <div className="chart-container">
                {children}
            </div>
            <div className="chart-footer">
            </div>
        </div>
    </>);
}

export default MainLayout;