import React from 'react';
import { AppBar, Toolbar } from '@mui/material';
import { TabButton } from './TabButton';
import { useNavigate } from 'react-router-dom';

interface TabNavigationProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

export function TabNavigation({ selectedTab, setSelectedTab }: TabNavigationProps) {
  const navigate = useNavigate();

  const onClickUI = () => {
    navigate('/');
    setSelectedTab('UI');
  }

  const onClickAPI = () => {
    navigate('/');
    setSelectedTab('API');
  }

  return (
    <AppBar position="static" sx={{ height: '15vh', width: '100%' }}>
      <Toolbar sx={{ height: '100%', justifyContent: 'center' }}>
        <TabButton 
          label="UI"
          isSelected={selectedTab === 'UI'}
          onClick={onClickUI}
        />
        <TabButton 
          label="API"
          isSelected={selectedTab === 'API'}
          onClick={onClickAPI}
        />
      </Toolbar>
    </AppBar>
  );
};
