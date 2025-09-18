import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Shuffle, Users, Sparkles, Copy, Play, RotateCcw, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

// 技术部知识分享摇号系统 - 纯前端实现（无后端依赖）
// 修复：定义并内置 ToastHost 组件，移除外部 useToast 依赖，解决 "ToastHost 未定义" 报错。
// 说明：如果你在真实项目中有 Toast Provider，可移除这里的轻量 toast，改用项目内的 Hook。

// =============== 实用小函数 ===============
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 解析候选人：按行、trim、过滤空白；可选去重（保留首次顺序）
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

// 从数组中随机抽取 n 个不重复元素（Fisher-Yates 洗牌）
export function sampleUnique<T>(arr: T[], n: number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, Math.max(0, Math.min(n, a.length)));
}

// 计算抽取人数上限
export function clampPickCount(need: number, total: number): number {
  const n = Number.isFinite(need) ? Math.floor(need) : 0;
  return Math.max(0, Math.min(n, total));
}

// 彩带特效
function burstConfetti(times = 3) {
  const duration = 800;
  const scalar = 1.2;
  for (let i = 0; i < times; i++) {
    setTimeout(() => {
      confetti({
        particleCount: 120,
        spread: 70,
        startVelocity: 35,
        gravity: 0.9,
        scalar,
        origin: { x: Math.random() * 0.6 + 0.2, y: 0.2 },
      });
    }, i * duration);
  }
}

// =============== 轻量 Toast 系统（无外部依赖） ===============
interface ToastMsg { id: string; title?: string; description?: string }
function uid() { return Math.random().toString(36).slice(2, 9); }

function ToastHost({ toasts, onClose }: { toasts: ToastMsg[]; onClose: (id: string) => void }) {
  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 space-y-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 18 }}
            className="pointer-events-auto flex max-w-[92vw] items-start gap-3 rounded-xl border border-slate-700/60 bg-slate-900/90 p-3 text-slate-100 shadow-xl backdrop-blur sm:max-w-md"
          >
            <div className="min-w-0">
              {t.title && <div className="text-sm font-semibold">{t.title}</div>}
              {t.description && <div className="mt-0.5 text-sm text-slate-300">{t.description}</div>}
            </div>
            <button
              onClick={() => onClose(t.id)}
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

export default function TechShareLottery() {
  // 内置 toast：提供 showToast 与 UI 容器
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const showToast = ({ title, description }: { title?: string; description?: string }) => {
    const id = uid();
    setToasts((t) => [...t, { id, title, description }]);
    // 2.8s 后自动关闭
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
  };

  const [rawText, setRawText] = useState("");
  const [need, setNeed] = useState(1);
  const [dedupe, setDedupe] = useState(true);
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState<string[]>([]);
  const [history, setHistory] = useState<string[][]>([]);

  const candidates = useMemo(() => parseCandidates(rawText, dedupe), [rawText, dedupe]);

  const rollRef = useRef<HTMLDivElement | null>(null);
  const [rollName, setRollName] = useState<string>("");

  useEffect(() => {
    document.title = "技术部知识分享摇号系统";
  }, []);

  async function startDraw() {
    if (rolling) return;
    if (candidates.length === 0) {
      showToast({ title: "名单为空", description: "请在左侧输入候选人，每行一个名字。" });
      return;
    }
    if (need <= 0) {
      showToast({ title: "人数不合法", description: "请输入大于 0 的抽取人数。" });
      return;
    }

    const n = clampPickCount(need, candidates.length);
    if (need > candidates.length) {
      showToast({ title: "人数过多", description: `可用人数仅有 ${candidates.length}，将自动抽取 ${n} 人。` });
    }

    // 滚动动画阶段
    setRolling(true);
    setResult([]);

    const rollDuration = 2200; // ms
    const tick = 60; // ms
    const startAt = Date.now();

    while (Date.now() - startAt < rollDuration) {
      const r = Math.floor(Math.random() * candidates.length);
      setRollName(candidates[r]);
      // 让滚动更有节奏：后半段逐渐减速
      const progress = (Date.now() - startAt) / rollDuration;
      const eased = tick + progress * 240; // 60 -> ~300ms
      // eslint-disable-next-line no-await-in-loop
      await sleep(eased);
    }

    // 抽取结果
    const winners = sampleUnique(candidates, n);
    setResult(winners);
    setHistory((prev) => [winners, ...prev].slice(0, 5));

    burstConfetti(3);
    setRolling(false);
  }

  function resetAll() {
    setRawText("");
    setResult([]);
    setHistory([]);
    setNeed(1);
    setRollName("");
  }

  function copyResult() {
    const text = result.join("\n");
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
        if (ok) showToast({ title: "已复制", description: text ? "结果已复制到剪贴板" : "没有可复制的结果" });
        else showToast({ title: "复制失败", description: "请手动选择并复制。" });
      } catch {
        showToast({ title: "复制失败", description: "请手动选择并复制。" });
      }
    };

    if (!text) {
      showToast({ title: "无内容", description: "没有可复制的结果" });
      return;
    }

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(
        () => showToast({ title: "已复制", description: "结果已复制到剪贴板" }),
        fallback
      );
    } else {
      fallback();
    }
  }

  const headerGradient = "bg-gradient-to-r from-fuchsia-500 via-purple-500 to-sky-400";

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-950 text-slate-100">
      {/* Toast 容器 */}
      <ToastHost toasts={toasts} onClose={(id) => setToasts((t) => t.filter((x) => x.id !== id))} />

      {/* 背景粒子 + 渐变光晕 */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className={`absolute -top-32 left-1/2 h-72 w-[1100px] -translate-x-1/2 blur-3xl opacity-35 ${headerGradient}`} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.06),rgba(15,23,42,0.2))]" />
      </div>

      {/* 标题区域 */}
      <header className="mx-auto max-w-6xl px-4 pb-6 pt-10 sm:pt-14">
        <motion.h1
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 16 }}
          className="text-center text-3xl font-extrabold tracking-tight sm:text-5xl"
        >
          <span className="relative inline-block">
            <span className={`bg-clip-text text-transparent ${headerGradient}`}>技术部知识分享摇号系统</span>
            <Sparkles className="absolute -right-8 -top-4 h-6 w-6 animate-pulse text-sky-300 sm:h-7 sm:w-7" />
          </span>
        </motion.h1>
        <p className="mt-3 text-center text-sm text-slate-300 sm:text-base">
          粘贴名单（每行一个），设置抽取人数，点击开始即可。全程在本地浏览器完成，无需后端。
        </p>
      </header>

      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 pb-16 sm:grid-cols-2 sm:gap-6">
        {/* 左侧：输入区 */}
        <Card className="border-slate-800 bg-slate-900/60 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-slate-100">
              <Users className="h-5 w-5" /> 候选人名单
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="names" className="text-slate-200">每行输入一个名字</Label>
              <Textarea
                id="names"
                rows={12}
                spellCheck={false}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder={"例如：\n张三\n李四\n王五\n..."}
                className="resize-y border-slate-700 bg-slate-950/60 text-slate-100 placeholder:text-slate-500 caret-sky-300 selection:bg-sky-400/30 focus-visible:ring-sky-500/40 focus-visible:border-sky-500/60"
              />
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>当前有效人数：<b className="text-slate-200">{candidates.length}</b></span>
                <label className="flex items-center gap-2">
                  <span>自动去重</span>
                  <Switch checked={dedupe} onCheckedChange={setDedupe} />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:items-end">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="need" className="text-slate-200">需要抽取的人数</Label>
                <Input
                  id="need"
                  type="number"
                  min={1}
                  value={need}
                  onChange={(e) => setNeed(parseInt(e.target.value || "1", 10))}
                  className="border-slate-700 bg-slate-950/50 text-slate-100 placeholder:text-slate-500 caret-sky-300 focus-visible:ring-sky-500/40 focus-visible:border-sky-500/60"
                />
              </div>

              <div className="flex gap-2 sm:justify-end">
                <Button onClick={startDraw} disabled={rolling} className="group h-10 w-full sm:w-auto">
                  <Play className="mr-2 h-4 w-4 transition-transform group-active:scale-90" />
                  {rolling ? "抽奖中…" : "开始抽奖"}
                </Button>
                <Button variant="secondary" onClick={resetAll} className="h-10 w-24">
                  <RotateCcw className="mr-2 h-4 w-4" />重置
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 右侧：动画+结果区 */}
        <Card className="border-slate-800 bg-slate-900/60 backdrop-blur">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-slate-100">
              <Shuffle className="h-5 w-5" /> 抽奖显示区
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* 滚动名字 */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5" />
              <div className="mb-3 text-xs uppercase tracking-wider text-slate-400">抽奖滚动</div>
              <div
                ref={rollRef}
                className="h-14 overflow-hidden rounded-xl bg-slate-900/60 shadow-inner"
              >
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.div
                    key={rolling ? `rolling-${rollName}` : `idle-${result.join(",")}`}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="flex h-14 items-center justify-center px-3 text-lg font-medium text-sky-200"
                  >
                    {rolling ? rollName || "—" : result.length ? "抽取完成！" : "等待开始…"}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* 结果展示 */}
            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-sm text-slate-400">最终抽中（{result.length} 人）</div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={copyResult} disabled={!result.length}>
                    <Copy className="mr-2 h-4 w-4" /> 复制结果
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <AnimatePresence>
                  {result.map((name, idx) => (
                    <motion.div
                      key={name}
                      initial={{ y: 20, opacity: 0, scale: 0.98 }}
                      animate={{ y: 0, opacity: 1, scale: 1 }}
                      transition={{ type: "spring", damping: 18, delay: idx * 0.06 }}
                      className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
                    >
                      <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/10 via-fuchsia-500/10 to-purple-400/10 opacity-40" />
                      <div className="relative">
                        <div className="text-sm text-slate-400">NO.{idx + 1}</div>
                        <div className="mt-1 text-xl font-semibold tracking-wide text-slate-100">{name}</div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {!result.length && (
                <div className="rounded-xl border border-dashed border-slate-800 p-6 text-center text-slate-500">
                  结果将显示在这里。
                </div>
              )}
            </div>

            {/* 历史记录 */}
            <div className="mt-8">
              <div className="mb-3 text-sm text-slate-400">最近纪录</div>
              {history.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-800 p-4 text-center text-slate-500">
                  暂无历史记录。
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((group, i) => (
                    <div key={i} className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                      <div className="mb-1 text-xs text-slate-400">第 {i + 1} 次</div>
                      <div className="flex flex-wrap gap-2">
                        {group.map((g) => (
                          <span key={g} className="rounded-lg bg-slate-900/70 px-2 py-1 text-sm text-slate-200">
                            {g}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="mx-auto max-w-6xl px-4 pb-8 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} 技术部 · 知识分享 · 摇号系统
      </footer>
    </div>
  );
}

// =============== 简单单元测试（不会影响 UI，输出到控制台） ===============
(function runTests() {
  try {
    console.group("🎯 Lottery Unit Tests");

    // parseCandidates 基础
    {
      const t = "张三\n李四\n\n张三\n 王五  \n";
      const a = parseCandidates(t, true);
      console.assert(a.length === 3 && a[0] === "张三" && a[1] === "李四" && a[2] === "王五", "parseCandidates 去重失败");
      const b = parseCandidates(t, false);
      console.assert(b.length === 4, "parseCandidates 非去重数量错误");
    }

    // parseCandidates 顺序保持 & 空白过滤
    {
      const t = " A \n B \n  C  \n\n";
      const arr = parseCandidates(t, false);
      console.assert(arr.join("|") === "A|B|C", "parseCandidates 应保持顺序并过滤空行");
    }

    // sampleUnique 不变性 & 唯一性
    {
      const src = [1, 2, 3, 4, 5];
      const cp = [...src];
      const pick = sampleUnique(src, 3);
      console.assert(src.join(",") === cp.join(","), "sampleUnique 不应修改原数组");
      const set = new Set(pick);
      console.assert(pick.length === 3 && set.size === 3, "sampleUnique 结果应唯一且数量正确");
      console.assert(pick.every((x) => src.includes(x)), "sampleUnique 结果必须来自源数组");
    }

    // sampleUnique 超出上限
    {
      const src = [1, 2];
      const pick = sampleUnique(src, 5);
      console.assert(pick.length === 2, "sampleUnique 超出长度时应裁剪");
    }

    // clampPickCount
    {
      console.assert(clampPickCount(5, 3) === 3, "clampPickCount 上限裁剪失败");
      console.assert(clampPickCount(0, 10) === 0, "clampPickCount 下限 0 失败");
      console.assert(clampPickCount(2.9, 10) === 2, "clampPickCount 应向下取整");
      console.assert(clampPickCount(-5, 10) === 0, "clampPickCount 负数应裁剪为 0");
    }

    console.log("✅ All tests passed");
  } catch (e) {
    console.error("❌ Tests failed:", e);
  } finally {
    console.groupEnd();
  }
})();
