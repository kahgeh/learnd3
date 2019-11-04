import * as React from 'react';

interface SimulatedForceLayoutProps {
    width: number;
    height: number;
    margin: number;
    data?: Datum[];
}

function getArray(obj: any) {
    if (obj === null || obj == undefined) {
        return obj;
    }
    return (Array.isArray(obj)) ? obj : [obj];
}


const SimulatedForceLayout: React.FunctionComponent<SimulatedForceLayoutProps> = ({ children, height, width }) => {
    return (<div className="chart">
        <svg height={height} width={width} className="chart-svg">
            {
                children ? getArray(children).map((child: React.DetailedReactHTMLElement<any, HTMLElement>, i: number) => {
                    const originalProps = child.props;
                    return React.cloneElement(child, {
                        ...originalProps,
                        key: i,
                        index: i
                    });
                }) : null
            }
        </svg>
    </div>);
}

export default SimulatedForceLayout;