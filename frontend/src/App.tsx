import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './app/routes';
import { useEffect, useState } from 'react';
import { useAuthStore } from './features/auth/store/authStore';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { SecretAdminModal } from './components/ui/SecretAdminModal';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

function App() {
  const { checkAuth } = useAuthStore();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Wait for auth check to complete before rendering routes
    checkAuth().finally(() => {
      setIsInitializing(false);
    });
  }, []);

  if (isInitializing) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <SecretAdminModal />
      <AnimatePresence mode="wait">
        <AppRoutes />
      </AnimatePresence>
    </BrowserRouter>
  );
}

export default App;
