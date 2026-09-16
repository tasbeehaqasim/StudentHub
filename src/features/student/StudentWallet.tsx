import React, { useState, useEffect } from 'react';
import { StudentUser, WalletTransaction } from '../../types';
import { db } from '../../services/db';
import { Modal } from '../../components/common/Modal';
import {
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  RotateCcw,
  CreditCard,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface StudentWalletProps {
  student: StudentUser;
}

export const StudentWallet: React.FC<StudentWalletProps> = ({ student }) => {
  const [balance, setBalance] = useState(student.walletBalance);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [topUpModalOpen, setTopUpModalOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState<number>(1000);
  const [paymentChannel, setPaymentChannel] = useState<'BANK_CARD' | 'EASYPAISA' | 'JAZZCASH'>('BANK_CARD');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const refresh = () => {
      const s = db.getStudentById(student.id);
      if (s) setBalance(s.walletBalance);
      setTransactions(db.getWalletTransactions(student.id));
    };
    refresh();
    const unsub = db.subscribe(refresh);
    return unsub;
  }, [student.id]);

  const handleTopUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topUpAmount <= 0) return;

    setIsProcessing(true);
    setTimeout(() => {
      db.topUpWallet(
        student.id,
        topUpAmount,
        `Digital Top-Up via ${paymentChannel.replace('_', ' ')}`
      );
      setIsProcessing(false);
      setSuccessMessage(`Successfully added Rs. ${topUpAmount.toLocaleString()} to your Campus Wallet!`);
      setTimeout(() => {
        setSuccessMessage('');
        setTopUpModalOpen(false);
      }, 1200);
    }, 500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-['Outfit']">
          Campus Digital Wallet
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Instant contactless dining payments with zero cash queue delays.
        </p>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-stone-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
            <Wallet className="w-4 h-4 text-amber-500" />
            <span>Available Balance</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-5xl font-extrabold font-['Outfit'] text-white">
              Rs. {balance.toLocaleString()}
            </span>
            <span className="text-xs text-amber-400 font-semibold font-mono">PKR</span>
          </div>

          <p className="text-xs text-stone-400 mt-2">
            Linked to University Enrollment ID: <span className="font-mono text-stone-200">{student.enrollmentId}</span>
          </p>
        </div>

        <div className="flex sm:flex-col gap-2">
          <button
            onClick={() => setTopUpModalOpen(true)}
            className="flex-1 sm:flex-none py-3 px-6 bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Money / Top Up</span>
          </button>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
        <h3 className="font-bold text-stone-900 text-base font-['Outfit'] pb-2 border-b border-stone-100">
          Transaction History
        </h3>

        {transactions.length === 0 ? (
          <div className="py-8 text-center text-stone-400 text-xs">
            No transactions found yet.
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {transactions.map((t) => {
              const isCredit = t.type === 'TOP_UP' || t.type === 'REFUND';
              return (
                <div key={t.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        t.type === 'TOP_UP'
                          ? 'bg-emerald-50 text-emerald-600'
                          : t.type === 'REFUND'
                          ? 'bg-blue-50 text-blue-600'
                          : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {t.type === 'TOP_UP' ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : t.type === 'REFUND' ? (
                        <RotateCcw className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>

                    <div>
                      <p className="text-xs font-bold text-stone-900">{t.description}</p>
                      <p className="text-[11px] text-stone-400">
                        {new Date(t.createdAt).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-extrabold font-mono ${
                      isCredit ? 'text-emerald-700' : 'text-stone-900'
                    }`}
                  >
                    {isCredit ? '+' : '-'} Rs. {t.amount.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Top Up Modal */}
      <Modal
        isOpen={topUpModalOpen}
        onClose={() => {
          setTopUpModalOpen(false);
          setSuccessMessage('');
        }}
        title="Top Up Campus Wallet"
        subtitle="Add funds to your dining wallet instantly"
        maxWidth="sm"
      >
        {successMessage ? (
          <div className="p-6 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <p className="font-bold text-stone-900 text-sm">{successMessage}</p>
          </div>
        ) : (
          <form onSubmit={handleTopUpSubmit} className="space-y-4">
            {/* Presets */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Quick Select Amount (PKR)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[500, 1000, 2000, 5000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setTopUpAmount(amt)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                      topUpAmount === amt
                        ? 'bg-amber-600 text-white border-amber-600'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    Rs. {amt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Custom Amount (Rs.)
              </label>
              <input
                type="number"
                min="100"
                step="100"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm font-bold font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Payment Method Channels */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Payment Channel
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'BANK_CARD', label: 'Debit / Card', icon: <CreditCard className="w-4 h-4" /> },
                  { id: 'EASYPAISA', label: 'EasyPaisa', icon: <Smartphone className="w-4 h-4" /> },
                  { id: 'JAZZCASH', label: 'JazzCash', icon: <Smartphone className="w-4 h-4" /> }
                ].map((channel) => (
                  <button
                    key={channel.id}
                    type="button"
                    onClick={() => setPaymentChannel(channel.id as any)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-colors ${
                      paymentChannel === channel.id
                        ? 'bg-amber-50 border-amber-500 text-amber-900 font-bold'
                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    {channel.icon}
                    <span>{channel.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing || topUpAmount <= 0}
              className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-md transition-colors disabled:opacity-50 mt-2"
            >
              {isProcessing
                ? 'Processing Top Up...'
                : `Confirm & Add Rs. ${topUpAmount.toLocaleString()}`}
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
};
