import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();

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
                            <Typography variant="h4">
                                Welcome to Articulatory Gesture Visualization
                            </Typography>
                            <p></p>
                            <Typography 
                                variant="h6"
                                color="text.secondary"
                                align='left'
                            >
                                As you may know, the production of consonants requires the constriction formed by articulators. Different articulators are involved in the constrction of different consonants. 
                                This demo consists of two components. In the narrative section, you can follow the selected examples to 
                            </Typography>
                        </Container>
                            
                    </Box>
                </main>
            </ThemeProvider>
        )
    }
}

export default HomePage;