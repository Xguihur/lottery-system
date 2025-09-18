/**
 * 解析候选人：按行、trim、过滤空白；可选去重（保留首次顺序）
 * @param text 输入的文本
 * @param dedupe 是否去重
 * @returns 候选人名单数组
 */
export function parseCandidates(text: string, dedupe: boolean): string[] {
  const lines = text
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
  
  if (!dedupe) return lines;
  
  const seen = new Set<string>();
  const out: string[] = [];
  for (const v of lines) {
    if (!seen.has(v)) {
      seen.add(v);
      out.push(v);
    }
  }
  return out;
}

/**
 * 从数组中随机抽取 n 个不重复元素（Fisher-Yates 洗牌）
 * @param arr 原数组
 * @param n 抽取数量
 * @returns 抽取结果数组
 */
export function sampleUnique<T>(arr: T[], n: number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, Math.max(0, Math.min(n, a.length)));
}

/**
 * 计算抽取人数上限
 * @param need 需要抽取的人数
 * @param total 总人数
 * @returns 实际可抽取人数
 */
export function clampPickCount(need: number, total: number): number {
  const n = Number.isFinite(need) ? Math.floor(need) : 0;
  return Math.max(0, Math.min(n, total));
}
