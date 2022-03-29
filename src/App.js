import './App.css';
import WordPage from './components/WordPage';
import React from 'react';
import Button from '@mui/material/Button';


function App() {
  return (
    <div className="App">
      {/* <Button variant='contained'>Word Page</Button>       */}
      <WordPage></WordPage>
    </div>
  );
}

export default App;
