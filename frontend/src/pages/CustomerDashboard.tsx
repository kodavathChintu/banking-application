import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { customerApi } from "../services/api";

import {
  ArrowDownCircle,
  ArrowUpCircle,
  ArrowRightLeft,
  Wallet,
  History,
  TrendingUp,
  CreditCard,
  Clock,
} from "lucide-react";

export default function CustomerDashboard() {
  const { user } = useAuth();

  const [accounts, setAccounts] = useState<any[]>([]);
  const [activeAccount, setActiveAccount] = useState<any>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const readStoredBankId = () => Number(localStorage.getItem('bankId') || localStorage.getItem('selectedBankId') || '1');

  const persistSelectedBankId = (bankId: number | string | null | undefined) => {
    const normalizedBankId = Number(bankId || 1);
    localStorage.setItem('bankId', String(normalizedBankId));
    localStorage.setItem('selectedBankId', String(normalizedBankId));
    return normalizedBankId;
  };

  useEffect(() => {
    if (!user) return;

    void loadProfile();
  }, [user]);

  useEffect(() => {
    const handleBankSelectionChange = () => {
      void loadProfile();
    };

    window.addEventListener('bank-selection-changed', handleBankSelectionChange);
    return () => window.removeEventListener('bank-selection-changed', handleBankSelectionChange);
  }, [user]);

  const loadProfile = async () => {
    try {
      console.log("Loading profile for user:", user?.userId);

      const savedBankId = readStoredBankId();
      const data = await customerApi.getProfile(user!.userId, savedBankId);

      console.log("PROFILE =", data);

      const normalizedAccounts = Array.isArray(data?.accounts) ? data.accounts : [];
      const selectedAccountNumber = localStorage.getItem('selectedAccountNumber');
      const primaryAccount =
        normalizedAccounts.find((account: any) => account.accountNumber === selectedAccountNumber) ||
        normalizedAccounts[0] ||
        data ||
        null;

      const resolvedBankId = primaryAccount?.bank?.bankId || primaryAccount?.bankId || savedBankId || 1;
      persistSelectedBankId(resolvedBankId);

      setProfileData(data);
      setAccounts(normalizedAccounts);
      setActiveAccount(primaryAccount);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!accounts.length) {
      return;
    }

    const selectedAccountNumber = localStorage.getItem('selectedAccountNumber');
    const selectedAccount =
      accounts.find((account) => account.accountNumber === selectedAccountNumber) ||
      accounts[0] ||
      null;

    setActiveAccount((currentAccount: any) => {
      if (!selectedAccount) return currentAccount;
      if (currentAccount?.accountNumber === selectedAccount.accountNumber) {
        return currentAccount;
      }
      return selectedAccount;
    });
  }, [accounts]);

  const downloadPdf = async () => {
    try {
      const accountNumber = activeAccount?.accountNumber;
      if (!accountNumber) {
        alert('No account selected');
        return;
      }

      const pdfBuffer = await (await import('../services/api')).transactionApi.downloadStatement(accountNumber);

      const url = window.URL.createObjectURL(new Blob([pdfBuffer], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'BankStatement.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      alert('Unable to download PDF');
    }
  };

  const quickActions = [
    {
      icon: ArrowDownCircle,
      label: "Deposit",
      to: "/deposit",
      color: "from-emerald-400 to-emerald-600",
      desc: "Add money to account",
    },
    {
      icon: ArrowUpCircle,
      label: "Withdraw",
      to: "/withdraw",
      color: "from-amber-400 to-orange-500",
      desc: "Cash out funds",
    },
    {
      icon: ArrowRightLeft,
      label: "Transfer",
      to: "/transfer",
      color: "from-blue-400 to-indigo-500",
      desc: "Send to another account",
    },
    {
      icon: Wallet,
      label: "Check Balance",
      to: "/balance",
      color: "from-teal-400 to-cyan-500",
      desc: "View your balance",
    },
  ];

  const applicationStatus = profileData?.requestStatus?.toUpperCase() || activeAccount?.requestStatus?.toUpperCase() || "PENDING";
  const accountStatus = activeAccount?.accountStatus?.toUpperCase() || "PENDING";
  const lastUpdated = activeAccount?.updatedAt
    ? new Date(activeAccount.updatedAt).toLocaleDateString()
    : activeAccount?.requestStatus?.toUpperCase() === 'APPROVED'
    ? 'Approved'
    : new Date().toLocaleDateString();

  if (loading) {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-lg font-semibold">
        Loading Profile...
      </div>
    </div>
  );
}
  return (
    
    <div className="max-w-6xl mx-auto w-full">
      {/* Debug info */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-blue-700 text-sm">
        User: {user?.fullName} | Role: {user?.role} | Email: {user?.email}
      </div>

      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Welcome back, {user?.fullName?.split(' ')[0]}!
        </h1>
        <p className="text-slate-600 mt-1">
          Here's your financial overview
        </p>
      </div>

      <div className="mb-8">
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-slate-400 text-sm uppercase tracking-wider mb-1">
                    Account Balance
                  </p>
                  <h2 className="text-5xl font-bold">
                    ₹{(activeAccount?.balance ?? 0).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </h2>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-full">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 text-sm font-medium">
                    {accountStatus}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <CreditCard className="w-6 h-6 text-slate-400 mb-2" />
                  <p className="text-slate-400 text-xs mb-1">Account Type</p>
                  <p className="font-semibold">{activeAccount?.accountType ?? "--"}</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <Clock className="w-6 h-6 text-slate-400 mb-2" />
                  <p className="text-slate-400 text-xs mb-1">Last Updated</p>
                  <p className="font-semibold">{lastUpdated}</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <ArrowDownCircle className="w-6 h-6 text-emerald-400 mb-2" />
                  <p className="text-slate-400 text-xs mb-1">This Month In</p>
                  <p className="font-semibold text-emerald-400">₹0.00</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <ArrowUpCircle className="w-6 h-6 text-amber-400 mb-2" />
                  <p className="text-slate-400 text-xs mb-1">This Month Out</p>
                  <p className="font-semibold text-amber-400">₹0.00</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">My Account Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-slate-500 text-sm">Application Status</p>
                <p className="text-lg font-semibold">{applicationStatus}</p>
              </div>
              <div>
                <p className="text-slate-500 text-sm">Account Status</p>
                <p className="text-lg font-semibold">{accountStatus}</p>
              </div>
              <div>
                <p className="text-slate-500 text-sm">Account Number</p>
                <p className="text-lg font-semibold">{activeAccount?.accountNumber || "Not Generated"}</p>
                <div className="mt-3">
                  <button
                    onClick={downloadPdf}
                    className="btn btn-success px-4 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600"
                  >
                    Download PDF
                  </button>
                </div>
              </div>
              <div>
                <p className="text-slate-500 text-sm">Account Type</p>
                <p className="text-lg font-semibold">{activeAccount?.accountType ?? "--"}</p>
              </div>
              <div>
                <p className="text-slate-500 text-sm">Bank Name</p>
                <p className="text-lg font-semibold">{activeAccount?.bank?.bankName || activeAccount?.bankName || "--"}</p>
              </div>
              <div>
                <p className="text-slate-500 text-sm">IFSC Code</p>
                <p className="text-lg font-semibold">{activeAccount?.bank?.ifscCode || activeAccount?.ifscCode || "--"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <Link
                key={i}
                to={action.to}
                className="group bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
              >
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-200`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h4 className="font-semibold text-slate-900 mb-1">{action.label}</h4>
                <p className="text-sm text-slate-500">{action.desc}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Transactions Preview */}
      <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="p-6 flex items-center justify-between border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">Recent Transactions</h3>
          <Link
            to="/history"
            className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium"
          >
            View All
            <History className="w-4 h-4" />
          </Link>
        </div>
        <div className="p-12 text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <History className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-500">No transactions yet</p>
          <p className="text-slate-400 text-sm mt-1">
            Your recent activity will appear here
          </p>
        </div>
      </div>
    </div>
  );
}
