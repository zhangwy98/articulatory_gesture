import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();
function Paragraph(props) {
    return (
        <Typography
            variant="h6"
            color="text.secondary"
            align="left"
        >
            {props.text}
        </Typography>
    )
}
class HomePage extends React.Component {
    render() {
        return (
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <main>
                    <Box  sx={{
                            bgcolor: 'Background.paper',
                            pt: 8,
                            pt: 6
                        }}>
                        <Container>
                            <Typography variant="h4"
                                sx={{paddingBottom: "40px"}}>
                                Welcome to Articulatory Gesture Visualization
                            </Typography>
                            <Paragraph 
                               text="As you may know, the production of consonants requires the constriction formed by articulators. Different articulators are involved in the constrction of different consonants. This demo consists of two components. "
                            />
                            <p></p>
                            <Paragraph
                                text="In the narrative section, you can follow the selected examples to gain an overview of the articulatory gestures. How the lower lip, the tongue tip, and the tongue dorsum are involved in the production of different consonants? How a sequence of consonants are produced within a single gesture and how the articulatory plan comes into being?" />
                            
                            <p></p>
                            <Paragraph
                                text="The exploration part is where you can play with the audio yourself. You can select one dataset and choose the word(s) you are interested in. You can also adjust the play speed and filter what articulator tracks you want to focus on." />

                        </Container>
                            
                    </Box>
                </main>
            </ThemeProvider>
        )
    }
}

export default HomePage;