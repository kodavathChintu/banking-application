import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { managerApi } from '../services/api';
import {
  Loader2,
  AlertCircle,
  Eye,
  Lock,
  Unlock,
  RefreshCw,
} from 'lucide-react';

interface Customer {
  customerId: number;
  userId: number;
  fullName: string;
  email: string;
  mobileNumber?: string;
  bankName: string;
  accountStatus: string;
}

export default function CustomersPage() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    void loadCustomers();
  }, [sort]);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const data = await managerApi.getCustomers(sort);
      // Normalize backend shape: some responses use customerName/status
      const normalized = (data || []).map((d: any) => ({
        customerId: d.customerId,
        userId: d.userId ?? d.userID ?? 0,
        fullName: d.fullName ?? d.customerName ?? '',
        email: d.email ?? d.userEmail ?? '',
        mobileNumber: d.mobileNumber ?? d.phone ?? '',
        bankName: d.bankName ?? (d.bank?.bankName) ?? '',
        accountStatus: d.accountStatus ?? d.status ?? (d.active ? 'ACTIVE' : 'INACTIVE'),
      }));

      setCustomers(normalized);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (customerId: number) => {
    navigate(`/manager/customer/${customerId}`);
  };

  const handleDeactivate = async (customerId: number) => {
    setActionLoading(customerId);
    try {
      await managerApi.deactivateCustomer(customerId);
      // reload from server to get authoritative status
      await loadCustomers();
    } catch (err: any) {
      setError(err.message || 'Failed to deactivate customer');
    } finally {
      setActionLoading(null);
    }
  };

  const handleActivate = async (customerId: number) => {
    setActionLoading(customerId);
    try {
      await managerApi.activateCustomer(customerId);
      // reload list to reflect backend status
      await loadCustomers();
    } catch (err: any) {
      setError(err.message || 'Failed to activate customer');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const isActive = status === 'ACTIVE' || status === 'APPROVED' || status === 'ACTIVE_APPROVED';
    return isActive ? (
      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">Active</span>
    ) : (
      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">Inactive</span>
    );
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
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Customers</h1>
          <p className="text-slate-600 mt-1">Manage all customers and their accounts</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm focus:border-emerald-500 focus:outline-none"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="az">Name (A - Z)</option>
            <option value="za">Name (Z - A)</option>
          </select>
          <button
            onClick={() => void loadCustomers()}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {customers.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-12 text-center">
          <p className="text-slate-500">No customers found</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Bank
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
                {customers.map((customer) => (
                  <tr key={customer.customerId} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-700">{customer.customerId}</td>
                    <td className="px-6 py-4 text-sm text-slate-700 font-medium">{customer.fullName}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{customer.email}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{customer.bankName}</td>
                    <td className="px-6 py-4">{getStatusBadge(customer.accountStatus)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetails(customer.customerId)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {(customer.accountStatus === 'ACTIVE' || customer.accountStatus === 'APPROVED') ? (
                          <button
                            onClick={() => handleDeactivate(customer.customerId)}
                            disabled={actionLoading === customer.customerId}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Deactivate"
                          >
                            {actionLoading === customer.customerId ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Lock className="w-4 h-4" />
                            )}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleActivate(customer.customerId)}
                            disabled={actionLoading === customer.customerId}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Activate"
                          >
                            {actionLoading === customer.customerId ? (
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
