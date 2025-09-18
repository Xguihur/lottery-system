/**
 * 延迟函数
 * @param ms 延迟时间（毫秒）
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 生成唯一ID
 * @returns 随机字符串ID
 */
export function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}
