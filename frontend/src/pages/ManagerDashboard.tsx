import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { managerApi } from "../services/api";
import { Eye } from "lucide-react";

import {
  Loader2,
  Clock,
  CheckCircle,
  Building2,
  AlertCircle,
  UserCheck,
  Users,
  CreditCard,
} from "lucide-react";

interface AccountRequest {
  requestId: number;
  customerName: string;
  email: string;
  mobileNumber: string;
  accountType: string;
  requestStatus: string;
  aadhaarFileName: string;
}

interface DashboardStats {
  totalCustomers: number;
  totalAccounts: number;
  pendingRequests: number;
  approvedToday: number;
}

export default function ManagerDashboard() {
  const { user } = useAuth();

  const [requests, setRequests] = useState<AccountRequest[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    totalAccounts: 0,
    pendingRequests: 0,
    approvedToday: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [approving, setApproving] = useState<number | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboardData, requestsData] = await Promise.all([
        managerApi.getDashboard(),
        managerApi.getPendingRequests(),
      ]);
      
      setStats(dashboardData);
      setRequests(requestsData);
      setError("");
    } catch (err: any) {
      setError(err?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId: number) => {
    try {
      setApproving(requestId);

      await managerApi.approveRequest(requestId);

      setRequests((prev) =>
        prev.filter((r) => r.requestId !== requestId)
      );
    } catch (err: any) {
      setError(err?.message || "Failed to approve request");
    } finally {
      setApproving(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
            Pending
          </span>
        );

      case "approved":
        return (
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
            Approved
          </span>
        );

      default:
        return (
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
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

      {/* Header */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Manager Dashboard
        </h1>

        <p className="text-slate-600 mt-1">
          Welcome back, {user?.fullName?.split(" ")[0]}!
        </p>
      </div>

      {/* Stats Cards */}

      <div className="grid md:grid-cols-4 gap-6 mb-8">

        <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 p-6 border border-slate-100">
          <div className="flex items-center gap-4">

            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock className="text-yellow-600 w-6 h-6" />
            </div>

            <div>
              <p className="text-slate-500 text-sm">
                Pending Requests
              </p>

              <h2 className="text-3xl font-bold text-slate-900">
                {stats.pendingRequests}
              </h2>
            </div>

          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 p-6 border border-slate-100">
          <div className="flex items-center gap-4">

            <div className="bg-emerald-100 p-3 rounded-lg">
              <CheckCircle className="text-emerald-600 w-6 h-6" />
            </div>

            <div>
              <p className="text-slate-500 text-sm">
                Approved Today
              </p>

              <h2 className="text-3xl font-bold text-slate-900">
                {stats.approvedToday}
              </h2>
            </div>

          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 p-6 border border-slate-100">
          <div className="flex items-center gap-4">

            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="text-blue-600 w-6 h-6" />
            </div>

            <div>
              <p className="text-slate-500 text-sm">
                Total Customers
              </p>

              <h2 className="text-3xl font-bold text-slate-900">
                {stats.totalCustomers}
              </h2>
            </div>

          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 p-6 border border-slate-100">
          <div className="flex items-center gap-4">

            <div className="bg-purple-100 p-3 rounded-lg">
              <CreditCard className="text-purple-600 w-6 h-6" />
            </div>

            <div>
              <p className="text-slate-500 text-sm">
                Total Accounts
              </p>

              <h2 className="text-3xl font-bold text-slate-900">
                {stats.totalAccounts}
              </h2>
            </div>

          </div>
        </div>

      </div>

      {/* Error */}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Pending Requests */}

      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50">

        <div className="border-b border-slate-200 p-6 flex items-center gap-3">
          <UserCheck className="w-6 h-6 text-emerald-500" />
          <h2 className="font-semibold text-xl text-slate-900">
            Pending Account Opening Requests
          </h2>
        </div>

        {requests.length === 0 ? (

          <div className="text-center py-16">

            <CheckCircle className="mx-auto text-emerald-500 w-14 h-14" />

            <p className="mt-4 text-lg font-semibold text-slate-900">
              No Pending Requests
            </p>

            <p className="text-slate-500">
              All requests have been processed.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-slate-50 border-b border-slate-200">

                <tr>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-700 uppercase tracking-wider">Customer</th>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-700 uppercase tracking-wider">Email</th>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-700 uppercase tracking-wider">Mobile</th>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-700 uppercase tracking-wider">Account Type</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-700 uppercase tracking-wider">Aadhaar</th>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-700 uppercase tracking-wider">Status</th>

                  <th className="text-right px-6 py-4 text-xs font-semibold text-slate-700 uppercase tracking-wider">Action</th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-200">

                {requests.map((request) => (

                  <tr
                    key={request.requestId}
                    className="hover:bg-slate-50 transition-colors"
                  >

                    <td className="px-6 py-4 text-sm text-slate-700 font-medium">
                      {request.customerName}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {request.email}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-700">
                      {request.mobileNumber}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-700">
                      {request.accountType}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      <a
                        href={`http://localhost:9002/api/customer/aadhaar/${request.aadhaarFileName}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                      >
                        <Eye size={16} />
                        View
                      </a>
                    </td>

                    <td className="px-6 py-4">
                      {getStatusBadge(request.requestStatus)}
                    </td>

                    <td className="px-6 py-4 text-right">

                      <button
                        onClick={() =>
                          handleApprove(request.requestId)
                        }
                        disabled={
                          approving === request.requestId
                        }
                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 flex items-center gap-2 ml-auto transition-colors font-medium"
                      >
                        {approving === request.requestId ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}

                        Approve
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}