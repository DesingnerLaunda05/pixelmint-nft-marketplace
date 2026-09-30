import { useMarketplace } from '../context/MarketplaceContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useMarketplace();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        const iconMap = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
          info: <Info className="w-5 h-5 text-accent-400 shrink-0" />,
        };

        const borderMap = {
          success: 'border-emerald-500/30 bg-surface-900/95 shadow-emerald-500/10',
          error: 'border-rose-500/30 bg-surface-900/95 shadow-rose-500/10',
          warning: 'border-amber-500/30 bg-surface-900/95 shadow-amber-500/10',
          info: 'border-brand-500/30 bg-surface-900/95 shadow-brand-500/10',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border backdrop-blur-xl shadow-2xl transition-all animate-slide-up ${borderMap[toast.type]}`}
          >
            <div className="mt-0.5">{iconMap[toast.type]}</div>
            <div className="flex-1 min-w-0">
              <h5 className="text-white font-semibold text-sm leading-snug">{toast.title}</h5>
              <p className="text-gray-300 text-xs mt-0.5 leading-relaxed break-words">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
