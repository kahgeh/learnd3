import * as React from 'react';
import Chart, { } from "./chart/Chart"
import Annulus from './chart/Annulus';
import { schemeCategory10 } from 'd3';
import MainLayout from './MainLayout';

const AnnulusChart: React.FunctionComponent = () => {

    return (<MainLayout>
        <Chart width={640} height={480} margin={50}>
            <Annulus
                categories={{ values: [1, 2, 3, 4, 5, 6] }}
                totalText="Total cuppas"
                colorScheme={schemeCategory10} radius={200} innerRadius={120}
            />
        </Chart>
    </MainLayout>);
}

export default AnnulusChart;