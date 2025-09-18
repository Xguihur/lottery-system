/**
 * 复制文本到剪贴板
 * @param text 要复制的文本
 * @param onSuccess 成功回调
 * @param onError 失败回调
 */
export function copyToClipboard(
  text: string,
  onSuccess?: () => void,
  onError?: () => void
) {
  if (!text) {
    onError?.();
    return;
  }

  const fallback = () => {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      if (ok) {
        onSuccess?.();
      } else {
        onError?.();
      }
    } catch {
      onError?.();
    }
  };

  if (navigator?.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(
      () => onSuccess?.(),
      fallback
    );
  } else {
    fallback();
  }
}
