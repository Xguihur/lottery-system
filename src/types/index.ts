/**
 * Toast 消息类型
 */
export interface ToastMsg {
  id: string;
  title?: string;
  description?: string;
}

/**
 * 确认对话框属性
 */
export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * 抽奖应用状态
 */
export interface LotteryState {
  rawText: string;
  need: number;
  dedupe: boolean;
  rolling: boolean;
  result: string[];
  history: string[][];
  showResetConfirm: boolean;
  rollName: string;
}

/**
 * Toast Hook 返回值
 */
export interface UseToastReturn {
  toasts: ToastMsg[];
  showToast: (params: { title?: string; description?: string }) => void;
  closeToast: (id: string) => void;
}
