import * as React from 'react';
import { rd3 } from '.';

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
export interface ChartContext {
    dimensions: rd3.Dimension;
    data?: Datum[];
}

const simulatedForcedLayout = React.createContext({});
const SimulatedForceLayout: React.FunctionComponent<SimulatedForceLayoutProps> = ({ children, height, width, margin, data }) => {
    return (<div className="chart">
        <simulatedForcedLayout.Provider value={{
            dimensions: { width, height, margin },
            data,
        }}>

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
        </simulatedForcedLayout.Provider>
    </div>);
}

export default SimulatedForceLayout;