
   
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import WordCard from './WordCard';
import InfoCard from './InfoCard';

// import data files
import D2_gesture from '../public/D2_gesture_downsample.json'
import D2_annotation from '../public/D2_annotation.json'
import D2_audio from '../public/D2_audio.wav'
import A1_gesture from '../public/A1_gesture_downsample.json'
import A1_annotation from '../public/A1_annotation.json'
import A1_audio from '../public/A1_audio.wav'

const theme = createTheme();

const A1_collection = {
    gesture: A1_gesture,
    annotation: A1_annotation,
    audio: A1_audio,
    text: 'Your good pants look great, however your ripped pants look like a cheap version of a K-mart special.'
}

const D2_collection = {
    gesture: D2_gesture,
    annotation: D2_annotation,
    audio: D2_audio,
    text: 'Your good pants look great, however your ripped pants look like a cheap version of a K-mart special.'
}

const collections = {
    'A1': A1_collection,
    'D2': D2_collection
}

class WordButton extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick() {
        this.props.onClick(this.props.item.idx)
    }

    render() {
        const button = this.props.selectedWords.includes(this.props.item.idx) === true ?
                        <Button variant="contained" 
                                style={{background: 'gray'}}  
                                onClick={this.handleClick}>
                        {this.props.item.word}
                        </Button> : 
                        <Button variant="contained" 
                                onClick={this.handleClick}>
                        {this.props.item.word}
                        </Button>
        return (
            <div>
                {button}
            </div>
        )
    }
}

class CaseSelection extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(event) {
        this.props.handleChange(event.target.value);
    }
    render() {
        return (
            <Box>
                <FormControl  fullWidth
                    sx={{ 
                        margin: '10px 50px',
                        color: 'white'}}
                >
                    <InputLabel id="case-selection">Dataset</InputLabel> 
                    <Select
                        value={this.props.currentCase}
                        label='case'
                        onChange={this.handleChange}
                    >
                        <MenuItem value='A1'>A1 Collection</MenuItem>
                        <MenuItem value='D2'>D2 Collection</MenuItem>
                    </Select>
                </FormControl>
            </Box>
        )
    }
}

class WordPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedWords: [],
            case: 'None',
            sampleRate: D2_collection.gesture.sampleRate,
            audioData: D2_collection.gesture.audio,
            lipData: D2_collection.gesture.lip,
            tipData: D2_collection.gesture.tip,
            dorsumData: D2_collection.gesture.dorsum,
            wordList: D2_collection.annotation.annotation,
            audioFile: D2_collection.audio,
            text: D2_collection.text
        }
        // initialization to D2 dataset
        this.handleClick = this.handleClick.bind(this)
        this.handleCaseSelection = this.handleCaseSelection.bind(this);

    }
    handleClick(wordIdx) {
        let newState = this.state.selectedWords;
        if (newState.includes(wordIdx)) {
            let idx = newState.indexOf(wordIdx)
            newState.splice(idx, 1)
            console.log(String(wordIdx), 'removed')
        } else {
            newState = [...this.state.selectedWords, wordIdx]
            console.log(String(wordIdx), 'added')
        }
        this.setState({
            selectedWords: newState
        })

    } 
    handleCaseSelection(newCase) {
        this.setState({
            case: newCase,
            selectedWords: [],
            sampleRate: collections[newCase].gesture.sampleRate,
            audioData: collections[newCase].gesture.audio,
            lipData: collections[newCase].gesture.lip,
            tipData: collections[newCase].gesture.tip,
            dorsumData: collections[newCase].gesture.dorsum,
            wordList: collections[newCase].annotation.annotation,
            audioFile: collections[newCase].audio,
            text: collections[newCase].text
        })
    }
    render() {
        const wordBar = this.state.wordList.map((item) => 
            (
                <Grid item key={item.idx}>
                    <WordButton item={item}
                                onClick={this.handleClick} 
                                selectedWords={this.state.selectedWords}/>
                </Grid>
            )
        
        )

        const wordCards = this.state.selectedWords.map((itemIdx, idx) => {
            const item = this.state.wordList[itemIdx]
            let segStart = parseInt(item.startTime * this.state.sampleRate)
            let segEnd = parseInt(item.endTime * this.state.sampleRate)
            let audioSeg = this.state.audioData.slice(segStart, segEnd)
            let lipSeg = this.state.lipData.slice(segStart, segEnd)
            let tipSeg = this.state.tipData.slice(segStart, segEnd)
            let dorsumSeg = this.state.dorsumData.slice(segStart, segEnd)
            return (
                <Grid item key={idx} >  
                    <Card sx={{ display: 'flex', flexDirection: 'column'}}>
                    <WordCard
                        wordIdx={idx}
                        audioFile={this.state.audioFile}
                        audioData={audioSeg}
                        lipData={lipSeg}
                        tipData={tipSeg}
                        dorsumData={dorsumSeg}
                        sampleRate={this.state.sampleRate}
                        segStart={segStart}
                        segEnd={segEnd}
                        word={item.word}
                        handleDelete={this.handleClick}
                    />
                    </Card>
                </Grid>
            )
        })

        return (
            <ThemeProvider theme={theme}>
                <CssBaseline />

                <main>
                    <Box
                        sx={{
                            bgcolor: 'Background.paper',
                            pt: 8,
                            pt: 6
                        }}
                    >
                        <Container>
                            <Typography
                                variant="h4"
                                align='center'
                                color="text.primary"
                                gutterBottom
                            >
                                Articulatory Gesture Exploration
                            </Typography>
                            <Typography
                                sx={{marginTop: "20px"}} 
                                variant="h6" 
                                align="left"
                                color="text.secondary"
                                paragraph
                            >The following waveform corresponds to an English sentence. You can play the audio using the button on the right. With the following widgets, you can explore how articulators are involved in the production of these words. </Typography>

                            <Typography 
                                variant="h6" 
                                align="left"
                                color="text.secondary"
                                paragraph
                            >Click the word you are interested in from the following list and compare different articulatory gestures. For each word, we deliberately include the part before the word because the articulator preparation happens before the actual sound production. You can specify the play rate and choose the articulators you are interested in.</Typography>


                            
                            <Stack direction="row"
                                alignItems="center"  justifyContent="left" 
                                sx={{ marginBottom: "20px"}}
                            >
                                <Typography variant="h6">
                                    Start by selecting a dataset and have fun :)
                                </Typography>
                                    <CaseSelection currentCase={this.state.case} handleChange={this.handleCaseSelection} 
                                />
                            </Stack>
                            
                            <Box >
                                <InfoCard 
                                    key={this.state.case}
                                    audioFile={this.state.audioFile}
                                    sampleRate={this.state.sampleRate}
                                    audioData={this.state.audioData}
                                    text={this.state.text}
                                />
                                <Grid container spacing={2} sx={{ marginTop: 5, marginBottom: 5}}>
                                    {wordBar}
                                </Grid>
                            </Box>
                            
                        </Container>
                    </Box>
                    <Container>
                        <Grid container spacing={8}>
                            {wordCards}
                        </Grid>
                    </Container>
                </main>
            </ThemeProvider>
        )
    }
}


export default WordPage;
