import React, { Component } from 'react';
// import './App.css';
import { scaleLinear } from 'd3-scale';
import { max, sum } from 'd3-array';
import { select } from 'd3-selection';
import { legendColor } from 'd3-svg-legend';
import { transition } from 'd3-transition';
import { scaleThreshold } from 'd3-scale';

class BarChart extends Component {
    state = {}

    componentDidMount() {
        this.createBarChart()
    }

    componentDidUpdate() {
        this.createBarChart()
    }

    createBarChart() {
        const dataMax = max(this.props.data.map(d => sum(d.data)))
        const barWidth = this.props.size[0] / this.props.data.length
        const node = this.node



        const yScale = scaleLinear()
            .domain([0, dataMax])
            .range([0, this.props.size[1]])
        // console.log(yScale(500))
        // console.log(legendColor())
        // select(node)
        //     .select('g.legend')
        //     .append('rect')
        //     .attr('fill', 'blue')
        //     .attr('width', 20)
        //     .attr('height', 20)
        //     .attr('y', (d, i) => { return i * 2 })


        select(node)
            .selectAll('rect')
            .data(this.props.data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .on('mouseover', this.props.onHover)

        select(node)
            .selectAll('rect')
            .data(this.props.data)
            .exit()
            .remove()

        select(node)
            .selectAll('rect.bar')
            .data(this.props.data)
            .attr('x', (d, i) => i * barWidth)
            .attr('y', (d, i) => this.props.size[1] - yScale(sum(d.data)))
            .attr('height', (d, i) => yScale(sum(d.data)))
            .attr('width', barWidth)
            .style('fill', (d, i) => this.props.hoverElement === d.id ? "FCBC34" : this.props.colorScale(i))
            .style('stroke', 'black')
            .style('stroke-opacity', 0.25)

        const legend = legendColor()
            .labels(['Wave 1', 'Wave 2', 'Wave 3', 'Wave 4', 'Wave 5'])
            .scale(this.props.colorScale)
        // console.log(legend);
        select(node)
            .selectAll('g.legend')
            .data([0])
            .enter()
            .append('g')
            .attr('class', 'legend')
            .call(legend)

        select(node)
            .select("g.legend")
            .attr(`transform`, `translate(${this.props.size[0] - 100}, 20)`)

        select(node)
            .selectAll('g.cell')
            .data(this.props.data)
            .append('rect')
            .attr('width', 20)
            .attr('height', 20)
            .attr('class', 'legendRect')
            .style('fill', (d, i) => this.props.colorScale(d.launchDay * 5))

    }

    render() {
        return (
            <svg ref={node => this.node = node} width={this.props.size[0]} height={this.props.size[1]}>
            </svg>
        );
    }
}

export default BarChart;