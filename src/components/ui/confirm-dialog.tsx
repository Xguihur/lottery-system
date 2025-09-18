import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ConfirmDialogProps } from "@/types";

/**
 * 确认对话框组件
 */
export function ConfirmDialog({ open, title, description, onConfirm, onCancel }: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 背景遮罩 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      
      {/* 对话框 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: "spring", damping: 20 }}
        className="relative mx-4 w-full max-w-md rounded-xl border border-slate-700/60 bg-slate-900/95 p-6 shadow-xl backdrop-blur-sm"
      >
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
          <p className="mt-2 text-sm text-slate-300">{description}</p>
        </div>
        
        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={onCancel}
            className="border-slate-600 hover:bg-slate-800"
          >
            取消
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 focus-visible:ring-red-500/40"
          >
            确认重置
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
