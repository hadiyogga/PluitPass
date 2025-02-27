import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import StudentsPage from './pages/StudentsPage';
import SettingsPage from './pages/SettingsPage';
import BackupPage from './pages/BackupPage';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import PrivateRoute from './components/PrivateRoute';
import './index.css';

function App() {
  useEffect(() => {
    // Load Google Font
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <div className="min-h-screen font-[Poppins]">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/admin" element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              } />
              <Route path="/admin/students" element={
                <PrivateRoute>
                  <StudentsPage />
                </PrivateRoute>
              } />
              <Route path="/admin/settings" element={
                <PrivateRoute>
                  <SettingsPage />
                </PrivateRoute>
              } />
              <Route path="/admin/backup" element={
                <PrivateRoute>
                  <BackupPage />
                </PrivateRoute>
              } />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
