import React from 'react';
import Button from '@mui/material/Button';
import {ExplorationLine, ProgressiveLine} from './ProgressiveLine';
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



class WordCard extends React.Component {
    constructor(props) {
        super(props)
        // initialize audio
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
        this.handleDelete = this.handleDelete.bind(this)
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
    handleDelete() {
        this.props.handleDelete(this.props.wordIdx)
    }
    render() {
        const width = this.props.type == "word" ? 400 : 700
        const titleWidth = this.props.type == "word" ? 200 : 400
        const buttonWidth = this.props.type == "word" ? 160 : 160
        const height = this.props.type == "word" ? 600 : 700
        const paddingLeft = this.props.type == "word" ? 2 : 0
        const explorationType = this.props.type == "word" ? "wordExploration" : "phraseExploration"
        return (
                <div>
                    <Box sx={{paddingTop: '20px', width: width}}>
                        <Stack alignItems="center"  justifyContent="center" 
                            direction="row" spacing={1}>
                            <Typography sx={{width: titleWidth, paddingLeft: paddingLeft}} align='left' variant="h4">
                                {this.props.word} 
                            </Typography>
                            <Box sx={{ width: buttonWidth}}>
                            {this.state.play === false && 
                                <Button 
                                    variant="contained" onClick={this.playSegment}
                                    sx={{ height: 40, width: 80, marginTop: 0.5}}
                                >play</Button>} 
                            {this.state.play === true && 
                                <Button 
                                    variant="contained" onClick={this.playSegment} disabled 
                                    sx={{ height: 40, width: 80, marginTop: 0.5}}
                                >play</Button>}
                            </Box>
                            {this.props.type == "word" &&  <IconButton color='primary' 
                                        onClick={this.handleDelete}
                                        sx={{ width: 50, height: 50}}>
                                <DeleteIcon sx={{ width: 30, height: 30}} />
                            </IconButton>}
                        </Stack>
                    </Box>
                    <Box sx={{paddingTop: '20px', width: width}} >
                        <Stack direction="row" 
                            // alignItems="center" 
                            justifyContent="center" 
                            spacing={4}>
                            <Box sx={{width: titleWidth - 20}}>
                                <Stack direction="column">
                                <Stack  direction="row" spacing={0}>
                                    <FormControlLabel 
                                        label='Lip'
                                        control={<Checkbox size='small' style={{paddingTop: 5, paddingBottom: 5}}
                                            checked={this.state.showLip} 
                                            onChange={this.handleChangeLip}
                                        />}
                                    />
                                    <FormControlLabel 
                                        label='Tip'
                                        control={<Checkbox size='small' style={{paddingTop: 5, paddingBottom: 5}}
                                            checked={this.state.showTip} 
                                            onChange={this.handleChangeTip}
                                            label='Tip'
                                        />}
                                    />
                                </Stack>
                                <FormControlLabel 
                                        label='Dorsum'
                                        control={<Checkbox size='small' style={{paddingTop: 5, paddingBottom: 5}}
                                            checked={this.state.showDorsum} 
                                            onChange={this.handleChangeDorsum}
                                            label='Dorsum'
                                        />}
                                    />
                                </Stack>
                            </Box>
                            <Box sx={{ marginLeft: 50, width: 150}}>
                                <FormControl sx={{height: 50}} fullWidth>
                                    <InputLabel sx={{paddingLeft: '10px', paddingTop: '2px'}} variant="standard" >
                                        Play Speed
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
                            </Box>
                            
                        </Stack>
                    </Box>
                    <Box sx={{ width: width, height: height}} >
                    {(this.state.play === true || this.state.playEnd === true) && 
                    <ExplorationLine 
                        showLip={this.state.showLip}
                        showTip={this.state.showTip}
                        showDorsum={this.state.showDorsum}
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
                        type={explorationType}
                    /> }
                    </Box>
                </div>
        )
    }
}

export default WordCard;