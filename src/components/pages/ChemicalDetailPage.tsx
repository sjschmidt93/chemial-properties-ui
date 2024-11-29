import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { SearchChemicalsResponse } from '../../types/SearchChemicalsResponseType';
import { searchChemicals } from '../../api/chemical-properties-api';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  TextField,
  Button,
  Link,
  Collapse,
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';

export function ChemicalDetailPage() {
  const { inchiKey } = useParams<{ inchiKey: string }>();
  const [searchChemicalResponse, setSearchChemicalResponse] = useState<SearchChemicalsResponse>();
  const [chemicalName, setChemicalName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [synonymFilter, setSynonymFilter] = useState('');
  const [showAllSynonyms, setShowAllSynonyms] = useState(false);
  const [expandedProperties, setExpandedProperties] = useState<{ [key: string]: boolean }>({});

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

  const filteredSynonyms = useMemo(() => {
    return searchChemicalResponse?.chemical.synonyms.filter(synonym =>
      synonym.toLowerCase().includes(synonymFilter.toLowerCase())
    ) ?? [];
  }, [searchChemicalResponse, synonymFilter]);

  if (loading || !searchChemicalResponse) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        "Loading..."
      </Box>
    );
  }

  const { chemical, properties } = searchChemicalResponse;

  const displayedSynonyms = showAllSynonyms ? filteredSynonyms : filteredSynonyms.slice(0, 10);

  const formatValue = (value: number) => {
    return value.toFixed(2);
  };

  const togglePropertyExpansion = (propertyType: string) => {
    setExpandedProperties(prev => ({
      ...prev,
      [propertyType]: !prev[propertyType]
    }));
  };

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
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {chemical.name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {chemical.iupac_name}
          </Typography>
          <Typography variant="body2" gutterBottom>
            InChI Key: {chemical.inchi_key}
          </Typography>
          <Link
            href={`https://pubchem.ncbi.nlm.nih.gov/compound/${chemical.inchi_key}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on PubChem
          </Link>
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Synonyms:
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              label="Filter synonyms"
              value={synonymFilter}
              onChange={(e) => setSynonymFilter(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Box sx={{ maxHeight: '200px', overflowY: 'auto' }}>
              {displayedSynonyms.map((synonym, index) => (
                <Chip key={index} label={synonym} sx={{ m: 0.5 }} />
              ))}
            </Box>
            {filteredSynonyms.length > 10 && (
              <Button
                onClick={() => setShowAllSynonyms(!showAllSynonyms)}
                sx={{ mt: 1 }}
              >
                {showAllSynonyms ? 'Show Less' : 'Show More'}
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Properties
        </Typography>
        <Grid container spacing={3}>
          {properties.map((property, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {property.type.charAt(0).toUpperCase() + property.type.slice(1).replace('_', ' ')}
                  </Typography>
                  {property.aggregate !== undefined && (
                    <Typography variant="h4" gutterBottom color="primary">
                      Aggregate: {formatValue(property.aggregate)}
                    </Typography>
                  )}
                  <Button
                    onClick={() => togglePropertyExpansion(property.type)}
                    endIcon={expandedProperties[property.type] ? <ExpandLess /> : <ExpandMore />}
                  >
                    {expandedProperties[property.type] ? 'Hide' : 'Show'} Measurements
                  </Button>
                  <Collapse in={expandedProperties[property.type]}>
                    <TableContainer component={Paper} sx={{ mt: 2 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Value</TableCell>
                            <TableCell>Metadata</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {property.all_measurements?.map((measurement, mIndex) => (
                            <TableRow key={mIndex}>
                              <TableCell>{formatValue(measurement.value)}</TableCell>
                              <TableCell>
                                {measurement.metadata.misc && (
                                  <ul style={{ margin: 0, paddingInlineStart: '20px' }}>
                                    {Object.entries(measurement.metadata.misc).map(([key, value]) => (
                                      <li key={key}>
                                        {key}: {JSON.stringify(value)}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Collapse>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};
