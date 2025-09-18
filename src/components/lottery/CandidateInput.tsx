import { Play, RotateCcw, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { TECH_DEPT_MEMBERS } from "@/constants";

interface CandidateInputProps {
  rawText: string;
  need: number;
  dedupe: boolean;
  rolling: boolean;
  candidatesCount: number;
  onTextChange: (text: string) => void;
  onNeedChange: (need: number) => void;
  onDedupeChange: (dedupe: boolean) => void;
  onStartDraw: () => void;
  onReset: () => void;
  onLoadTechDept: () => void;
}

/**
 * 候选人输入组件
 */
export function CandidateInput({
  rawText,
  need,
  dedupe,
  rolling,
  candidatesCount,
  onTextChange,
  onNeedChange,
  onDedupeChange,
  onStartDraw,
  onReset,
  onLoadTechDept
}: CandidateInputProps) {
  const handleLoadTechDept = () => {
    onTextChange(TECH_DEPT_MEMBERS);
    onLoadTechDept();
  };

  return (
    <Card className="border-slate-800 bg-slate-900/60 backdrop-blur">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-slate-100">
          <Users className="h-5 w-5" /> 候选人名单
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="names" className="text-slate-200">每行输入一个名字</Label>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleLoadTechDept}
              className="h-7 px-3 text-xs border-slate-600 hover:bg-slate-800"
            >
              <Users className="mr-1 h-3 w-3" />
              技术部
            </Button>
          </div>
          <Textarea
            id="names"
            rows={12}
            spellCheck={false}
            value={rawText}
            onChange={(e) => onTextChange(e.target.value)}
            placeholder={"例如：\n张三\n李四\n王五\n..."}
            className="resize-y border-slate-700 bg-slate-950/60 text-slate-100 placeholder:text-slate-500 caret-sky-300 selection:bg-sky-400/30 focus-visible:ring-sky-500/40 focus-visible:border-sky-500/60"
          />
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span>当前有效人数：<b className="text-slate-200">{candidatesCount}</b></span>
            <label className="flex items-center gap-2">
              <span>自动去重</span>
              <Switch checked={dedupe} onCheckedChange={onDedupeChange} />
            </label>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end">
          <div className="flex-1 space-y-2 mr-2">
            <Label htmlFor="need" className="text-slate-200">需要抽取的人数</Label>
            <Input
              id="need"
              type="number"
              min={1}
              value={need}
              onChange={(e) => onNeedChange(parseInt(e.target.value || "1", 10))}
              className="border-slate-700 bg-slate-950/50 text-slate-100 placeholder:text-slate-500 caret-sky-300 focus-visible:ring-sky-500/40 focus-visible:border-sky-500/60"
            />
          </div>

          <div className="flex">
            <Button onClick={onStartDraw} disabled={rolling} className="group h-10 w-full sm:w-auto mr-2">
              <Play className="mr-2 h-4 w-4 transition-transform group-active:scale-90" />
              {rolling ? "抽奖中…" : "开始抽奖"}
            </Button>
            <Button variant="secondary" onClick={onReset} className="h-10 w-24">
              <RotateCcw className="mr-2 h-4 w-4" />重置
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
