import React, { Component } from 'react'
import classes from "./LineGraph.module.css";

import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);


export default class LineGraph extends Component {
    chartRef = React.createRef();
    
    componentDidMount() {
        const myChartRef = this.chartRef.current.getContext("2d");

        const labels = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
          ];

        const data = {
            labels: labels,
            datasets: [{
              label: 'My First dataset',
              backgroundColor: 'rgb(255, 99, 132)',
              borderColor: 'rgb(255, 99, 132)',
              data: [0, 10, 5, 2, 20, 30, 45],
            }]
          };

        const config = {
            type: 'line',
            data: data,
            options: {}
        }
        
        new Chart(myChartRef, 
            config
        );
    }
    render() {
        return (
            <div className={classes.graphContainer}>
                <canvas
                    id="myChart"
                    ref={this.chartRef}
                />
            </div>
        )
    }
}