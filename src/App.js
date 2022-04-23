import './App.css';
import React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import MenuBookIcon from '@mui/icons-material/MenuBook';

// Page component
import HomePage from './HomePage';
import WordPage from './components/WordPage';
import NarrativePage from './components/NarrativePage';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}


function App() {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  }
  return (
    <div className="App">
      {/* <Button variant='contained'>Word Page</Button>       */}

      <Box>
        <Tabs value={value} onChange={handleChange} aria-label="navigation tab"
          sx={{borderBottom: 1, borderColor: 'divider'}}
        >
          <Tab icon={<HomeIcon />} label="Home" />
          <Tab icon={<MenuBookIcon />} label="Narrative" />
          <Tab icon={<SearchIcon />} label="Exploration" />
        </Tabs>
      </Box>
      { value === 0 && <HomePage /> }
      { value === 1 && <NarrativePage />}
      { value === 2 && <WordPage /> }
      {/* <Copyright sx={{ mt: 8, mb: 4 }} 
      /> */}
    </div>
  );
}

export default App;
