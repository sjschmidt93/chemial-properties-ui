import React from 'react';
import { Button } from '@mui/material';

interface TabButtonProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

export function TabButton({ label, isSelected, onClick }: TabButtonProps) {
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
};
