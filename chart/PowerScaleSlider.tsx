import * as React from 'react';
import { chartContext, AxisActionNames, ChartAxis } from './Chart';

interface PowerScaleSliderProps {
    axisId: string;
}

const PowerScaleSlider: React.FunctionComponent<PowerScaleSliderProps> = (props) => {
    const { axes, dispatchAxesAction } = React.useContext(chartContext);
    const { axisId } = props;
    const relatedAxis = axes.filter((axis: ChartAxis) => axis.id == axisId)[0];
    const [value, setValue] = React.useState(relatedAxis.exponent);

    const handleSliderChangeValue = (e) => {
        const { value } = e.target;
        setValue(value);
        dispatchAxesAction({ type: AxisActionNames.updateExponent, payload: { id: axisId, exponent: Number(value) } });
    }
    return (<>
        <input type="range" min=".1" max="2" step="0.1" value={`${value}`} onChange={handleSliderChangeValue} />
    </>)
}

export default PowerScaleSlider;