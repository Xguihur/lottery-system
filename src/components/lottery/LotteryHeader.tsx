import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { UI_STYLES } from "@/constants";

/**
 * 抽奖系统头部组件
 */
export function LotteryHeader() {
  const { HEADER_GRADIENT } = UI_STYLES;
  
  return (
    <header className="mx-auto max-w-6xl px-4 pb-6 pt-10 sm:pt-14">
      <motion.h1
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 16 }}
        className="text-center text-3xl font-extrabold tracking-tight sm:text-5xl"
      >
        <span className="relative inline-block">
          <span className={`bg-clip-text text-transparent ${HEADER_GRADIENT}`}>
            技术部知识分享摇号系统
          </span>
          <Sparkles className="absolute -right-8 -top-4 h-6 w-6 animate-pulse text-sky-300 sm:h-7 sm:w-7" />
        </span>
      </motion.h1>
      <p className="mt-3 text-center text-sm text-slate-300 sm:text-base">
        粘贴名单（每行一个），设置抽取人数，点击开始即可。全程在本地浏览器完成，无需后端。
      </p>
    </header>
  );
}
