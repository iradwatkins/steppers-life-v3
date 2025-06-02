
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import BottomNavPWA from './BottomNavPWA';

const AppLayout = () => {
  return (
    <div className="app-layout flex flex-col min-h-screen bg-background-main">
      <Header />
      <main className="main-content flex-grow pb-16 md:pb-0">
        <Outlet />
      </main>
      <BottomNavPWA />
    </div>
  );
};

export default AppLayout;
