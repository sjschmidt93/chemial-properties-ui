import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { SearchChemicalsResponse } from '../../types/SearchChemicalsResponseType';
import mockResponse from '../../../mocks/mock-get-chemical-response.json';
import { searchChemicals } from '../../api/chemical-properties-api';

export function ChemicalDetailPage() {
  const { inchiKey } = useParams<{ inchiKey: string }>();
  const [searchChemicalResponse, setSearchChemicalResponse] = useState<SearchChemicalsResponse>();
  const [chemicalName, setChemicalName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChemicalDetails = async () => {
      try {
        const response = await searchChemicals(inchiKey ?? '', true);
        setSearchChemicalResponse(response);
      } catch (err) {
        console.error('Error fetching chemical details:', err);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchChemicalDetails();
  }, [inchiKey]);

  if (loading || !searchChemicalResponse) {
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
        Detailed information about {searchChemicalResponse.chemical.name} would go here.
      </Typography>
    </Box>
  );
};
