import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from "@/app/App.tsx";
import {AuthProvider} from "@/app/providers/AuthProvider.tsx";
import {queryClient} from "@/shared/lib/api/queryClient.ts";
import {QueryClientProvider} from "@tanstack/react-query";
import {ThemeProvider} from "@/app/providers/ThemeProvider.tsx";
import {BrowserRouter} from "react-router-dom";
import "./app/styles/index.scss"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <BrowserRouter>
          <ThemeProvider>
              <QueryClientProvider client={queryClient}>
                  <AuthProvider>
                      <App/>
                  </AuthProvider>
              </QueryClientProvider>
          </ThemeProvider>
      </BrowserRouter>
  </StrictMode>,
)
