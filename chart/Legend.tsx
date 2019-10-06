import * as React from 'react';
import './Legend.css';
import { rd3 } from '.';


interface LegendProps {
    chartSeries: rd3.Series[];
}

function LegendSeries(series: rd3.Series, index: number): JSX.Element {
    let seriesName = series.seriesName;
    if (!series.seriesName) {
        seriesName = `Series ${index}`;
    }
    return (<div key={index} className="legend-series">
        <div style={{ backgroundColor: series.color }} className="legend-series-rect" />
        <div className="legend-series-text">{seriesName}</div>
    </div>)
}

const Legend: React.FunctionComponent<LegendProps> = (props) => {
    const { chartSeries } = props;
    if (!chartSeries) {
        return null;
    }

    return (
        <div className='legend'>
            {
                chartSeries.map((series, index) =>
                    LegendSeries(series, index))
            }
        </div>
    )
}

export default Legend;