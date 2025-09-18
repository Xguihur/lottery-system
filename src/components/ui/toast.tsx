import { motion, AnimatePresence } from "framer-motion";
import { XCircle } from "lucide-react";
import { ToastMsg } from "@/types";

interface ToastHostProps {
  toasts: ToastMsg[];
  onClose: (id: string) => void;
}

/**
 * Toast 容器组件
 */
export function ToastHost({ toasts, onClose }: ToastHostProps) {
  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 18 }}
            className="pointer-events-auto flex max-w-[92vw] items-start gap-3 rounded-xl border border-slate-700/60 bg-slate-900/90 p-3 text-slate-100 shadow-xl backdrop-blur sm:max-w-md"
          >
            <div className="min-w-0">
              {toast.title && <div className="text-sm font-semibold">{toast.title}</div>}
              {toast.description && <div className="mt-0.5 text-sm text-slate-300">{toast.description}</div>}
            </div>
            <button
              onClick={() => onClose(toast.id)}
              className="ml-auto rounded-lg p-1 text-slate-400 hover:bg-white/5 hover:text-slate-200"
              aria-label="关闭"
            >
              <XCircle className="h-5 w-5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
