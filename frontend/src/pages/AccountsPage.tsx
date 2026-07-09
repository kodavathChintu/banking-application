import { useEffect, useState } from 'react';
import { managerApi } from '../services/api';
import {
  Loader2,
  AlertCircle,
  Lock,
  Unlock,
  X,
  RefreshCw,
} from 'lucide-react';

interface Account {
  accountId: number;
  accountNumber: string;
  customerName: string;
  bankName: string;
  accountType: string;
  balance: number;
  accountStatus: string;
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    setLoading(true);
    try {
      const data = await managerApi.getAllAccounts();
      setAccounts(data);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleLockAccount = async (accountId: number) => {
    setActionLoading(accountId);
    try {
      await managerApi.lockAccount(accountId);
      setAccounts((prev) =>
        prev.map((a) =>
          a.accountId === accountId ? { ...a, accountStatus: 'LOCKED' } : a
        )
      );
    } catch (err: any) {
      setError(err.message || 'Failed to lock account');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnlockAccount = async (accountId: number) => {
    setActionLoading(accountId);
    try {
      await managerApi.unlockAccount(accountId);
      setAccounts((prev) =>
        prev.map((a) =>
          a.accountId === accountId ? { ...a, accountStatus: 'ACTIVE' } : a
        )
      );
    } catch (err: any) {
      setError(err.message || 'Failed to unlock account');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCloseAccount = async (accountId: number) => {
    if (!confirm('Are you sure you want to close this account? This action cannot be undone.')) {
      return;
    }
    setActionLoading(accountId);
    try {
      await managerApi.closeAccount(accountId);
      setAccounts((prev) =>
        prev.map((a) =>
          a.accountId === accountId ? { ...a, accountStatus: 'CLOSED' } : a
        )
      );
    } catch (err: any) {
      setError(err.message || 'Failed to close account');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'ACTIVE':
        return (
          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
            Active
          </span>
        );
      case 'LOCKED':
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
            Locked
          </span>
        );
      case 'CLOSED':
        return (
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
            Closed
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold">
            {status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Accounts</h1>
          <p className="text-slate-600 mt-1">Manage all customer accounts</p>
        </div>
        <button
          onClick={loadAccounts}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {accounts.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-12 text-center">
          <p className="text-slate-500">No accounts found</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Account Number
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Bank
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Balance
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {accounts.map((account) => (
                  <tr key={account.accountId} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-slate-700">{account.accountNumber}</td>
                    <td className="px-6 py-4 text-sm text-slate-700 font-medium">{account.customerName}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{account.bankName}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{account.accountType}</td>
                    <td className="px-6 py-4 text-sm text-slate-700 font-medium">₹{account.balance.toLocaleString()}</td>
                    <td className="px-6 py-4">{getStatusBadge(account.accountStatus)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {account.accountStatus.toUpperCase() === 'ACTIVE' && (
                          <>
                            <button
                              onClick={() => handleLockAccount(account.accountId)}
                              disabled={actionLoading === account.accountId}
                              className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Lock Account"
                            >
                              {actionLoading === account.accountId ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Lock className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => handleCloseAccount(account.accountId)}
                              disabled={actionLoading === account.accountId}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Close Account"
                            >
                              {actionLoading === account.accountId ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <X className="w-4 h-4" />
                              )}
                            </button>
                          </>
                        )}
                        {account.accountStatus.toUpperCase() === 'LOCKED' && (
                          <button
                            onClick={() => handleUnlockAccount(account.accountId)}
                            disabled={actionLoading === account.accountId}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Unlock Account"
                          >
                            {actionLoading === account.accountId ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Unlock className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
