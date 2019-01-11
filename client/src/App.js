import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import BarChart from './Components/BarChart/BarChart';
import WorldMap from './Components/WorldMap/WorldMap';
import worldData from './Components/WorldMap/worldData.json';
import StreamGraph from './Components/StreamGraph/StreamGraph';
import { range, sum } from 'd3-array';
import { scaleThreshold } from 'd3-scale';
import { geoCentroid } from 'd3-geo';
import Brush from './Components/Brush/Brush';
import Statline from './Components/StatLine/Statline';
// constrain our map to only North and South America
const appData = worldData.features
  .filter(d => geoCentroid(d)[0] < -20)

// generate some fake data with relatively interesting
// patterns - the "launch day" of each country is its
// array position

appData.forEach((d, i) => {
  const offset = Math.random()
  d.launchDay = i;
  d.data = range(30).map((p, q) => (
    q < i ? 0 : Math.random() * 2 + offset
  ))
});


class App extends Component {


  state = {
    screenWidth: 1000,
    screenHeight: 500,
    hover: 'none',
    brushExtent: [0, 40]
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize, false)
    this.onResize()
  }

  onResize = () => {
    this.setState({
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight - 70
    })
  }

  onHover = (d) => {
    this.setState({ hover: d.id })
  }

  onBrush = (d) => {
    this.setState({ brushExtent: d })
  }

  render() {

    const filteredAppData = appData.filter((d, i) => (
      d.launchDay >= this.state.brushExtent[0] &&
      d.launchDay <= this.state.brushExtent[1]
    ))

    const colorScale = scaleThreshold().domain([5, 10, 15, 20, 25])
      .range(["#75739F", "#5EAFC6", "#41A368", "#93C464", "#FE9922"])
    // console.log(colorScale(10));
    return (
      <div className="App" >
        <header className="App-header">
          <h2>d3ia dashboard</h2>
        </header>
        <Statline
          allData={appData}
          filteredData={filteredAppData} />
        <div>
          <StreamGraph
            hoverElement={this.state.hover}
            onHover={this.onHover}
            colorScale={colorScale}
            data={filteredAppData}
            size={[this.state.screenWidth, this.state.screenHeight / 2]} />

          <Brush
            changeBrush={this.onBrush}
            size={[this.state.screenWidth, 50]} />

          <WorldMap
            hoverElement={this.state.hover}
            onHover={this.onHover}
            colorScale={colorScale}
            data={filteredAppData}
            size={[this.state.screenWidth / 2, this.state.screenHeight / 2]}
          />
          <BarChart
            hoverElement={this.state.hover}
            onHover={this.onHover}
            colorScale={colorScale}
            data={filteredAppData}
            size={[this.state.screenWidth / 2, this.state.screenHeight / 2]} />
        </div>
      </div>
    );
  }
}

export default App;
