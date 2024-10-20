import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { GlobalStyle } from './GlobalStyle';
import { theme } from './theme';
import { motion } from 'framer-motion';  // Importando framer-motion
import Navbar from './components/Navbar';

// Lazy loading para os componentes pesados
const Dashboard = React.lazy(() => import('./components/Dashboard'));
const Invoices = React.lazy(() => import('./pages/Invoices'));

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

// Configurações de animação para transição de páginas
const pageVariants = {
  initial: { opacity: 0, y: 50 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -50 },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5,
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Router>
        <Navbar />
        <AppContainer>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route
                path="/"
                element={
                  <motion.div
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}
                  >
                    <Navigate to="/dashboard" replace />
                  </motion.div>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <motion.div
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}
                  >
                    <Dashboard />
                  </motion.div>
                }
              />
              <Route
                path="/invoices"
                element={
                  <motion.div
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}
                  >
                    <Invoices />
                  </motion.div>
                }
              />
            </Routes>
          </Suspense>
        </AppContainer>
      </Router>
    </ThemeProvider>
  );
}

export default App;
