import React, { Component } from 'react'
import classes from "./LineGraph.module.css";
import Box from '@mui/material/Box';

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
            data.push({x: i / this.props.sampleRate, y: this.props.data[i]})
        }

        const dataLength = this.props.data.length;
        const totalDuration = 1000 * dataLength / (this.sampleRate * this.playbackRate);
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
                borderColor: this.props.type === 'audio' ? CHART_COLORS.red : CHART_COLORS.red,
                borderWidth: 1,
                radius: 0,
                data: data,
                },
                ]
            },
            options: {
                animation,
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
                        type: 'linear',
                        max: (dataLength + 10) / this.props.sampleRate,
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
                {this.props.componentType == "exploration" &&
                <Box sx={{ margin: "10px 25px" }}>
                    <canvas 
                        height={130}
                        width={300}
                        id={this.type}
                        ref={this.chartRef}
                    />
                </Box>
            }
            {this.props.componentType == "narrative" &&
                <Box sx={{ margin: "10px 25px" }}>
                <canvas 
                    height={125}
                    width={250}
                    id={this.type}
                    ref={this.chartRef}
                />
            </Box>
            }
            </div>
        )
    }
}



class ProgressiveLine extends Component {
    constructor(props) {
        super(props)
        console.log(props)
    }

    render() {
        return (
            <Box>
                <OneProgressiveLine
                    data={this.props.audioData} type="audio"
                    sampleRate={this.props.sampleRate} playbackRate={this.props.playbackRate} 
                    componentType={this.props.type}
                    />
                {
                    this.props.showLip && 
                    <OneProgressiveLine 
                        data={this.props.lipData} type="lip" 
                        sampleRate={this.props.sampleRate} playbackRate={this.props.playbackRate}
                        componentType={this.props.type}
                    />
                        
                }
                {
                    this.props.showTip &&
                    <OneProgressiveLine 
                        data={this.props.tipData} type="tip" 
                        sampleRate={this.props.sampleRate} playbackRate={this.props.playbackRate}
                        componentType={this.props.type}
                    />
                }
                {
                    this.props.showDorsum &&        
                    <OneProgressiveLine 
                        data={this.props.dorsumData} type="dorsum" 
                        sampleRate={this.props.sampleRate}  playbackRate={this.props.playbackRate}
                        componentType={this.props.type}
                    />
                }
            </Box>
        )
    }
}

class ExplorationLine extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <ProgressiveLine 
                showLip={this.props.showLip}
                showTip={this.props.showTip}
                showDorsum={this.props.showDorsum}
                audioData={this.props.audioData}
                lipData={this.props.lipData}
                tipData={this.props.tipData}
                dorsumData={this.props.dorsumData}
                sampleRate={this.props.sampleRate}
                playbackRate={this.props.playbackRate}
                type="exploration"
            />
           
        )
    }
}


class NarrativeLine extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return(
            <ProgressiveLine 
                showLip={this.props.showLip}
                showTip={this.props.showTip}
                showDorsum={this.props.showDorsum}
                audioData={this.props.audioData}
                lipData={this.props.lipData}
                tipData={this.props.tipData}
                dorsumData={this.props.dorsumData}
                sampleRate={this.props.sampleRate}
                playbackRate={this.props.playbackRate}
                type="narrative"
            />
        )
    }
}




export {ProgressiveLine, ExplorationLine, NarrativeLine};