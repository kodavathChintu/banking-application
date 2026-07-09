import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { managerApi } from '../services/api';
import {
  Loader2,
  AlertCircle,
  ArrowLeft,
  Lock,
  Unlock,
} from 'lucide-react';

interface CustomerDetail {
  customerId: number;
  userId: number;
  fullName: string;
  email: string;
  mobileNumber: string;
  address: string;
  gender: string;
  bankName: string;
  accountNumber: string;
  accountStatus: string;
  balance: number;
}

export default function CustomerDetails() {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadCustomerDetails();
  }, [customerId]);

  const loadCustomerDetails = async () => {
    if (!customerId) return;
    setLoading(true);
    try {
      const data = await managerApi.getCustomerById(Number(customerId));
      // Normalize shapes: backend may return top-level fields or nested accounts array
      const normalized: any = {
        customerId: data.customerId ?? data.id,
        userId: data.userId ?? data.userID,
        fullName: data.fullName ?? data.customerName ?? '',
        email: data.email ?? data.userEmail ?? '',
        mobileNumber: data.mobileNumber ?? data.phone ?? '',
        address: data.address ?? '',
        gender: data.gender ?? '',
        bankName: data.bankName ?? (data.account?.bank?.bankName) ?? (data.accounts && data.accounts[0]?.bank?.bankName) ?? '',
        accountNumber: data.accountNumber ?? (data.accounts && data.accounts[0]?.accountNumber) ?? '',
        accountStatus: data.accountStatus ?? data.status ?? (data.accounts && data.accounts[0]?.accountStatus) ?? '',
        balance: data.balance ?? (data.accounts && data.accounts[0]?.balance) ?? 0,
      };

      setCustomer(normalized);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load customer details');
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async () => {
    if (!customerId) return;
    setActionLoading(true);
    try {
      await managerApi.deactivateCustomer(Number(customerId));
      // refresh from backend
      await loadCustomerDetails();
    } catch (err: any) {
      setError(err.message || 'Failed to deactivate customer');
    } finally {
      setActionLoading(false);
    }
  };

  const handleActivate = async () => {
    if (!customerId) return;
    setActionLoading(true);
    try {
      await managerApi.activateCustomer(Number(customerId));
      // refresh from backend to get authoritative status
      await loadCustomerDetails();
    } catch (err: any) {
      setError(err.message || 'Failed to activate customer');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-12 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-slate-500">Customer not found</p>
        </div>
      </div>
    );
  }

  const isActive = customer.accountStatus === 'ACTIVE' || customer.accountStatus === 'APPROVED';

  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 mb-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{customer.fullName}</h1>
            <p className="text-slate-600 mt-1">{customer.email}</p>
          </div>
          <div>
            {isActive ? (
              <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full font-semibold">
                Active
              </span>
            ) : (
              <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full font-semibold">
                Inactive
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <p className="text-slate-500 text-sm uppercase tracking-wider mb-1">Email</p>
            <p className="text-lg font-medium text-slate-900">{customer.email}</p>
          </div>
          <div>
            <p className="text-slate-500 text-sm uppercase tracking-wider mb-1">Mobile Number</p>
            <p className="text-lg font-medium text-slate-900">{customer.mobileNumber || 'N/A'}</p>
          </div>
          <div>
            <p className="text-slate-500 text-sm uppercase tracking-wider mb-1">Gender</p>
            <p className="text-lg font-medium text-slate-900">{customer.gender || 'N/A'}</p>
          </div>
          <div>
            <p className="text-slate-500 text-sm uppercase tracking-wider mb-1">Address</p>
            <p className="text-lg font-medium text-slate-900">{customer.address || 'N/A'}</p>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Bank Account Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-slate-500 text-sm uppercase tracking-wider mb-1">Bank</p>
              <p className="text-lg font-medium text-slate-900">{customer.bankName}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-slate-500 text-sm uppercase tracking-wider mb-1">Account Number</p>
              <p className="font-mono text-emerald-600 font-semibold">{customer.accountNumber}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-slate-500 text-sm uppercase tracking-wider mb-1">Balance</p>
              <p className="text-lg font-bold text-emerald-600">₹{customer.balance.toLocaleString()}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-slate-500 text-sm uppercase tracking-wider mb-1">Account Status</p>
              {customer.accountStatus === 'ACTIVE' ? (
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold inline-block">
                  Active
                </span>
              ) : (
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold inline-block">
                  {customer.accountStatus}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-8">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Account Actions</h3>
          <div className="flex gap-4">
            {isActive ? (
              <button
                onClick={handleDeactivate}
                disabled={actionLoading}
                className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 shadow-lg shadow-red-500/30"
              >
                {actionLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Lock className="w-5 h-5" />
                )}
                Deactivate Customer
              </button>
            ) : (
              <button
                onClick={handleActivate}
                disabled={actionLoading}
                className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-colors disabled:opacity-50 shadow-lg shadow-emerald-500/30"
              >
                {actionLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Unlock className="w-5 h-5" />
                )}
                Activate Customer
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
