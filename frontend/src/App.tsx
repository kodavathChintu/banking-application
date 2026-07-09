import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './components/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CustomerDashboard from './pages/CustomerDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import BanksPage from './pages/BanksPage';
import AccountOpeningPage from './pages/AccountOpeningPage';
import DepositPage from './pages/DepositPage';
import WithdrawPage from './pages/WithdrawPage';
import TransferPage from './pages/TransferPage';
import BalancePage from './pages/BalancePage';
import TransactionHistoryPage from './pages/TransactionHistoryPage';
import ManagerPendingRequestsPage from './pages/ManagerPendingRequestsPage';
import ProfilePage from "./pages/ProfilePage";
import CustomersPage from './pages/CustomersPage';
import CustomerDetails from './pages/CustomerDetails';
import AccountsPage from './pages/AccountsPage';
import SearchAccount from './pages/SearchAccount';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes with layout */}
          <Route element={<Layout />}>
            {/* Customer routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requiredRole="CUSTOMER">
                  <CustomerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute requiredRole="CUSTOMER">
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/banks"
              element={
                <ProtectedRoute>
                  <BanksPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account-opening"
              element={
                <ProtectedRoute requiredRole="CUSTOMER">
                  <AccountOpeningPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/deposit"
              element={
                <ProtectedRoute requiredRole="CUSTOMER">
                  <DepositPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/withdraw"
              element={
                <ProtectedRoute requiredRole="CUSTOMER">
                  <WithdrawPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/transfer"
              element={
                <ProtectedRoute requiredRole="CUSTOMER">
                  <TransferPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/balance"
              element={
                <ProtectedRoute requiredRole="CUSTOMER">
                  <BalancePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute requiredRole="CUSTOMER">
                  <TransactionHistoryPage />
                </ProtectedRoute>
              }
            />

            {/* Manager routes */}
            <Route
              path="/manager/dashboard"
              element={
                <ProtectedRoute requiredRole="MANAGER">
                  <ManagerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager/pending"
              element={
                <ProtectedRoute requiredRole="MANAGER">
                  <ManagerPendingRequestsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager/customers"
              element={
                <ProtectedRoute requiredRole="MANAGER">
                  <CustomersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager/customer/:customerId"
              element={
                <ProtectedRoute requiredRole="MANAGER">
                  <CustomerDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager/accounts"
              element={
                <ProtectedRoute requiredRole="MANAGER">
                  <AccountsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager/search-account"
              element={
                <ProtectedRoute requiredRole="MANAGER">
                  <SearchAccount />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
