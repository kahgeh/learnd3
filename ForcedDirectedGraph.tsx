import * as React from 'react';
import MainLayout from './MainLayout';
import Bubble from './chart/Bubble';
import SimulatedForceLayout from './chart/SimulatedForceLayout';
import { schemeCategory10, schemeBlues } from 'd3';

const ForcedDirectedGraph: React.FunctionComponent = (props) => {
    return (<MainLayout>
        <SimulatedForceLayout width={640} height={480} margin={50}>
            <Bubble size={{ values: [50, 70, 30] }} colorScheme={schemeCategory10} />
        </SimulatedForceLayout>
    </MainLayout>);
};

export default ForcedDirectedGraph;