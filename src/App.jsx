import { useState } from 'react'
import { TextField, Typography, InputAdornment } from '@mui/material'
import './App.css'
import SearchIcon from '@mui/icons-material/Search';

function App() {
  return (
    <>
      <Typography variant="h3" component="h3">
        Chemical Properties
      </Typography>
      <div className="card">
        <TextField
          fullWidth
          id="outlined-basic"
          label="Search for a chemical"
          variant="outlined"
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
        } }
        />
      </div>
    </>
  )
}

export default App
