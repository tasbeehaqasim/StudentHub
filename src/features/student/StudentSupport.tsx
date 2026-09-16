import React, { useState } from 'react';
import { StudentUser } from '../../types';
import { db } from '../../services/db';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Send,
  CheckCircle2,
  Clock,
  PhoneCall,
  Mail,
  ShieldCheck
} from 'lucide-react';

interface StudentSupportProps {
  student: StudentUser;
}

export const StudentSupport: React.FC<StudentSupportProps> = ({ student }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('Order Issue');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSent, setTicketSent] = useState(false);

  const faqs = [
    {
      q: 'How does pickup work with my 4-digit code?',
      a: 'When you arrive at the designated cafeteria counter at your scheduled pickup slot, show your 4-digit verification code to the counter staff. The staff enters the code on their terminal to instantly verify and hand over your freshly packed order.'
    },
    {
      q: 'What happens if my lecture runs late and I miss my slot?',
      a: 'Your meal is kept heated in the holding cabinet for up to 25 minutes after your slot ends. If you do not collect it within that window, the kitchen marks the order as No-Show to free up shelf space.'
    },
    {
      q: 'Can I cancel an order and receive an automatic refund?',
      a: 'You can cancel any pre-order before the kitchen begins cooking (statuses: Placed, Payment Confirmed, Accepted). If paid via Campus Wallet, the full amount is immediately credited back to your balance.'
    },
    {
      q: 'How do I top up my Campus Digital Wallet?',
      a: 'Go to the Wallet tab and click "Add Money / Top Up". You can choose from quick presets (Rs. 500, 1000, 2000, 5000) using debit cards, EasyPaisa, or JazzCash.'
    },
    {
      q: 'Are custom dietary instructions supported?',
      a: 'Yes! When adding any dish to your cart, click Details to enter special instructions like "Less spicy", "No onions", or "Extra chutney".'
    }
  ];

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketMessage.trim()) return;

    db.addAuditLog(
      'STUDENT_TICKET',
      student.id,
      `Support ticket submitted by ${student.fullName} (${student.enrollmentId}): [${ticketCategory}] ${ticketSubject}`,
      { category: ticketCategory, message: ticketMessage }
    );

    setTicketSent(true);
    setTimeout(() => {
      setTicketSent(false);
      setTicketSubject('');
      setTicketMessage('');
    }, 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-['Outfit']">
          Help & Cafeteria Support
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Frequently asked questions, counter operating hours, and direct inquiries.
        </p>
      </div>

      {/* Operating Hours & Counter Info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs">
          <Clock className="w-5 h-5 text-amber-600 mb-2" />
          <h4 className="font-bold text-xs text-stone-900">Operating Hours</h4>
          <p className="text-xs text-stone-500 mt-0.5">8:00 AM – 7:30 PM (Mon–Fri)</p>
          <p className="text-[11px] text-stone-400">9:00 AM – 4:00 PM (Sat)</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs">
          <PhoneCall className="w-5 h-5 text-emerald-600 mb-2" />
          <h4 className="font-bold text-xs text-stone-900">Cafeteria Hotline</h4>
          <p className="text-xs text-stone-500 mt-0.5">+92 (051) 887-2100</p>
          <p className="text-[11px] text-stone-400">Ext: 4402 (Counter 1 & 2)</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs">
          <Mail className="w-5 h-5 text-blue-600 mb-2" />
          <h4 className="font-bold text-xs text-stone-900">Email Inquiries</h4>
          <p className="text-xs text-stone-500 mt-0.5">cafeteria@campusbite.edu</p>
          <p className="text-[11px] text-stone-400">Responses within 2 business hours</p>
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
        <h3 className="font-bold text-stone-900 text-base font-['Outfit'] pb-2 border-b border-stone-100 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-amber-600" />
          <span>Frequently Asked Questions</span>
        </h3>

        <div className="divide-y divide-stone-100">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div key={index} className="py-3.5">
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between text-left gap-4 group"
                >
                  <span className="text-xs sm:text-sm font-bold text-stone-800 group-hover:text-amber-700 transition-colors">
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-stone-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-stone-400" />
                  )}
                </button>
                {isOpen && (
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed pl-1 animate-in fade-in">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Submit Inquiry Ticket */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
        <h3 className="font-bold text-stone-900 text-base font-['Outfit'] pb-2 border-b border-stone-100">
          Submit a Feedback or Support Ticket
        </h3>

        {ticketSent ? (
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-emerald-900 text-sm">Ticket Received</h4>
            <p className="text-xs text-emerald-700">
              Cafeteria management has logged your message and will review it promptly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmitTicket} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-medium bg-white"
                >
                  <option value="Order Issue">Order Quality or Missing Item</option>
                  <option value="Wallet / Payment">Wallet Deduction / Refund Inquiry</option>
                  <option value="Menu Suggestion">Dish / Dietary Suggestion</option>
                  <option value="Counter Service">Counter Pickup Service Feedback</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Question about order CB-10024"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Message Details
              </label>
              <textarea
                rows={3}
                required
                placeholder="Describe your issue or suggestion..."
                value={ticketMessage}
                onChange={(e) => setTicketMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-medium"
              ></textarea>
            </div>

            <button
              type="submit"
              className="py-3 px-6 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-md transition-colors flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit In-App Ticket</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
