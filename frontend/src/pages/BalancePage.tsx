import { useState } from 'react';
import { transactionApi } from '../services/api';
import {
  Wallet,
  AlertCircle,
  Loader2,
  Search,
  TrendingUp,
} from 'lucide-react';

export default function BalancePage() {
  const [accountNumber, setAccountNumber] = useState('');
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleCheckBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const balance = await transactionApi.getBalance(accountNumber);
      setBalance(balance);
      setSearched(true);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch balance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Check Balance</h1>
        <p className="text-slate-600 mt-1">
          View your current account balance
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleCheckBalance} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Account Number
            </label>
            <div className="relative">
              <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                required
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none transition-colors"
                placeholder="Enter account number"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !accountNumber}
            className="w-full py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Check Balance
              </>
            )}
          </button>
        </form>

        {searched && balance !== null && (
          <div className="mt-8 pt-8 border-t border-slate-100">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full blur-2xl" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-slate-400 text-sm">Current Balance</p>
                  <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 rounded-full">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400 text-sm font-medium">Active</span>
                  </div>
                </div>
                <p className="text-4xl font-bold">
                  ₹{balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-slate-400 text-sm mt-2">
                  Account: {accountNumber}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
