# Background

This is a d3 learning scratch pad. My approach to learning is to implement reusable react chart components using d3 an the underlying technology.

In the process, I am also learning how to use react hooks. 

# Design

There are 2 users of chart components:
- developer - authors
- end user - view and customize

As a developer I want an intuitive set of chart sub components that I can use to assemble a chart, for example :

I want to be able to say, I want the chart to be of certain size like this 

    <Chart width={640} height={480}/>

then may be I want to add a line like this :

    <Chart width={640} height={480} margin={50}>
        <Line x={{ values: [1, 2, 3, 4] }}
              y={{ values: [10, 20, 30, 40] }}/>
    </Chart>

and this should give me a 45 degrees line over an imagnary horizontal axis.

Next I'd probably want to throw in axes to provide some visual context, may be by doing this 

    <Chart width={640} height={480} margin={50}
        axes={[
            <NumberAxis
                position={AxisPosition.Left}
                valueSource={{ values: [0,40] }}/>
        ]}
    >
        <Line x={{ values: [1, 2, 3, 4] }}
            y={{ values: [10, 20, 30, 40] }}/>
    </Chart>    

to get this ...

<p align="center">
<img width="250px" height="200px" src="https://gist.githubusercontent.com/kahgeh/a473093ea66190b2449fa85788f5e66c/raw/cacd60b7259fdef3f83a1a894af4e62302e8a84c/simplelinechart.png" width>
</p>

# Learning areas ( capabilities )
## Sufficiently covered 
- D3 + react 
- Line chart
- Data
- Smoothing function
- Data beads 
- Gridlines
- Legend + interactivity
- Range emphasis with power scale
- SVG interactivity (https://github.com/kahgeh/learnsvg)
- Bar Chart
- Annulus Chart
- Bubble Chart ( animation - radius, and y ordinate via transform translation )


## TBD
- Forced directed graph
- Maps
- Candle sticks
- Stacked

# References
1. https://app.pluralsight.com/library/courses/d3-getting-started/table-of-contents
2. https://bl.ocks.org/
3. https://d3fc.io
4. http://www.petercollingridge.co.uk/tutorials/svg/interactive/dragging/
5. https://d3-annotation.susielu.com/