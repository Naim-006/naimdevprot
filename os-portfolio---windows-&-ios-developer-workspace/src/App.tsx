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

const DarkModeSetter: React.FC = () => {
  const { settings } = usePortfolio();
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);
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
      <DarkModeSetter />
      <PortfolioShell />
    </PortfolioProvider>
  );
}
