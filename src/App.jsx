import React, { useEffect, useState } from 'react';
import { ToastProvider } from './components/ToastNotification';
import IjamOSWorkspace from './features/ijam-os/IjamOSWorkspace';

const getDeviceMode = () => {
  if (typeof window === 'undefined') return 'desktop';
  const width = window.innerWidth;
  if (width <= 640) return 'phone';
  if (width <= 1024) return 'tablet';
  return 'desktop';
};

const getIjamOsMode = (deviceMode) => {
  if (deviceMode === 'phone') return 'ios_phone';
  if (deviceMode === 'tablet') return 'ios_tablet';
  return 'mac_desktop';
};

const DEFAULT_USER = {
  id: 'local-builder',
  name: 'Local Builder',
  district: 'Selangor',
  idea_title: 'My Local IJAM Project',
  problem_statement: 'Building and testing KRACKED_OS standalone locally.',
  threads_handle: '',
  whatsapp_contact: '',
  discord_tag: '',
  about_yourself: '',
  program_goal: ''
};

export default function App() {
  const [deviceMode, setDeviceMode] = useState(getDeviceMode());
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const raw = localStorage.getItem('ijamos_profile');
      if (!raw) return DEFAULT_USER;
      return { ...DEFAULT_USER, ...JSON.parse(raw) };
    } catch {
      return DEFAULT_USER;
    }
  });

  useEffect(() => {
    const onResize = () => setDeviceMode(getDeviceMode());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    localStorage.setItem('ijamos_profile', JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <ToastProvider>
      <IjamOSWorkspace
        session={null}
        currentUser={currentUser}
        isMobileView={deviceMode !== 'desktop'}
        deviceMode={deviceMode}
        ijamOsMode={getIjamOsMode(deviceMode)}
        setPublicPage={() => {}}
        setCurrentUser={setCurrentUser}
      />
    </ToastProvider>
  );
}
