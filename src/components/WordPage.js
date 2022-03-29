
   
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import WordCard from './WordCard';

import D2_gesture from '../public/D2_gesture_downsample.json'
import D2_audio from '../public/D2_audio.wav'

const cards = [1];

const theme = createTheme();

class WordPage extends React.Component {
    constructor(props) {
        super(props)
        this.sampleRate = D2_gesture.sampleRate;
        this.lipData = D2_gesture.lip;
        this.tipData = D2_gesture.tip;
        this.dorsumData = D2_gesture.dorsum;

    }
    render() {
        const testSegStart = 7000;
        const testSegEnd = 8000;
        const testWord = "good"
        const testLipSeg = this.lipData.slice(testSegStart, testSegEnd)
        const testTipSeg = this.tipData.slice(testSegStart, testSegEnd)
        const testDorsumSeg = this.dorsumData.slice(testSegStart, testSegEnd)

        return (
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <AppBar position="relative">
                    <Toolbar>
                        <Typography variant="h6" color="inherit" noWrap>
                            Explore by words
                        </Typography>
                    </Toolbar>
                </AppBar>
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
                                Articulatory gesture exploration
                            </Typography>
                            <Typography 
                                variant="h6" 
                                align="center"
                                color="text.secondary"
                                paragraph
                            >This is a demo</Typography>
                        </Container>
                    </Box>
                    <Container>
                        <Grid container spacing={8}>
                            {cards.map((card) => (
                                <Grid item key={card}> 
                                    <Card sx={{ width: '20vw', height: '80vh', display: 'flex', flexDirection: 'column' }}>
                                    
                                    <WordCard
                                        audioFile={D2_audio}
                                        lipData={testLipSeg}
                                        tipData={testTipSeg}
                                        dorsumData={testDorsumSeg}
                                        sampleRate={this.sampleRate}
                                        segStart={testSegStart}
                                        segEnd={testSegEnd}
                                    />
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Container>
                </main>
            </ThemeProvider>
        )
    }
}


export default WordPage;
