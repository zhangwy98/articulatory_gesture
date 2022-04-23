import React from 'react';

import IconButton from '@mui/material/IconButton';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';


import { StaticLine } from './StaticLine';

class InfoCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            play: false
        }
        this.audio = new Audio(this.props.audioFile);
        this.playAudio = this.playAudio.bind(this);
    }
    componentDidMount() {
        this.audio.addEventListener('ended', () => this.setState({ play: false}));
    }
    componentWillUnmount() {
        this.audio.removeEventListener('ended', () => this.setState({ play: false}));
    }
    playAudio() {
        this.state.play ? this.audio.pause() : this.audio.play();
        this.setState({
            play: !this.state.play
        })
    }
    render() {
        return (
            <Box>
                <Stack direction="row" spacing={2}>
                    <Box sx={{ width: "80vw"}}>
                        <StaticLine
                            data={this.props.audioData}
                            type="full"
                            sampleRate={this.props.sampleRate} />
                    </Box>
                    <IconButton 
                        color="primary" onClick={this.playAudio} disableFocusRipple disableRipple
                        sx={{ width: "50px"}}
                    >
                        {
                            ! this.state.play &&
                            <PlayCircleIcon 
                                fontSize='inherit'
                                sx={{width: "50px", height: "50px"}} />
                        }
                        {
                            this.state.play && 
                            <PauseCircleIcon
                                fontSize='inherit'
                                sx={{width: "50px", height: "50px"}} />
                        }
                    </IconButton>
                </Stack>
                <Typography variant="h6">
                    {this.props.text}
                </Typography>
                
            </Box>
        )
    }
}

export default InfoCard;