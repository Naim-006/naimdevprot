import React from 'react';
import { motion } from 'motion/react';
import { usePortfolio } from '../../context/PortfolioContext';
import { X, Bell, BellOff, Trash2, Info, Clock } from 'lucide-react';

export const NotificationCenter: React.FC = () => {
  const {
    isNotificationCenterOpen,
    toggleNotificationCenter,
    notifications,
    dismissNotification
  } = usePortfolio();

  return (
    <>
      {/* Backdrop */}
      {isNotificationCenterOpen && (
        <div
          onClick={toggleNotificationCenter}
          className="fixed inset-0 z-45"
        />
      )}

      {/* Notification Center Panel */}
      <motion.div
        initial={false}
        animate={
          isNotificationCenterOpen
            ? { y: 0, opacity: 1, pointerEvents: 'auto' as const }
            : { y: -320, opacity: 0, pointerEvents: 'none' as const }
        }
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="fixed top-0 right-4 z-50 w-96 max-h-96 bg-[#1a1a1a]/95 backdrop-blur-2xl rounded-b-2xl border border-white/20 border-t-0 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-bold text-white">Notification Center</span>
            {notifications.length > 0 && (
              <span className="text-[10px] bg-blue-500 text-white font-bold px-1.5 py-0.5 rounded-full">
                {notifications.length}
              </span>
            )}
          </div>
          <button
            onClick={toggleNotificationCenter}
            className="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-80">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2 text-slate-400">
              <BellOff className="w-8 h-8" />
              <span className="text-xs font-medium">No notifications</span>
              <span className="text-[10px] text-slate-500">You're all caught up!</span>
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="group flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                    <Bell className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white truncate">{n.title}</span>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 shrink-0">
                        <Clock className="w-3 h-3" />
                        {n.timestamp}
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-2">{n.message}</p>
                  </div>
                  <button
                    onClick={() => dismissNotification(n.id)}
                    className="w-6 h-6 rounded-md flex items-center justify-center text-slate-500 hover:bg-white/10 hover:text-rose-400 transition opacity-0 group-hover:opacity-100 shrink-0"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};
