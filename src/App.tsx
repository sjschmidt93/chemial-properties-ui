import React, { useState, useEffect } from 'react';
import { 
  TextField, 
  Container, 
  Box, 
  List, 
  ListItem, 
  ListItemText, 
  Typography,
  AppBar,
  Toolbar,
  Button,
  ThemeProvider,
  createTheme,
  Paper
} from '@mui/material';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { typeAheadApi } from './typeahead-api/typeahead-api';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6A0DAD', // A trendy purple color
    },
    text: {
      primary: '#333333', // Dark gray for better visibility
    },
  },
});

type Chemical = {
  iupacName?: string,
  inchiKey: string,
  name: string
};

function ChemicalDetail({ chemical }: { chemical: string }) {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {chemical}
      </Typography>
      <Typography variant="body1">
        Detailed information about {chemical} would go here.
      </Typography>
    </Box>
  );
}

function TabNavigation({ selectedTab, setSelectedTab }: { selectedTab: string, setSelectedTab: (tab: string) => void }) {
  return (
    <AppBar position="static" sx={{ height: '20vh', width: '100%' }}>
      <Toolbar sx={{ height: '100%', justifyContent: 'center' }}>
        <Button 
          color="inherit" 
          onClick={() => setSelectedTab('UI')}
          sx={{ 
            fontSize: '1.5rem', 
            opacity: selectedTab === 'UI' ? 1 : 0.7,
            fontWeight: selectedTab === 'UI' ? 'bold' : 'normal'
          }}
        >
          UI
        </Button>
        <Button 
          color="inherit" 
          onClick={() => setSelectedTab('API')}
          sx={{ 
            fontSize: '1.5rem', 
            opacity: selectedTab === 'API' ? 1 : 0.7,
            fontWeight: selectedTab === 'API' ? 'bold' : 'normal'
          }}
        >
          API
        </Button>
      </Toolbar>
    </AppBar>
  );
}

function UIPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredChemicals, setFilteredChemicals] = useState<Chemical[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchTerm) {
      const results = typeAheadApi.getChemicalsWithInput(searchTerm);
      setFilteredChemicals(results);
    } else {
      setFilteredChemicals([]);
    }
  }, [searchTerm]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleChemicalClick = (chemical: Chemical) => {
    navigate(`/chemical/${chemical.inchiKey}`);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        pt: 4,
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom color="text.primary">
        Chemical Properties
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        label="Search by IUPAC name, common name, or InChI key"
        value={searchTerm}
        onChange={handleSearchChange}
        sx={{ mb: 2, maxWidth: '600px' }}
      />
      <Box
        sx={{
          width: '100%',
          maxWidth: '600px',
          height: '300px',
          overflowY: 'auto'
        }}
      >
        {filteredChemicals.length > 0 ? (
          <List>
            {filteredChemicals.map((chemical, index) => (
              <ListItem 
                key={index} 
                button 
                onClick={() => handleChemicalClick(chemical)}
                sx={{ 
                  '&:hover': { backgroundColor: 'rgba(106, 13, 173, 0.1)' },
                  color: 'text.primary',
                }}
              >
                <ListItemText primary={chemical.name} />
              </ListItem>
            ))}
          </List>
        ) : (
          searchTerm && (
            <Box sx={{ p: 2 }}>
              <Typography variant="body1" color="text.secondary">
                No matching chemicals found.
              </Typography>
            </Box>
          )
        )}
      </Box>
    </Box>
  );
}

function APIPage() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
      }}
    >
      <Paper elevation={3} sx={{ p: 3, maxWidth: '100%', width: '400px' }}>
        <Typography variant="body1" align="center" color="text.primary">
          Coming soon. For now, you can access the API at{' '}
          <a href="https://rapidapi.com/hazmatteam-hazmatteam-default/api/chemical-properties" target="_blank" rel="noopener noreferrer">
            RapidAPI
          </a>
          .
        </Typography>
      </Paper>
    </Box>
  );
}

function MainContent() {
  const [selectedTab, setSelectedTab] = useState('UI');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100vw' }}>
      <TabNavigation selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <Container maxWidth="lg" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/" element={selectedTab === 'UI' ? <UIPage /> : <APIPage />} />
          <Route path="/chemical/:name" element={<ChemicalDetail chemical="Placeholder" />} />
        </Routes>
      </Container>
    </Box>
  );
}

export default function Component() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <MainContent />
      </Router>
    </ThemeProvider>
  );
}
