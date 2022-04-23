
   
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
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

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ paddingLeft: 3, paddingRight: 3, paddingBottom: 3}}>
            {children}
          </Box>
        )}
      </div>
    );
  }
  
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
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
                        defaultValue='D2'
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
            phraseModeSelectedWords: [],
            phraseModeShow: 0,
            phraseModeInfo: {
                
            },
            case: 'D2',
            mode: 1,
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
        this.handleChangeMode = this.handleChangeMode.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.handlePhraseModeClick = this.handlePhraseModeClick.bind(this)
        this.handlePhraseModeRun = this.handlePhraseModeRun.bind(this)
        this.handleCaseSelection = this.handleCaseSelection.bind(this);

    }
    handleChangeMode(event, newMode) {
        this.setState({
            mode: newMode
        })
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
    handlePhraseModeClick(wordIdx) {
        let newState = this.state.phraseModeSelectedWords;
        if (newState.includes(wordIdx)) {
            if (newState[newState.length - 1] === wordIdx) {
                newState.pop()
                console.log('newState', newState)
            } else {
                // cut in the middle, restart
                newState = []
            }
        } else {
            if (newState.length === 0 || newState[newState.length - 1] === wordIdx - 1) {
                newState.push(wordIdx)
            } else {
                // add another one, restart
                newState = [wordIdx]
            }
        }
        this.setState({
            phraseModeSelectedWords: newState
        })
    } 
    handlePhraseModeRun() {
        if (this.state.phraseModeSelectedWords.length > 0) {
            const startIdx = this.state.phraseModeSelectedWords[0];
            const endIdx = this.state.phraseModeSelectedWords[this.state.phraseModeSelectedWords.length - 1];
            const startItem = this.state.wordList[startIdx];
            const endItem = this.state.wordList[endIdx];
            console.log(startItem, endItem)
            const segStart = parseInt(startItem.startTime * this.state.sampleRate)
            const segEnd = parseInt(endItem.endTime * this.state.sampleRate)
            console.log(segStart, segEnd)
            const audioSeg = this.state.audioData.slice(segStart, segEnd)
            const lipSeg = this.state.lipData.slice(segStart, segEnd)
            const tipSeg = this.state.tipData.slice(segStart, segEnd)
            const dorsumSeg = this.state.dorsumData.slice(segStart, segEnd)
            const words = this.state.phraseModeSelectedWords.map((itemIdx) => (
                this.state.wordList[itemIdx].word
            ))
            const newPhraseObj = {
                audioFile: this.state.audioFile,
                audioData: audioSeg,
                lipData: lipSeg,
                tipData: tipSeg,
                dorsumData: dorsumSeg,
                segStart: segStart,
                segEnd: segEnd,
                word: words.join(' ')
            }
            this.setState({
                phraseModeShow: this.state.phraseModeShow + 1,
                phraseModeInfo: newPhraseObj
            })
        }
        
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
                <Grid item key={itemIdx} >  
                    <Card sx={{ display: 'flex', flexDirection: 'column'}}>
                    <WordCard
                        type="word"
                        wordIdx={itemIdx}
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

        const phraseBar = this.state.wordList.map((item) => (
            <Grid item key={item.idx}>
                <WordButton item={item}
                            onClick={this.handlePhraseModeClick}
                            selectedWords={this.state.phraseModeSelectedWords} />
            </Grid>
        ))
        
        const phraseCard = (
            <Card sx={{ diaplay: 'flex', flexDirection: 'column'}}>
                <WordCard
                    key={this.state.phraseModeShow}
                    type="phrase"
                    wordIdx={0}
                    audioFile={this.state.phraseModeInfo.audioFile}
                    audioData={this.state.phraseModeInfo.audioData}
                    lipData={this.state.phraseModeInfo.lipData}
                    tipData={this.state.phraseModeInfo.tipData}
                    dorsumData={this.state.phraseModeInfo.dorsumData}
                    sampleRate={this.state.sampleRate}
                    segStart={this.state.phraseModeInfo.segStart}
                    segEnd={this.state.phraseModeInfo.segEnd}
                    word={this.state.phraseModeInfo.word}
                />
            </Card>
        )


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
                                sx={{ marginBottom: "0px"}}
                            >
                                <Typography variant="h6">
                                    Start by selecting a dataset and have fun :)
                                </Typography>
                                    <CaseSelection currentCase={this.state.case} handleChange={this.handleCaseSelection} 
                                />
                            </Stack>
                            
                            <Box sx={{marginBottom: 5}}>
                                <InfoCard 
                                    key={this.state.case}
                                    audioFile={this.state.audioFile}
                                    sampleRate={this.state.sampleRate}
                                    audioData={this.state.audioData}
                                    text={this.state.text}
                                />
                                
                            </Box>
                            <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', 'paddingBottom': 20}}> 
                                <Tabs 
                                    orientation='vertical'
                                    align='left'
                                    value={this.state.mode} 
                                    onChange={this.handleChangeMode} 
                                    aria-label="narrative section tab"
                                    sx={{ borderRight: 1, borderColor: 'divider', width: 200 }}
        
                                >
                                    <Tab label='Word mode' {...a11yProps(0)} />
                                    <Tab label='Phrase mode' {...a11yProps(1)} />
                                    
                                </Tabs>
                                <TabPanel value={this.state.mode} index={0}>
                                    <Typography
                                        align='left'
                                        variant='h6'>
                                    Word Mode
                                    </Typography>
                                    <Typography
                                        align='left'
                                        color='text.secondary'>
                                    Each word will be presented in a single card.
                                    </Typography>
                                    <Box sx={{width: 900}}>
                                    <Grid container spacing={2} sx={{paddingTop: 2, marginBottom: 5}}>
                                        {wordBar}
                                    </Grid>
                                    <Grid container spacing={8}>
                                        {wordCards}
                                    </Grid>
                                    </Box>
                                </TabPanel>
                                <TabPanel value={this.state.mode} index={1}>
                                    <Box sx={{width: 800}}>
                                        <Typography
                                            align='left'
                                            variant='h6'>
                                        Phrase Mode
                                        </Typography>
                                        <Typography
                                            align='left'
                                            color='text.secondary'>
                                        Select a sequence of continous words and the whole phrases will be presented and click the SHOW GESTURE button. If you select a word that is not directly following the previous one, the selection will be restarted.
                                        </Typography>
                                        <Grid container spacing={2} sx={{paddingTop: 2, marginBottom: 2}}>
                                            {phraseBar}
                                            <Button sx={{padding: "25px 50px 25px"}} onClick={this.handlePhraseModeRun}>
                                                Show gesture
                                            </Button>
                                        </Grid>
                                        {this.state.phraseModeShow > 0 && phraseCard}
                                    </Box>
                                </TabPanel>
                            </Box>
                            
                            
                        </Container>
                    </Box>
                </main>
            </ThemeProvider>
        )
    }
}


export default WordPage;
