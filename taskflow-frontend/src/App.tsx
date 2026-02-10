import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { TranslationProvider } from './contexts/TranslationContext';
import { WebSocketProvider } from './contexts/WebSocketContext';
import AuthPage from './pages/AuthPage';
import AuthCallback from './pages/AuthCallback';
import Dashboard from './pages/Dashboard';
import ProjetsPage from './pages/ProjetsPage';
import KanbanPage from './pages/KanbanPage';
import SettingsPage from './pages/SettingsPage';
import MesInvitations from './pages/MesInvitations';
import InvitationAccept from './pages/InvitationAccept';
import Layout from './components/Layout';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-900 border-t-transparent"></div>
      </div>
    );
  }

  return user ? (
    <WebSocketProvider>
      <Layout>{children}</Layout>
    </WebSocketProvider>
  ) : (
    <Navigate to="/auth" />
  );
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/auth" element={user ? <Navigate to="/dashboard" /> : <AuthPage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/projets"
        element={
          <PrivateRoute>
            <ProjetsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/projets/:projetId/taches"
        element={
          <PrivateRoute>
            <KanbanPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/mes-invitations"
        element={
          <PrivateRoute>
            <MesInvitations />
          </PrivateRoute>
        }
      />
      <Route
        path="/invitations/:token"
        element={<InvitationAccept />}
      />
      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <SettingsPage />
          </PrivateRoute>
        }
      />
      <Route path="/" element={<Navigate to={user ? "/dashboard" : "/auth"} />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <TranslationProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </TranslationProvider>
    </BrowserRouter>
  );
}

export default App;