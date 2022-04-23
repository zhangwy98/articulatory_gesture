import React from 'react';
import Button from '@mui/material/Button';
import {ExplorationLine, NarrativeLine, ProgressiveLine} from './ProgressiveLine';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';



class NarrativeCard extends React.Component {
    constructor(props) {
        super(props)
        // initialize audio
        console.log(this.props.audioFile)
        this.audio = new Audio(this.props.audioFile)

        // initialize gesture data
        this.audioData = props.audioData
        this.lipData = props.lipData
        this.tipData = props.tipData
        this.dorsumData = props.dorsumData
        
        // sample rate for gesture is this.sampleRa
        this.gestureSampleRate = props.sampleRate
        this.audioSampleRate = 22050

        // segStart and segEnd is the start and end array index of the gesture files

        this.state = {
            segStart: props.segStart,
            segEnd: props.segEnd,
            play: false,
            playEnd: true,
            playbackRate: 0.5,
            totalPlayCnt: 0,
            showLip: true,
            showTip: true,
            showDorsum: true
        }
        this.playSegment = this.playSegment.bind(this)
        this.resetPlay = this.resetPlay.bind(this)
        this.handleRateChange = this.handleRateChange.bind(this)

    }
    componentDidMount() {
        this.audio.addEventListener('ended', () => this.setState({ play: false }));
        this.audio.addEventListener('timeupdate', function() {
            if (this.segEndTime && this.currentTime >= this.segEndTime) {
                this.pause();
                this.callback();
                
            }
        }, false)
    }
    componentWillUnmount() {
        this.audio.removeEventListener('ended', () => this.setState({ play: false }));
        this.audio.removeEventListener('timeupdate', () => this.setState({ play: false }));
    }

    resetPlay() {
        this.setState({
            play: false,
            playEnd: true,
        })
    }
    playSegment() {
        if (this.state.play === false) {
            // segStartTime = segStart / sampleRate
            this.audio.currentTime = this.state.segStart / this.gestureSampleRate
            // segEndTime = segEnd / sampleRate
            this.audio.segEndTime = this.state.segEnd / this.gestureSampleRate
            this.audio.playbackRate = this.state.playbackRate
            this.audio.callback = this.resetPlay
            if (this.state.playEnd === true) {
                this.setState({ play: true, playEnd: false, totalPlayCnt: this.state.totalPlayCnt + 1 })
            } else {
                this.setState({ play: true });
            }
            this.audio.play();
        }
    }
    handleRateChange(event) {
        this.setState({
            playbackRate: event.target.value
        })
        console.log(this.state)
    }

    render() {
        return (
                <div>
                    <Box sx={{paddingTop: '20px', width: 250}}>
                        <Stack alignItems="center"  justifyContent="center" 
                            direction="row" spacing={1}>
                            <Box sx={{width: 150}}>
                                <Typography align='left' variant="h6">
                                    {this.props.title} 
                                </Typography>
                                <Typography
                                    align='left'
                                    variant='body2'
                                >
                                    {this.props.text}
                                </Typography>
                            </Box>
                            
                            <Box sx={{ width: 40}}>
                            {this.state.play === false && 
                                <Button 
                                    variant="contained" onClick={this.playSegment} size="small"
                                    sx={{ height: 30, width: 40, marginTop: 0.5}}
                                >play</Button>} 
                            {this.state.play === true && 
                                <Button 
                                    variant="contained" onClick={this.playSegment} size="small" disabled 
                                    sx={{ height: 30, width: 40, marginTop: 0.5}}
                                >play</Button>}
                            </Box>
                            {/* <Box sx={{ marginLeft: 50, width: 80}}>
                                <FormControl sx={{height: 50}} fullWidth>
                                    <InputLabel sx={{paddingLeft: '10px', paddingTop: '2px'}} variant="standard" >
                                        Speed
                                    </InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={this.state.playbackRate}
                                        label="Play Speed"
                                        onChange={this.handleRateChange}
                                        >
                                        <MenuItem value={0.1}>0.1</MenuItem>
                                        <MenuItem value={0.25}>0.25</MenuItem>
                                        <MenuItem value={0.5}>0.5</MenuItem>
                                        <MenuItem value={0.75}>0.75</MenuItem>
                                        <MenuItem value={1.0}>1.0</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box> */}
                        </Stack>
                    </Box>
                    <Box sx={{ width: 280}} >
                    {(this.state.play === true || this.state.playEnd === true) && 
                    <NarrativeLine 
                        showLip={this.props.showLip}
                        showTip={this.props.showTip}
                        showDorsum={this.props.showDorsum}
                        audioData={this.audioData}
                        lipData={this.lipData}
                        tipData={this.tipData}
                        dorsumData={this.dorsumData}
                        sampleRate={this.gestureSampleRate}
                        // segStart={this.state.segStart}
                        // segEnd={this.state.segEnd}
                        playbackRate={this.state.playbackRate}
                        totalPlayCnt={this.state.totalPlayCnt}
                        key={this.state.totalPlayCnt}
                    /> }
                    </Box>
                </div>
        )
    }
}

export default NarrativeCard;