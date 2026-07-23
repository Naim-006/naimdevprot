import React, { useEffect } from 'react';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { DesktopView } from './components/os/DesktopView';
import { MobileView } from './components/os/MobileView';
import { LockScreen } from './components/os/LockScreen';

const DirSetter: React.FC = () => {
  const { langDir } = usePortfolio();
  useEffect(() => {
    document.documentElement.dir = langDir;
  }, [langDir]);
  return null;
};

const PortfolioShell: React.FC = () => {
  const { activeOSMode, isLocked } = usePortfolio();

  if (isLocked) return <LockScreen />;

  return activeOSMode === 'desktop' ? <DesktopView /> : <MobileView />;
};

export default function App() {
  return (
    <PortfolioProvider>
      <DirSetter />
      <PortfolioShell />
    </PortfolioProvider>
  );
}
