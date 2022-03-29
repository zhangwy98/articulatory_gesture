import React from 'react';
import Button from '@mui/material/Button';
import ProgressiveLine from './ProgressiveLine';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

class WordCard extends React.Component {
    constructor(props) {
        super(props)
        this.audioFile = props.audioFile
        this.gestureFile = props.gestureFile

        // initialize audio
        this.audio = new Audio(this.audioFile)

        // initialize gesture data
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
            playbackRate: 0.5,
            totalPlayCnt: 0,
            showLip: true,
            showTip: true,
            showDorsum: true
        }
        this.playSegment = this.playSegment.bind(this)
        this.resetPlay = this.resetPlay.bind(this)
        this.handleRateChange = this.handleRateChange.bind(this)
        this.handleChangeLip = this.handleChangeLip.bind(this)
        this.handleChangeTip = this.handleChangeTip.bind(this)
        this.handleChangeDorsum = this.handleChangeDorsum.bind(this)
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
    handleChangeLip(event) {
        this.setState({
            showLip: !this.state.showLip
        })
    }
    handleChangeTip(event) {
        this.setState({
            showTip: !this.state.showTip
        })
    }
    handleChangeDorsum(event) {
        this.setState({
            showDorsum: !this.state.showDorsum
        })
    }
    render() {
        return (
                <div>
                    <Box sx={{marginTop: 2}}>
                        <Stack alignItems="center" justifyContent="center" direction="row" spacing={1}>
                            <FormControlLabel 
                                label='Lip'
                                control={<Checkbox 
                                    checked={this.state.showLip} 
                                    onChange={this.handleChangeLip}
                                />}
                            />
                            <FormControlLabel 
                                label='Tip'
                                control={<Checkbox 
                                    checked={this.state.showTip} 
                                    onChange={this.handleChangeTip}
                                    label='Tip'
                                />}
                            />
                            <FormControlLabel 
                                label='Dorsum'
                                control={<Checkbox 
                                    checked={this.state.showDorsum} 
                                    onChange={this.handleChangeDorsum}
                                    label='Dorsum'
                                />}
                            />
                        </Stack>
                    </Box>
                    <Box sx={{ width: '20vw', paddingLeft: '2vw', paddingTop: 1}}>
                        <Stack direction="row" spacing={4}>
                            <Box sx={{ width: '8vw', height: '8vh'}}>
                                <FormControl sx={{height: '8vh'}} fullWidth>
                                    <InputLabel sx={{paddingLeft: '10px', paddingTop: '2px'}} variant="standard" >
                                        Play Speed
                                    </InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={this.state.playbackRate}
                                        label="  Play Speed"
                                        onChange={this.handleRateChange}
                                        >
                                        <MenuItem value={0.25}>0.25</MenuItem>
                                        <MenuItem value={0.5}>0.5</MenuItem>
                                        <MenuItem value={0.75}>0.75</MenuItem>
                                        <MenuItem value={1.0}>1.0</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                            <Box sx={{ width: '8vh'}}>
                            {this.state.play === false && 
                                <Button 
                                    variant="contained" onClick={this.playSegment}
                                    sx={{ height: 45, width: 60, marginTop: 0.5}}
                                >play</Button>} 
                            {this.state.play === true && 
                                <Button 
                                    variant="contained" onClick={this.playSegment} disabled 
                                    sx={{ height: 45, width: 60, marginTop: 0.5}}
                                >play</Button>}
                            </Box>
                        </Stack>
                    </Box>
                    {(this.state.play === true || this.state.playEnd === true) && 
                    <ProgressiveLine 
                        showLip={this.state.showLip}
                        showTip={this.state.showTip}
                        showDorsum={this.state.showDorsum}
                        lipData={this.lipData}
                        tipData={this.tipData}
                        dorsumData={this.dorsumData}
                        sampleRate={this.gestureSampleRate}
                        segStart={this.state.segStart}
                        segEnd={this.state.segEnd}
                        playbackRate={this.state.playbackRate}
                        totalPlayCnt={this.state.totalPlayCnt}
                        key={this.state.totalPlayCnt}
                    /> }
                </div>
        )
    }
}

export default WordCard;