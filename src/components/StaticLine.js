import React, { Component } from 'react'

import { Chart, registerables } from 'chart.js';
import { CHART_COLORS } from './Utils'

Chart.register(...registerables);

class StaticLine extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: props.data
        }
        this.sampleRate = this.props.sampleRate
        this.chartRef = React.createRef();
    }
    componentDidMount() {
        const chartRef = this.chartRef.current.getContext("2d");
        const data = [];

        for (let i = 0; i < this.props.data.length; i++ ) {
            data.push({x: i / this.sampleRate, y: this.props.data[i]})
        }
        
        const config = {
            type: 'line',
            data: {
                datasets: [{
                borderColor: CHART_COLORS.red,
                borderWidth: 1,
                radius: 0,
                data: data,
                },
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false
                },
                plugins: {
                    legend: false,
                    tooltip: {
                        enabled: false
                    },
                    title: {
                        display: false,
                        text: this.type,
                        position: 'top',
                        padding: {
                            top: 0,
                            bottom: 10
                        }
                    },
                },
                scales: {
                    x: {
                        type: 'linear',
                        max: (this.props.data.length + 50) / this.sampleRate,
                        display: false
                    },
                    y: {
                        display: false
                    }
                },
            }
        };
        new Chart(chartRef, config);
    }
    render() {
        return (
            <div>
                <canvas 
                    id={this.type}
                    ref={this.chartRef}
                    className="fullGraph"
                    
                />
            </div>
        )
    }
}

export {StaticLine};