import { useState } from 'react';
import { 
  Container, 
  Box, 
  ThemeProvider,
  createTheme,
} from '@mui/material';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { TabNavigation } from './components/tabs/TabNavigation';
import { ChemicalDetailPage } from './components/pages/ChemicalDetailPage';
import { UIPage } from './components/pages/UIPage';
import { APIPage } from './components/pages/APIPage';

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

function MainContent() {
  const [selectedTab, setSelectedTab] = useState('UI');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100vw' }}>
      <TabNavigation selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <Container maxWidth="lg" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/" element={selectedTab === 'UI' ? <UIPage /> : <APIPage />} />
          <Route path="/chemical/:inchiKey" element={<ChemicalDetailPage />} />
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
};
