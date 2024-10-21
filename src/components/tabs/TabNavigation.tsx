import React from 'react';
import { AppBar, Toolbar } from '@mui/material';
import { TabButton } from './TabButton';

interface TabNavigationProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

export function TabNavigation({ selectedTab, setSelectedTab }: TabNavigationProps) {
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
};
