import { useState } from 'react';
import { transactionApi } from '../services/api';
import {
  ArrowRightLeft,
  Wallet,
  AlertCircle,
  Loader2,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';

export default function TransferPage() {
  const [formData, setFormData] = useState({
    senderAccountNumber: '',
    receiverAccountNumber: '',
    amount: '',
    remarks: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await transactionApi.transfer({
        senderAccountNumber: formData.senderAccountNumber,
        receiverAccountNumber: formData.receiverAccountNumber,
        amount: parseFloat(formData.amount),
        remarks: formData.remarks || undefined,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Transfer Successful!
          </h2>
          <p className="text-slate-600 mb-6">
            ₹{formData.amount} has been transferred from {formData.senderAccountNumber} to{' '}
            {formData.receiverAccountNumber}
          </p>
          <button
            onClick={() => {
              setSuccess(false);
              setFormData({
                senderAccountNumber: '',
                receiverAccountNumber: '',
                amount: '',
                remarks: '',
              });
            }}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-xl shadow-lg shadow-blue-500/30"
          >
            Make Another Transfer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Transfer Money</h1>
        <p className="text-slate-600 mt-1">
          Send money to another bank account
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Your Account Number
            </label>
            <div className="relative">
              <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                required
                value={formData.senderAccountNumber}
                onChange={(e) =>
                  setFormData({ ...formData, senderAccountNumber: e.target.value })
                }
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none transition-colors"
                placeholder="Enter your account number"
              />
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <ArrowRight className="w-5 h-5 text-blue-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Recipient Account Number
            </label>
            <div className="relative">
              <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                required
                value={formData.receiverAccountNumber}
                onChange={(e) =>
                  setFormData({ ...formData, receiverAccountNumber: e.target.value })
                }
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none transition-colors"
                placeholder="Enter recipient's account number"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">
                ₹
              </span>
              <input
                type="number"
                required
                min="0.01"
                step="0.01"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none transition-colors"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Remarks (Optional)
            </label>
            <input
              type="text"
              value={formData.remarks}
              onChange={(e) =>
                setFormData({ ...formData, remarks: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none transition-colors"
              placeholder="Add a note for this transfer"
            />
          </div>

          <button
            type="submit"
            disabled={
              loading ||
              !formData.senderAccountNumber ||
              !formData.receiverAccountNumber ||
              !formData.amount
            }
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <ArrowRightLeft className="w-5 h-5" />
                Transfer
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
