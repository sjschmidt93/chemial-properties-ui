import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

export function APIPage() {
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
};
