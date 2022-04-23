import React, { Component } from 'react'
import classes from "./LineGraph.module.css";

import { Chart, registerables } from 'chart.js';
import { CHART_COLORS } from './Utils'

Chart.register(...registerables);

class OneProgressiveLine extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: props.data
        }
        this.sampleRate = this.props.sampleRate
        this.playbackRate = this.props.playbackRate
        this.type = this.props.type
        this.chartRef = React.createRef();
    }
    componentDidMount() {
        const chartRef = this.chartRef.current.getContext("2d");
        const data = [];

        for (let i = 0; i < this.props.data.length; i++ ) {
            data.push({x: i, y: this.props.data[i]})
        }

        const dataLength = this.props.data.length;
        const totalDuration = 1000 * dataLength / (this.sampleRate * this.playbackRate) ;
        const delayBetweenPoints = totalDuration / dataLength;

        const animation = {
            x: {
                type: 'number',
                easing: 'linear',
                duration: delayBetweenPoints,
                from: NaN, // the point is initially skipped
                delay(ctx) {
                if (ctx.type !== 'data' || ctx.xStarted) {
                    return 0;
                }
                ctx.xStarted = true;
                return ctx.index * delayBetweenPoints;
                }
            },
            y: {
                type: 'number',
                easing: 'linear',
                duration: delayBetweenPoints,
                from: NaN,
                delay(ctx) {
                if (ctx.type !== 'data' || ctx.yStarted) {
                    return 0;
                }
                ctx.yStarted = true;
                return ctx.index * delayBetweenPoints;
                }
            }
        };
        
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
                animation,
                interaction: {
                    intersect: false
                },
                plugins: {
                    legend: false,
                    tooltip: {
                        enabled: false
                    },
                    title: {
                        display: true,
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
                        type: 'linear'
                    }
                },
            }
        };
        new Chart(chartRef, config);
    }
    render() {
        return (
            <div className={classes.graphContainer}>
                <canvas 
                    id={this.type}
                    ref={this.chartRef}
                />
            </div>
        )
    }
}



class ProgressiveLine extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                {
                    this.props.showTip && 
                    <OneProgressiveLine 
                        data={this.props.lipData} type="lip" 
                        sampleRate={this.props.sampleRate} playbackRate={this.props.playbackRate}/>
                }
                {
                    this.props.showLip &&
                    <OneProgressiveLine 
                        data={this.props.tipData} type="tip" 
                        sampleRate={this.props.sampleRate} playbackRate={this.props.playbackRate}/>
                }
                {
                    this.props.showDorsum &&        
                    <OneProgressiveLine 
                        data={this.props.dorsumData} type="dorsum" 
                        sampleRate={this.props.sampleRate}  playbackRate={this.props.playbackRate}/>
                }
            </div>
        )
    }
}




export default ProgressiveLine;