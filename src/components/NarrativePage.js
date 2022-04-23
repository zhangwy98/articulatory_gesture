
   
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PropTypes from 'prop-types';

// import data files
import D2_gesture from '../public/D2_gesture_downsample.json'
import D2_annotation from '../public/D2_annotation.json'
import D2_audio from '../public/D2_audio.wav'
import A1_gesture from '../public/A1_gesture_downsample.json'
import A1_annotation from '../public/A1_annotation.json'
import A1_audio from '../public/A1_audio.wav'
import A1_combined_gesture from '../public/A1_combined_gesture.json'
import A1_typical_example from '../public/A1_typical_example.json'
import WordCard from './WordCard';
import NarrativeCard from './NarrativeCard';
import { ProgressiveLine } from './ProgressiveLine';

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

const sampleRate = A1_collection.gesture.sampleRate;
const combinedGestureSegTime = {
    'lip': {
        'segStart': parseInt(A1_combined_gesture['annotation']['lip'].startTime * sampleRate),
        'segEnd': parseInt(A1_combined_gesture['annotation']['lip'].endTime * sampleRate)
    },
    'tip': {
        'segStart': parseInt(A1_combined_gesture['annotation']['tip'].startTime * sampleRate),
        'segEnd': parseInt(A1_combined_gesture['annotation']['tip'].endTime * sampleRate),
    },
    'dorsum': {
        'segStart': parseInt(A1_combined_gesture['annotation']['dorsum'].startTime * sampleRate),
        'segEnd': parseInt(A1_combined_gesture['annotation']['dorsum'].endTime * sampleRate),
    }
}
const combinedGestureSeg = {
    'lip': {
        'audioSeg': A1_gesture.audio.slice(
            combinedGestureSegTime['lip']['segStart'], combinedGestureSegTime['lip']['segEnd']
        ),
        'lipSeg': A1_gesture.lip.slice(
            combinedGestureSegTime['lip']['segStart'], combinedGestureSegTime['lip']['segEnd']
        )
    },
    'tip': {
        'audioSeg': A1_gesture.audio.slice(
            combinedGestureSegTime['tip']['segStart'], combinedGestureSegTime['tip']['segEnd']
        ),
        'tipSeg': A1_gesture.tip.slice(
            combinedGestureSegTime['tip']['segStart'], combinedGestureSegTime['tip']['segEnd']
        )
    },
    'dorsum': {
        'audioSeg': A1_gesture.audio.slice(
            combinedGestureSegTime['dorsum']['segStart'], combinedGestureSegTime['dorsum']['segEnd']
        ),
        'dorsumSeg': A1_gesture.dorsum.slice(
            combinedGestureSegTime['dorsum']['segStart'], combinedGestureSegTime['dorsum']['segEnd']
        )
    }
}

function Paragraph(props) {
    return (
        <Typography
            align='left'
            width={800}
            variant='body1'
            lineHeight={1.6}
        >
            {props.text}
        </Typography>
    )
}

function TitleH3(props) {
    return (
        <Typography
            align='left'
            variant='h6'
        >
            {props.text}
        </Typography>
    )
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
          <Box sx={{ p: 3 }}>
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

class NarrativePage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedWords: [],
            collection: A1_collection,
            contentValue: 1
        }
        this.handleContentSelection = this.handleContentSelection.bind(this)
    }

    handleContentSelection(event, newValue) {
        this.setState({
            contentValue: newValue
        })
    }

    handleTypicalExampleMap(item, atype) {
        let startTime = parseInt(item.startTime * sampleRate)
        let endTime = parseInt(item.endTime * sampleRate)
        const obj = {
            'segStart': startTime,
            'segEnd': endTime,
            'audioSeg': A1_gesture.audio.slice(
                startTime, endTime
            ),
            'sampleRate': sampleRate,
            'title': item.word,
            'text': item.token
        }
        if (atype == "tip") {
            obj['tipSeg'] = A1_gesture.tip.slice(startTime, endTime)
        }
        else if (atype == "lip") {
            obj['lipSeg'] = A1_gesture.lip.slice(startTime, endTime)
        }
        else {
            obj['dorsumSeg'] = A1_gesture.dorsum.slice(startTime, endTime)
        }
        return obj
    }

    render() {
        console.log(A1_typical_example['annotation']['lip'])
        const typicalExampleLipSegTime = A1_typical_example['annotation']['lip'].map((item) => this.handleTypicalExampleMap(item, 'lip'))
        
        const typicalExampleTipSegTime = A1_typical_example['annotation']['tip'].map((item) => this.handleTypicalExampleMap(item, 'tip'))
        const typicalExampleDorsumSegTime = A1_typical_example['annotation']['dorsum'].map((item) => this.handleTypicalExampleMap(item, 'dorsum'))

        const typicalExampleLipElement = typicalExampleLipSegTime.map((item) => (
            <Grid item key={item.title}>
                <NarrativeCard
                    audioFile={A1_audio} audioData={item.audioSeg}
                    lipData={item.lipSeg} dorsumData={null} tipData={null}
                    segStart={item.segStart} segEnd={item.segEnd}
                    showLip={true} showTip={false} showDorsum={false}
                    sampleRate={sampleRate} playbackRate={0.5}
                    title={item.title} text={item.text}
                />
            </Grid>
        ))

        const typicalExampleTipElement = typicalExampleTipSegTime.map((item) => (
            <Grid item key={item.title}>
                <NarrativeCard
                    audioFile={A1_audio} audioData={item.audioSeg}
                    lipData={null} dorsumData={null} tipData={item.tipSeg}
                    segStart={item.segStart} segEnd={item.segEnd}
                    showLip={false} showTip={true} showDorsum={false}
                    sampleRate={sampleRate} playbackRate={0.5}
                    title={item.title} text={item.text}
                />
            </Grid>
        ))

        const typicalExampleDorsumElement = typicalExampleDorsumSegTime.map((item) => (
            <Grid item key={item.title}>
                <NarrativeCard
                    audioFile={A1_audio} audioData={item.audioSeg}
                    lipData={null} dorsumData={item.dorsumSeg} tipData={null}
                    segStart={item.segStart} segEnd={item.segEnd}
                    showLip={false} showTip={false} showDorsum={true}
                    sampleRate={sampleRate} playbackRate={0.5}
                    title={item.title} text={item.text}
                />
            </Grid>
        ))

        const combinedGestureElement = (
            <Grid container >
                <Grid item key='lip'>
                    <NarrativeCard 
                        audioFile={A1_audio}
                        audioData={combinedGestureSeg.lip.audioSeg}
                        lipData={combinedGestureSeg.lip.lipSeg}
                        dorsumData={null} tipData={null}
                        segStart={combinedGestureSegTime.lip.segStart}
                        segEnd={combinedGestureSegTime.lip.segEnd}
                        showLip={true} showTip={false} showDorsum={false}
                        sampleRate={sampleRate} playbackRate={0.5}
                        type="exploration"
                        title="Lip" 
                        text="chea[p] [v]ersion"
                    />
                </Grid>
                <Grid item key='tip'>
                    <NarrativeCard
                        audioFile={A1_audio}
                        audioData={combinedGestureSeg.tip.audioSeg}
                        tipData={combinedGestureSeg.tip.tipSeg}
                        dorsumData={null} lipData={null}
                        segStart={combinedGestureSegTime.tip.segStart}
                        segEnd={combinedGestureSegTime.tip.segEnd}
                        showLip={false} showTip={true} showDorsum={false}
                        sampleRate={sampleRate} playbackRate={0.5}
                        type="exploration" 
                        title='Tip'
                        text="pa[nts]"
                    />
                </Grid>
                <Grid item key='dorsum'>
                    <NarrativeCard
                        audioFile={A1_audio}
                        audioData={combinedGestureSeg.dorsum.audioSeg}
                        dorsumData={combinedGestureSeg.dorsum.dorsumSeg}
                        tipData={null} lipData={null}
                        segStart={combinedGestureSegTime.dorsum.segStart}
                        segEnd={combinedGestureSegTime.dorsum.segEnd}
                        showLip={false} showTip={false} showDorsum={true}
                        sampleRate={sampleRate} playbackRate={0.5}
                        type="exploration" 
                        title='Dorsum'
                        text="loo[k] [g]reat"
                    />
                </Grid>
            </Grid>
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
                                    component="div"
                                    gutterBottom
                                >
                                    Articulatory Gesture Narrative
                                </Typography>
                                <Typography 
                                    variant="h6" 
                                    align="left"
                                    color="text.secondary"
                                    paragraph
                                >The narrative section gives a brief introduction to the articulatory gestures with our selected examples. You can follow our examples first for a basic overview of how articulatory gestures are related to the production of the sounds and then continue your own tour with the exploration section. </Typography>
                            <Box 
                                sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: 1000}}
                            >   
                                <Tabs 
                                    orientation='vertical'
                                    align='left'
                                    value={this.state.contentValue} 
                                    onChange={this.handleContentSelection} 
                                    aria-label="narrative section tab"
                                    sx={{ borderRight: 1, borderColor: 'divider', width: 180 }}
        
                                >
                                    <Tab label='Introduction' {...a11yProps(0)} />
                                    <Tab label='Lip Gesture' {...a11yProps(1)} />
                                    <Tab label='Tip Gesture' {...a11yProps(2)} />
                                    <Tab label='Dorsum Gesture' {...a11yProps(3)} />
                                    <Tab label='Fun Facts' {...a11yProps(4)} />
                                </Tabs>
                                <TabPanel value={this.state.contentValue} index={0}>
                                    <Typography
                                        align='left'
                                        width={800}
                                        variant='body1'
                                    >
                                    As you may know, the production of consonants requires the constriction formed by certain articulators. Different articulators are involved in the constriction of different consonants. In this demo, we mainly focus on the following pairs:
                                    </Typography>
                                </TabPanel>
                                <TabPanel value={this.state.contentValue} index={1}>
                                    <Paragraph 
                                        text="Let’s first go over some generally applicable rules for articulator gestures." 
                                    />
                                    <Paragraph
                                        text="To form the constriction for a consonant, there will be a raise up in the corresponding articulator. This articulatory gesture happens before the real production to prepare for actual production.
                                        "
                                    />
                                    <TitleH3 
                                        text="Lip Gesture"
                                    />
                                    <Grid container width={850}>
                                        {typicalExampleLipElement}
                                    </Grid>
                                </TabPanel>
                                <TabPanel value={this.state.contentValue} index={2}>
                                    <TitleH3
                                        text="Tip Gesture"  
                                    />
                                    <Grid container width={850}>
                                        {typicalExampleTipElement}
                                    </Grid>
                                </TabPanel>
                                <TabPanel value={this.state.contentValue} index={3}>
                                    <TitleH3
                                        text="Dorsum Gesture"
                                    />                         
                                    <Grid container width={850}>
                                        {typicalExampleDorsumElement}
                                    </Grid>
                                </TabPanel>
                                <TabPanel value={this.state.contentValue} index={4}>
                                    <Typography
                                        variant='h6'
                                        align='left'
                                    >
                                        Combined gestures
                                    </Typography>
                                    <Paragraph
                                        text="Sometime within a word or a phrase there is a sequence of consonants that involve the constriction caused by the same articulator. For these cases, there are no separate gestures for each consonant, instead a single gesture contributes to the production of all these consonants."
                                    />
                                    <p></p>
                                    <Paragraph
                                        text="Following are three examples for the lower lip, the tongue tip, and the tongue dorsum, respectively. You can also use the phrase mode in the exploration page to find more examples yourself.
                                        "
                                    />
                                    {combinedGestureElement}
                                    <p></p>
                                    <Typography
                                        variant='h6'
                                        align='left'
                                    >
                                        Articulatory plan
                                    </Typography>
                                    <Paragraph 
                                        text="Sometimes, consequential sounds with different articulators can also have their corresponding articulatory gesture happen at the same time."
                                    />
                                    <p></p>
                                    <p></p>
                                    <Paragraph 
                                        text="It can be that the tongue gesture takes place when the tongue is not involved in the earlier sound production. "
                                    />
                                    <p></p>
                                    <Paragraph
                                        text="It can also be that though the earlier gesture interferes with the next gesture,  with the cost of the incompleteness of the previous sound."
                                    />
                        
                                </TabPanel>
                            </Box>
                        </Container>
                    </Box>
                </main>
            </ThemeProvider>
        )
    }
}


export default NarrativePage;