import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BudgetProvider } from './context/BudgetContext';
import { EngagementBadgeProvider } from './context/EngagementBadgeContext';
import { Login } from './pages/Login';
import { Feed } from './pages/Feed';
import { Settings } from './pages/Settings';
import { Messages } from './pages/Messages';
import { Profile } from './pages/Profile';
import { ProtectedRoute } from './components/ProtectedRoute';

const AppRoutes: React.FC = () => {
  const { authState } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          authState.isAuthenticated ? <Navigate to="/" replace /> : <Login />
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Feed />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/:handle"

        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <BudgetProvider>
          <EngagementBadgeProvider>
            <AppRoutes />
          </EngagementBadgeProvider>
        </BudgetProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
