# Axis

Gridlines can be created from axis ticks. The issue with this approach is that the outer lines hide the axis. In order to overcome this, set the outer tick size to 0 like so `.tickSizeOuter(0)`

# Scale grouping

One way to group scale is by the type of values:

- Continuous ( e.g. 1, 1.2, 2, 2.9, 3, ...)
- Band ( e.g. Jan, Feb, Mar, ... )