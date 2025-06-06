import { DarkModeProvider } from './contexts/DarkModeContext';
import { SnackbarProvider } from './contexts/SnackbarContext';
import { LoadingProvider } from './contexts/LoadingContext';
import Header from './components/Header';
import Loader from './components/Loader';

function App() {
  return (
    <DarkModeProvider>
      <SnackbarProvider>
        <LoadingProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Header />
           
          </div>
        </LoadingProvider>
      </SnackbarProvider>
    </DarkModeProvider>
  );
}

export default App;
