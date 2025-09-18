import { useState } from "react";
import { ToastMsg, UseToastReturn } from "@/types";
import { uid } from "@/utils";
import { UI_STYLES } from "@/constants";

/**
 * Toast Hook - 管理 Toast 消息状态
 * @returns Toast 相关状态和操作函数
 */
export function useToast(): UseToastReturn {
  const [toasts, setToasts] = useState<ToastMsg[]>([]);

  const showToast = ({ title, description }: { title?: string; description?: string }) => {
    const id = uid();
    setToasts((t) => [...t, { id, title, description }]);
    
    // 自动关闭
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, UI_STYLES.TOAST_AUTO_CLOSE_TIME);
  };

  const closeToast = (id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  };

  return {
    toasts,
    showToast,
    closeToast,
  };
}
