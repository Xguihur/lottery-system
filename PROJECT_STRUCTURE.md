# 技术部知识分享摇号系统 - 项目结构说明

本项目已经过重构优化，从单一的大文件拆分成了模块化的组件架构。

## 📁 项目结构

```
src/
├── components/           # UI 组件
│   ├── ui/              # 基础 UI 组件
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── switch.tsx
│   │   ├── textarea.tsx
│   │   ├── toast.tsx           # Toast 通知组件
│   │   └── confirm-dialog.tsx  # 确认对话框组件
│   └── lottery/         # 业务组件
│       ├── LotteryHeader.tsx   # 页面头部组件
│       ├── CandidateInput.tsx  # 候选人输入组件
│       ├── LotteryDisplay.tsx  # 抽奖显示组件
│       └── index.ts           # 组件导出
├── hooks/               # 自定义 Hooks
│   ├── useToast.ts     # Toast 管理 Hook
│   ├── useLottery.ts   # 抽奖逻辑 Hook
│   └── index.ts        # Hooks 导出
├── utils/               # 工具函数
│   ├── common.ts       # 基础工具函数 (sleep, uid)
│   ├── lottery.ts      # 抽奖相关工具函数
│   ├── effects.ts      # 特效工具函数 (彩带)
│   ├── clipboard.ts    # 剪贴板工具函数
│   └── index.ts        # 工具函数导出
├── types/               # TypeScript 类型定义
│   └── index.ts        # 类型定义导出
├── constants/           # 常量定义
│   └── index.ts        # 常量导出
├── lib/                 # 第三方库配置
│   └── utils.ts        # 工具库配置
├── App.tsx             # 主应用组件（重构后）
├── main.tsx            # 应用入口
└── index.css           # 全局样式
```

## 🔧 重构亮点

### 1. **模块化架构**
- 将原本 580 行的单一文件拆分成多个专职模块
- 每个模块都有单一的责任和清晰的接口
- 便于维护、测试和扩展

### 2. **自定义 Hooks**
- `useToast`: 管理 Toast 通知状态和操作
- `useLottery`: 封装所有抽奖相关逻辑

### 3. **组件化设计**
- `LotteryHeader`: 页面头部展示
- `CandidateInput`: 候选人输入和配置
- `LotteryDisplay`: 抽奖动画和结果展示
- `ToastHost`: 通知消息容器
- `ConfirmDialog`: 确认对话框

### 4. **工具函数分离**
- `common.ts`: 基础工具函数
- `lottery.ts`: 抽奖核心算法
- `effects.ts`: 视觉特效
- `clipboard.ts`: 剪贴板操作

### 5. **类型安全**
- 完整的 TypeScript 类型定义
- 接口约定清晰，减少运行时错误

### 6. **配置集中化**
- 常量统一管理在 `constants/index.ts`
- 便于调整系统参数

## 🚀 使用方式

重构后的代码保持了所有原有功能：

1. **输入候选人名单**：支持手动输入或加载预设
2. **配置抽奖参数**：设置抽取人数、是否去重
3. **执行抽奖**：动画滚动 + 最终结果展示
4. **结果管理**：复制结果、查看历史记录
5. **数据重置**：带确认的安全重置功能

## 📈 代码质量提升

- ✅ **可维护性**：模块化结构便于理解和修改
- ✅ **可测试性**：工具函数和 Hooks 易于单元测试
- ✅ **可重用性**：组件和 Hooks 可在其他项目中复用
- ✅ **类型安全**：完整的 TypeScript 支持
- ✅ **性能优化**：合理的组件分割和状态管理
- ✅ **开发体验**：清晰的文件组织和导入结构

## 🔄 迁移说明

本次重构完全兼容原有功能，无需修改使用方式。重构主要改进了代码结构，提升了开发体验和代码质量。

所有原有的单元测试依然通过，确保功能的正确性和稳定性。
