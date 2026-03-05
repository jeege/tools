import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from '@/components/ui/toast';
import { Layout } from '@/components/Layout';
import { ClipboardPage } from '@/pages/Clipboard';
import { LoginPage } from '@/pages/Login';
import { TunnelPage } from '@/pages/Tunnel';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  return token ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <ClipboardPage />
              </Layout>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/tunnel"
            element={
              <Layout>
                <PrivateRoute>
                  <TunnelPage />
                </PrivateRoute>
              </Layout>
            }
          />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
