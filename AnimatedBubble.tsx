import * as React from 'react';
import MainLayout from './MainLayout';
import Bubble from './chart/Bubble';
import { schemeCategory10 } from 'd3';
import Chart, { ValueTypeName } from './chart/Chart';
import NumberAxis from './chart/NumberAxis';
import { AxisPosition } from './chart/Axis';
import rd3 from './chart/'
import { ValueType } from '.';
const AnimatedBubble: React.FunctionComponent = (props) => {

    const [bubble, setBubble] = React.useState({
        size: { values: [] }, x: { values: [] }, y: { values: [] }
    });

    const generateData = function () {
        const valueCount = 8;
        const newSizeValues = [];
        const xValues = []
        const yValues = []
        for (let i = 1; i <= valueCount; i++) {
            newSizeValues.push(Math.random() * 100);
            xValues.push(i);
            yValues.push(Math.random() * valueCount);
        }
        setBubble({
            size: { values: newSizeValues },
            x: { values: xValues },
            y: { values: yValues }
        });
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
            <Bubble size={bubble.size} x={bubble.x} y={bubble.y} colorScheme={schemeCategory10} transitionDuration={1000} />
        </Chart>
    </MainLayout>);
};

export default AnimatedBubble;