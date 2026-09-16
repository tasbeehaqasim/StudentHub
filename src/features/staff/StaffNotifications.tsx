import React, { useState, useEffect } from 'react';
import { StaffUser, AppNotification } from '../../types';
import { db } from '../../services/db';
import { Bell, CheckCheck, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface StaffNotificationsProps {
  staff: StaffUser;
}

export const StaffNotifications: React.FC<StaffNotificationsProps> = ({ staff }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    const refresh = () => {
      setNotifications(db.getNotifications(staff.id, 'STAFF'));
    };
    refresh();
    const unsub = db.subscribe(refresh);
    return unsub;
  }, [staff.id]);

  const handleMarkAllRead = () => {
    notifications.forEach((n) => {
      if (!n.isRead) db.markNotificationAsRead(n.id);
    });
    setNotifications(db.getNotifications(staff.id, 'STAFF'));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between pb-3 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-['Outfit']">
            Kitchen & Station Alerts
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Operational alerts, inventory threshold warnings, and queue updates.
          </p>
        </div>

        {notifications.some((n) => !n.isRead) && (
          <button
            onClick={handleMarkAllRead}
            className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1.5"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
          <Bell className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-800">No kitchen alerts</h3>
          <p className="text-xs text-stone-500 mt-1">Station notifications will show here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                if (!notif.isRead) {
                  db.markNotificationAsRead(notif.id);
                  setNotifications(db.getNotifications(staff.id, 'STAFF'));
                }
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                notif.isRead
                  ? 'bg-white border-stone-200 opacity-80'
                  : 'bg-amber-50/50 border-amber-300 shadow-2xs'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  notif.type === 'SUCCESS'
                    ? 'bg-emerald-100 text-emerald-700'
                    : notif.type === 'WARNING'
                    ? 'bg-amber-100 text-amber-700'
                    : notif.type === 'ERROR'
                    ? 'bg-rose-100 text-rose-700'
                    : 'bg-stone-100 text-stone-700'
                }`}
              >
                {notif.type === 'SUCCESS' ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : notif.type === 'WARNING' ? (
                  <AlertTriangle className="w-4 h-4" />
                ) : (
                  <Info className="w-4 h-4" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-stone-900">{notif.title}</h4>
                  <span className="text-[10px] text-stone-400">
                    {new Date(notif.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">{notif.message}</p>
              </div>

              {!notif.isRead && (
                <span className="w-2 h-2 rounded-full bg-amber-600 shrink-0 mt-1.5"></span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
