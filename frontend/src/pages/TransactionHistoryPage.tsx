import { useState } from 'react';
import { transactionApi } from '../services/api';
import {
  History,
  Wallet,
  AlertCircle,
  Loader2,
  Search,
  ArrowDownCircle,
  ArrowUpCircle,
  ArrowRightLeft,
} from 'lucide-react';
import type { Transaction } from '../types';

export default function TransactionHistoryPage() {
  const [accountNumber, setAccountNumber] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const size = 20;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      setPage(0);
      const response = await transactionApi.statement(accountNumber, 0, size);
      setTransactions(response.content || []);
      setTotalPages(response.totalPages || 0);
      setTotalElements(response.totalElements || 0);
      setSearched(true);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const loadTransactions = async (requestedPage: number) => {
    if (!accountNumber) return;
    setLoading(true);
    setError('');
    try {
      const response = await transactionApi.statement(accountNumber, requestedPage, size);
      setTransactions(response.content || []);
      setTotalPages(response.totalPages || 0);
      setTotalElements(response.totalElements || 0);
      setSearched(true);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case 'DEPOSIT':
        return <ArrowDownCircle className="w-5 h-5 text-emerald-500" />;
      case 'WITHDRAW':
        return <ArrowUpCircle className="w-5 h-5 text-amber-500" />;
      case 'TRANSFER':
        return <ArrowRightLeft className="w-5 h-5 text-blue-500" />;
      default:
        return <History className="w-5 h-5 text-slate-500" />;
    }
  };

  const getAmountColor = (type: string) => {
    switch (type.toUpperCase()) {
      case 'DEPOSIT':
        return 'text-emerald-500';
      case 'WITHDRAW':
        return 'text-amber-500';
      default:
        return 'text-blue-500';
    }
  };

  const getAmountPrefix = (type: string) => {
    switch (type.toUpperCase()) {
      case 'DEPOSIT':
        return '+';
      case 'WITHDRAW':
        return '-';
      default:
        return '';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Transaction History</h1>
        <p className="text-slate-600 mt-1">
          View all transactions for your account
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSearch} className="flex gap-4 mb-8">
          <div className="flex-1 relative">
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
          <button
            type="submit"
            disabled={loading || !accountNumber}
            className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
            Search
          </button>
        </form>

        {searched && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Transactions</h3>
              <span className="text-sm text-slate-500">
                {totalElements} transactions found
              </span>
            </div>

            {transactions.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <History className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-500">No transactions found</p>
                <p className="text-slate-400 text-sm mt-1">
                  This account has no transaction history yet
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div
                    key={tx.transactionId}
                    className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      {getTransactionIcon(tx.transactionType)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900">
                          {tx.transactionType}
                        </span>
                        {tx.remarks && (
                          <span className="text-sm text-slate-500 truncate">
                            - {tx.remarks}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500">
                        {formatDate(tx.transactionTime)}
                      </p>
                      {(tx.transactionType === 'TRANSFER' || tx.transactionType === 'DEPOSIT') && tx.receiverAccount && (
                        <p className="text-xs text-slate-400 mt-1">
                          To: {tx.receiverAccount}
                        </p>
                      )}
                      {tx.transactionType === 'WITHDRAW' && tx.senderAccount && (
                        <p className="text-xs text-slate-400 mt-1">
                          From: {tx.senderAccount}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-lg ${getAmountColor(tx.transactionType)}`}>
                        {getAmountPrefix(tx.transactionType)}₹
                        {tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-2">
                <button
                  disabled={page === 0}
                  onClick={() => {
                    const next = Math.max(0, page - 1);
                    setPage(next);
                    void loadTransactions(next);
                  }}
                  className="px-3 py-2 rounded border bg-white disabled:opacity-50"
                >
                  Previous
                </button>

                {/* Compact page list: show first, ellipsis, window, ellipsis, last */}
                {(() => {
                  const pages: number[] = [];
                  const show = 5; // window size
                  const half = Math.floor(show / 2);
                  let start = Math.max(0, page - half);
                  let end = Math.min(totalPages - 1, page + half);
                  if (end - start + 1 < show) {
                    start = Math.max(0, end - show + 1);
                    end = Math.min(totalPages - 1, start + show - 1);
                  }

                  if (start > 0) pages.push(0);
                  if (start > 1) pages.push(-1); // ellipsis marker
                  for (let p = start; p <= end; p++) pages.push(p);
                  if (end < totalPages - 2) pages.push(-2); // ellipsis marker end
                  if (end < totalPages - 1) pages.push(totalPages - 1);

                  return pages.map((p, idx) => {
                    if (p < 0) {
                      return (
                        <span key={`e-${idx}`} className="px-2 text-slate-500">...</span>
                      );
                    }

                    return (
                      <button
                        key={p}
                        onClick={() => {
                          setPage(p);
                          void loadTransactions(p);
                        }}
                        className={`px-3 py-2 rounded border ${p === page ? 'bg-emerald-500 text-white' : 'bg-white'}`}
                      >
                        {p + 1}
                      </button>
                    );
                  });
                })()}

                <button
                  disabled={page === totalPages - 1}
                  onClick={() => {
                    const next = Math.min(totalPages - 1, page + 1);
                    setPage(next);
                    void loadTransactions(next);
                  }}
                  className="px-3 py-2 rounded border bg-white disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
