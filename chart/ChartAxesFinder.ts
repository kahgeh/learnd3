import { ChartAxis, ValueTypeName } from './Chart';
import { AxisPosition } from './Axis';
import { ValueType } from '..';

export default class ChartAxesFinder {
    _chartAxes: ChartAxis[];
    constructor(chartAxes: ChartAxis[]) {
        this._chartAxes = chartAxes;
    }

    getSimilarPositionAndType = (positions: AxisPosition[], dataType: ValueTypeName) => {
        if (this._chartAxes.length === 0) {
            return this;
        }

        const found = this._chartAxes.filter((axis) =>
            positions.indexOf(axis.position) >= 0 &&
            axis.scaleBuild.dataType === dataType);
        return new ChartAxesFinder(found);
    }

    withinRange = <T extends ValueType>(range: [T, T]) => {
        if (this._chartAxes.length === 0) {
            return this;
        }

        const found = this._chartAxes.filter((axis) =>
            axis.scaleBuild.range[0] <= range[0]
            && axis.scaleBuild.range[1] >= range[1]
        );

        return new ChartAxesFinder(found);
    }

    getRangeValue<T extends ValueType>(range: [T, T], valueTypeName: ValueTypeName) {
        if (valueTypeName === ValueTypeName.Date) {
            return (range[1] as Date).valueOf() - (range[0] as Date).valueOf();
        }

        return (range[1] as number) - (range[0] as number);
    }

    widestRange = () => {
        if (this._chartAxes.length === 0) {
            return null;
        }
        let widestRangeAxis = this._chartAxes[0];
        let widestRangeValue = this.getRangeValue(widestRangeAxis.scaleBuild.range, widestRangeAxis.scaleBuild.dataType);
        for (let axis of this._chartAxes) {
            const axisRangeValue = this.getRangeValue(axis.scaleBuild.range, axis.scaleBuild.dataType);
            if (axisRangeValue > widestRangeValue) {
                widestRangeAxis = axis;
                widestRangeValue = axisRangeValue;
            }
        }
        return widestRangeAxis;
    }

    mostNarrowRange = () => {
        if (this._chartAxes.length === 0) {
            return null;
        }
        let mostNarrowRangeAxis = this._chartAxes[0];
        let mostNarrowRangeValue = this.getRangeValue(mostNarrowRangeAxis.scaleBuild.range, mostNarrowRangeAxis.scaleBuild.dataType);
        for (let axis of this._chartAxes) {
            const axisRangeValue = this.getRangeValue(axis.scaleBuild.range, axis.scaleBuild.dataType);
            if (axisRangeValue < mostNarrowRangeValue) {
                mostNarrowRangeAxis = axis;
                mostNarrowRangeValue = axisRangeValue;
            }
        }
        return mostNarrowRangeAxis;
    }
}