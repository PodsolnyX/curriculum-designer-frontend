import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from '@/app/App.tsx';
import { AuthProvider } from '@/app/providers/AuthProvider.tsx';
import { ThemeProvider } from '@/app/providers/ThemeProvider.tsx';
import { BrowserRouter } from 'react-router-dom';
import './app/styles/index.scss';
import QueryClientProvider from '@/shared/lib/api/queryClient.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <QueryClientProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
