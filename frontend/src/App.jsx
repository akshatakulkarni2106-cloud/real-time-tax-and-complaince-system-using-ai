import { Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Nav         from './components/Nav';
import Landing     from './pages/Landing';
import Login       from './pages/Login';
import Onboarding  from './pages/Onboarding';
import Dashboard   from './pages/Dashboard';
import Chat        from './pages/Chat';
import Deadlines   from './pages/Deadlines';
import Checklist   from './pages/Checklist';
import Calculator  from './pages/Calculator';
import Schemes     from './pages/Schemes';
import Documents   from './pages/Documents';
import Profile     from './pages/Profile';
import TaxPredictor from './pages/taxpredictor';

function Protected({ children }) {
  const { token } = useApp();
  return token ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/"              element={<Landing />} />
        <Route path="/login"         element={<Login />} />
        <Route path="/onboarding"    element={<Protected><Onboarding /></Protected>} />
        <Route path="/dashboard"     element={<Protected><Dashboard /></Protected>} />
        <Route path="/chat"          element={<Protected><Chat /></Protected>} />
        <Route path="/deadlines"     element={<Protected><Deadlines /></Protected>} />
        <Route path="/checklist"     element={<Protected><Checklist /></Protected>} />
        <Route path="/calculator"    element={<Protected><Calculator /></Protected>} />
        <Route path="/schemes"       element={<Protected><Schemes /></Protected>} />
        <Route path="/documents"     element={<Protected><Documents /></Protected>} />
        <Route path="/profile"       element={<Protected><Profile /></Protected>} />
        <Route path="/tax-predictor" element={<Protected><TaxPredictor /></Protected>} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}