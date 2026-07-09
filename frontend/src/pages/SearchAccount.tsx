import { useState } from 'react';
import { managerApi, transactionApi } from '../services/api';
import {
  AlertCircle,
  Loader2,
  Search,
  Building2,
  Wallet,
} from 'lucide-react';

interface AccountSearchResult {
  accountId: number;
  accountNumber: string;
  customerName: string;
  bankName: string;
  balance: number;
  accountStatus: string;
  accountType: string;
}

export default function SearchAccount() {
  const [searchTerm, setSearchTerm] = useState('');
  const [result, setResult] = useState<AccountSearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setSearched(false);

    if (!searchTerm.trim()) {
      setError('Please enter an account number');
      return;
    }

    setLoading(true);
    try {
      const data = await managerApi.getAccountByNumber(searchTerm.trim());
      setResult(data);
      setSearched(true);
    } catch (err: any) {
      setError(err.message || 'Account not found');
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = async () => {
    try {
      if (!searchTerm.trim()) {
        alert('Please enter an account number');
        return;
      }

      const pdfBuffer = await transactionApi.downloadStatement(searchTerm.trim());
      const url = window.URL.createObjectURL(new Blob([pdfBuffer], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Statement.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      alert('Unable to download PDF');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'ACTIVE':
        return 'text-emerald-600';
      case 'LOCKED':
        return 'text-yellow-600';
      case 'CLOSED':
        return 'text-red-600';
      default:
        return 'text-slate-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'ACTIVE':
        return (
          <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full font-semibold">
            Active
          </span>
        );
      case 'LOCKED':
        return (
          <span className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full font-semibold">
            Locked
          </span>
        );
      case 'CLOSED':
        return (
          <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full font-semibold">
            Closed
          </span>
        );
      default:
        return (
          <span className="px-4 py-2 bg-slate-100 text-slate-700 rounded-full font-semibold">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Search Account</h1>
        <p className="text-slate-600 mt-1">Find account details by account number</p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 mb-8">
        <form onSubmit={handleSearch} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Account Number
            </label>
            <div className="relative">
              <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter account number (e.g., ACC1782573686553)"
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Search Account
              </>
            )}
          </button>
          <button
            type="button"
            onClick={downloadPdf}
            className="w-full mt-3 py-3 bg-red-600 text-white font-semibold rounded-xl shadow-lg hover:bg-red-700 transition-all flex items-center justify-center gap-2"
          >
            Download Statement
          </button>
        </form>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {searched && !result && !error && (
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 text-center">
          <p className="text-slate-500">No results found for "{searchTerm}"</p>
        </div>
      )}

      {result && (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-sm uppercase tracking-wider text-slate-400 mb-1">Customer Name</h2>
              <p className="text-2xl font-bold mb-6">{result.customerName}</p>

              <h3 className="text-sm uppercase tracking-wider text-slate-400 mb-1">Account Number</h3>
              <p className="font-mono text-lg text-emerald-400 mb-6">{result.accountNumber}</p>

              <h3 className="text-sm uppercase tracking-wider text-slate-400 mb-1">Bank</h3>
              <div className="flex items-center gap-2 mb-6">
                <Building2 className="w-5 h-5 text-emerald-400" />
                <p className="text-lg font-semibold">{result.bankName}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm uppercase tracking-wider text-slate-400 mb-1">Account Type</h3>
              <p className="text-lg font-semibold mb-6">{result.accountType}</p>

              <h3 className="text-sm uppercase tracking-wider text-slate-400 mb-1">Balance</h3>
              <p className="text-2xl font-bold text-emerald-400 mb-6">₹{result.balance.toLocaleString()}</p>

              <h3 className="text-sm uppercase tracking-wider text-slate-400 mb-2">Status</h3>
              {getStatusBadge(result.accountStatus)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
