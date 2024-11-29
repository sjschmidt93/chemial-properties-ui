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
  CircularProgress,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import { ExpandMore, ExpandLess, Search, OpenInNew, FilterList } from '@mui/icons-material';

export function ChemicalDetailPage() {
  const { inchiKey } = useParams<{ inchiKey: string }>();
  const [searchChemicalResponse, setSearchChemicalResponse] = useState<SearchChemicalsResponse>();
  const [loading, setLoading] = useState(true);
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
        setError('Failed to fetch chemical details. Please try again later.');
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

  if (!searchChemicalResponse) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          No data available
        </Typography>
      </Box>
    );
  }

  const { chemical, properties } = searchChemicalResponse;

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h4" gutterBottom color="primary">
            {chemical.name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {chemical.iupac_name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="body2" sx={{ mr: 2 }}>
              InChI Key: {chemical.inchi_key}
            </Typography>
            <Tooltip title="View on PubChem">
              <IconButton
                component={Link}
                href={`https://pubchem.ncbi.nlm.nih.gov/compound/${chemical.inchi_key}`}
                target="_blank"
                rel="noopener noreferrer"
                size="small"
              >
                <OpenInNew />
              </IconButton>
            </Tooltip>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Synonyms
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TextField
                variant="outlined"
                size="small"
                label="Filter synonyms"
                value={synonymFilter}
                onChange={(e) => setSynonymFilter(e.target.value)}
                InputProps={{
                  startAdornment: <Search color="action" sx={{ mr: 1 }} />,
                }}
                sx={{ flexGrow: 1, mr: 2 }}
              />
              <Tooltip title="Filter synonyms">
                <IconButton onClick={() => setSynonymFilter('')} size="small">
                  <FilterList />
                </IconButton>
              </Tooltip>
            </Box>
            <Paper variant="outlined" sx={{ p: 2, maxHeight: '200px', overflowY: 'auto' }}>
              {displayedSynonyms.map((synonym, index) => (
                <Chip key={index} label={synonym} sx={{ m: 0.5 }} />
              ))}
            </Paper>
            {filteredSynonyms.length > 10 && (
              <Button
                onClick={() => setShowAllSynonyms(!showAllSynonyms)}
                sx={{ mt: 1 }}
                variant="text"
              >
                {showAllSynonyms ? 'Show Less' : 'Show More'}
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom color="primary">
          Properties
        </Typography>
        <Grid container spacing={3}>
          {properties.map((property, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="secondary">
                    {property.type.charAt(0).toUpperCase() + property.type.slice(1).replace('_', ' ')}
                  </Typography>
                  {property.aggregate !== undefined && (
                    <Typography variant="h4" gutterBottom color="primary">
                      {formatValue(property.aggregate)}
                    </Typography>
                  )}
                  <Button
                    onClick={() => togglePropertyExpansion(property.type)}
                    endIcon={expandedProperties[property.type] ? <ExpandLess /> : <ExpandMore />}
                    variant="outlined"
                    size="small"
                    sx={{ mb: 2 }}
                  >
                    {expandedProperties[property.type] ? 'Hide' : 'Show'} Measurements
                  </Button>
                  <Collapse in={expandedProperties[property.type]}>
                    <TableContainer component={Paper} variant="outlined">
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
                                        <Typography variant="body2">
                                          <strong>{key}:</strong> {JSON.stringify(value)}
                                        </Typography>
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
}