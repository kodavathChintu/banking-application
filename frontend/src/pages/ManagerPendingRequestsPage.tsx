import { useState, useEffect } from 'react';
import { managerApi } from '../services/api';
import {
  UserCheck,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Building2,
  RefreshCw,
} from 'lucide-react';
import type { AccountOpeningRequest } from '../types';

export default function ManagerPendingRequestsPage() {
  const [requests, setRequests] = useState<AccountOpeningRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [approving, setApproving] = useState<number | null>(null);

  useEffect(() => {
    loadPendingRequests();
  }, []);

  const loadPendingRequests = async () => {
    setLoading(true);
    try {
      const data = await managerApi.getPendingRequests();
      setRequests(data);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId: number) => {
    setApproving(requestId);
    try {
      await managerApi.approveRequest(requestId);
      setRequests(requests.filter((r) => r.requestId !== requestId));
    } catch (err: any) {
      const errorMessage = err?.data?.message || err?.message || 'Failed to approve request';
      setError(errorMessage);
    } finally {
      setApproving(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Pending Requests</h1>
          <p className="text-slate-600 mt-1">
            Review and approve account opening requests
          </p>
        </div>
        <button
          onClick={loadPendingRequests}
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

      {requests.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-12 text-center">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-emerald-500" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            All Caught Up!
          </h3>
          <p className="text-slate-500 max-w-md mx-auto">
            There are no pending account opening requests at the moment. New requests will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request.requestId}
              className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 p-6 border border-slate-100"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <span className="text-xl font-bold text-white">
                      {request.customerName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-lg">
                      {request.customerName}
                    </h3>
                    <p className="text-slate-500">{request.email}</p>
                    <div className="flex flex-wrap gap-3 mt-2 text-sm">
                      <span className="flex items-center gap-1 text-slate-500">
                        <Building2 className="w-4 h-4" />
                        {request.bank?.bankName || 'N/A'}
                      </span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <Clock className="w-4 h-4" />
                        Contact: {request.mobileNumber}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium mb-2">
                      <Clock className="w-4 h-4" />
                      {request.requestStatus || 'Pending'}
                    </span>
                    <p className="text-sm text-slate-500">
                      {request.accountType} Account
                    </p>
                  </div>
                  <button
                    onClick={() => handleApprove(request.requestId)}
                    disabled={approving === request.requestId}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {approving === request.requestId ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <CheckCircle className="w-5 h-5" />
                    )}
                    Approve
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">
                    Contact Number
                  </p>
                  <p className="text-slate-700 font-medium">{request.contactNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">
                    Aadhaar Number
                  </p>
                  <p className="text-slate-700 font-medium font-mono">
                    {request.aadhaarNumber}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">
                    PAN Number
                  </p>
                  <p className="text-slate-700 font-medium font-mono uppercase">
                    {request.panNumber}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
