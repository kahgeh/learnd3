import * as React from 'react';

interface PowerScaleSliderProps {
    value: number;
    dispatchExponent: (action: any) => void;
}

const PowerScaleSlider: React.FunctionComponent<PowerScaleSliderProps> = (props) => {
    const { dispatchExponent } = props;
    const [value, setValue] = React.useState(props.value);

    const handleSliderChangeValue = (e) => {
        const { value } = e.target;
        setValue(value);
        dispatchExponent({ type: 'update', payload: Number(value) });
    }
    return (<>
        <input type="range" min=".1" max="2" step="0.1" value={`${value}`} onChange={handleSliderChangeValue} />
    </>)
}

export default PowerScaleSlider;