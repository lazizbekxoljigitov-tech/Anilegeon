import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './app/routes';
import { useEffect, useState } from 'react';
import { useAuthStore } from './features/auth/store/authStore';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { SecretAdminModal } from './components/ui/SecretAdminModal';
import { AnimatePresence } from 'framer-motion';

function App() {
  const { checkAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    // Show splash screen for 3 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen key="loader" />}
      </AnimatePresence>
      <SecretAdminModal />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
