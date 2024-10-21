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
  Paper,
  CircularProgress
} from '@mui/material';
import { BrowserRouter as Router, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { typeAheadApi } from './typeahead-api/typeahead-api';
import axios from 'axios';

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

function ChemicalDetail() {
  const { inchiKey } = useParams<{ inchiKey: string }>();
  const [chemicalName, setChemicalName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChemicalDetails = async () => {
      try {
        const response = await axios.get(
          `https://w972i5rc5l.execute-api.us-east-2.amazonaws.com/v0/?search=${inchiKey}&return_all=true`,
          {
            headers: {
              Auth: 'Bearer e53c49c7df86fb1bc9c0361ff31a709d9d7eea12'
            }
          }
        );
        setChemicalName(response.data.chemical.name);
      } catch (err) {
        setError('Failed to fetch chemical details');
        console.error('Error fetching chemical details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChemicalDetails();
  }, [inchiKey]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom color="error">
          Error
        </Typography>
        <Typography variant="body1">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {chemicalName || 'Chemical Details'}
      </Typography>
      <Typography variant="body1">
        Detailed information about {chemicalName} would go here.
      </Typography>
    </Box>
  );
}

interface TabButtonProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

function TabButton({ label, isSelected, onClick }: TabButtonProps) {
  return (
    <Button 
      color="inherit" 
      onClick={onClick}
      sx={{ 
        fontSize: '1.5rem', 
        opacity: isSelected ? 1 : 0.7,
        fontWeight: isSelected ? 'bold' : 'normal'
      }}
    >
      {label}
    </Button>
  );
}

function TabNavigation({ selectedTab, setSelectedTab }: { selectedTab: string, setSelectedTab: (tab: string) => void }) {
  return (
    <AppBar position="static" sx={{ height: '15vh', width: '100%' }}>
      <Toolbar sx={{ height: '100%', justifyContent: 'center' }}>
        <TabButton 
          label="UI"
          isSelected={selectedTab === 'UI'}
          onClick={() => setSelectedTab('UI')}
        />
        <TabButton 
          label="API"
          isSelected={selectedTab === 'API'}
          onClick={() => setSelectedTab('API')}
        />
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
        justifyContent: 'flex-start',
        minHeight: '85vh',
        pt: 8,
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
        justifyContent: 'flex-start',
        minHeight: '85vh',
        pt: 8,
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom color="text.primary">
        API Access
      </Typography>
      <Paper elevation={3} sx={{ p: 3, maxWidth: '100%', width: '600px' }}>
        <Typography variant="body1" align="center" color="text.primary">
          You can access our API directly at{' '}
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
          <Route path="/chemical/:inchiKey" element={<ChemicalDetail />} />
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