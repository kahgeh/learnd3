import * as React from 'react';
import './Legend.css';
import { rd3 } from '.';
import { SeriesAction, SeriesActionNames, getSeriesName } from './Chart';


interface LegendProps {
    chartSeries: rd3.Series[];
    dispatchSeriesAction: React.Dispatch<SeriesAction>;
}

function LegendSeries(series: rd3.Series,
    index: number,
    dispatchSeriesAction: React.Dispatch<SeriesAction>): JSX.Element {
    let seriesName = getSeriesName(series, index);

    function handleClick() {
        dispatchSeriesAction({
            type: SeriesActionNames.toggleVisibility,
            payload: { index }
        })
    }

    let seriesBeadColor = 'lightgray'
    const enabled = (series.visible || (series.visible === null || series.visible === undefined));
    if (enabled) {
        seriesBeadColor = series.color;
    }


    return (<div key={index} className="legend-series" onClick={handleClick}>
        <div style={{ backgroundColor: seriesBeadColor }} className="legend-series-circle" />
        <div className={`legend-series-text ${enabled ? '' : 'disabled'}`}>{seriesName}</div>
    </div>)
}

const Legend: React.FunctionComponent<LegendProps> = (props) => {
    const { chartSeries, dispatchSeriesAction } = props;
    if (!chartSeries) {
        return null;
    }

    return (
        <div className='legend'>
            {
                chartSeries.map((series, index) =>
                    LegendSeries(series, index, dispatchSeriesAction))
            }
        </div>
    )
}

export default Legend;


