import * as React from 'react';
import './Chart.css';

interface ChartProps {
    width: number,
    height: number,
    margin: number;
    data: Datum[];
}

const Chart: React.FunctionComponent<ChartProps> = (props) => {
    const [{ width, height, margin, data }, _] = React.useState(props);

    const children = Array.isArray(props.children) ? props.children : [props.children];
    return (<svg width={width + 2 * margin} height={height + 2 * margin} className="chart-svg">
        <g>
            {
                children.map((child, i) => {
                    if (!child.type.name.endsWith('Axis')) {
                        return null;
                    }
                    const originalProps = child.props;
                    return React.cloneElement(child, { ...originalProps, key: i, chart: { height, width, margin }, data });
                })
            }
        </g>
    </svg>);
}

export default Chart;