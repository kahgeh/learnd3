# d3 + React Event

In order to access d3.event to perform action like d3.event.preventDefault() ( for example to prevent browser context menu from showing ) , ensure import event with an alias, like this 

    import { event as currentEvent, ... } from 'd3';

to avoid conflicts

