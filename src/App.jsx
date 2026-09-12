import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { UploadPage } from './pages/UploadPage';
import { DashboardPage } from './pages/DashboardPage';
import { AgentPage } from './pages/AgentPage';
import { HistoryPage } from './pages/HistoryPage';
import { Toaster } from 'react-hot-toast';
import { useAgentStore } from './store/useAgentStore';
import { useThemeStore } from './store/useThemeStore';

export function App() {
  const { fetchStatus } = useAgentStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <div className="min-h-screen flex flex-col dark:bg-[#0B0F19] bg-[#F8FAFC] dark:text-slate-100 text-slate-800 font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      {/* Toast Notification Container */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: theme === 'dark' ? '#111827' : '#ffffff',
            color: theme === 'dark' ? '#f8fafc' : '#0f172a',
            border: theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0',
            borderRadius: '12px',
            fontSize: '13px',
            padding: '12px 16px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: theme === 'dark' ? '#111827' : '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#f43f5e',
              secondary: theme === 'dark' ? '#111827' : '#ffffff',
            },
          },
        }}
      />

      {/* Navigation Header */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<UploadPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/agent" element={<AgentPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
