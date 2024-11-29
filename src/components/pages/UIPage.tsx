import React, { useState, useEffect } from 'react';
import { TextField, Box, List, ListItem, ListItemText, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { typeAheadApi } from '../../api/typeahead-api';;

type Chemical = {
  iupacName?: string,
  inchiKey: string,
  name: string
};

type ChemicalWithInchiKey = {
  name: string,
  inchiKey: string | undefined
};

export function UIPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredChemicals, setFilteredChemicals] = useState<ChemicalWithInchiKey[]>([]);
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

  const handleChemicalClick = (chemical: ChemicalWithInchiKey) => {
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
};
