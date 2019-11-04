import * as React from 'react';
import MainLayout from './MainLayout';
import Bubble from './chart/Bubble';
import SimulatedForceLayout from './chart/SimulatedForceLayout';
import { schemeCategory10 } from 'd3';
import Chart from './chart/Chart';
import NumberAxis from './chart/NumberAxis';
import { AxisPosition } from './chart/Axis';

const AnimatedBubble: React.FunctionComponent = (props) => {

    const [size, setSize] = React.useState({ values: [] });

    const generateData = function () {
        const valueCount = 8;
        const newValues = [];
        for (let i = 0; i < valueCount; i++) {
            newValues.push(Math.random() * 100);
        }
        setSize({ values: newValues });
    }

    React.useEffect(() => {
        const timerHandle = setInterval(generateData, 3000);
        return () => {
            clearInterval(timerHandle);
        }
    })

    return (<MainLayout>
        <Chart width={640} height={480} margin={50}
            axes={[(<NumberAxis
                position={AxisPosition.Left}
                label=""
                showGridLines={true}
                valueSource={{ values: [1, 8] }} />),
            (<NumberAxis
                position={AxisPosition.Bottom}
                label=""
                showGridLines={true}
                valueSource={{ values: [1, 8] }} />)]}
        >
            <Bubble size={size} colorScheme={schemeCategory10} transitionDuration={1000} />
        </Chart>
    </MainLayout>);
};

export default AnimatedBubble;