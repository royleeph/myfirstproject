# 🤝 贡献指南

感谢你对此项目感兴趣！欢迎以各种方式参与贡献。

---

## 📋 目录

- [如何贡献](#如何贡献)
- [提交 Issue](#提交-issue)
- [提交 PR](#提交-pr)
- [代码规范](#代码规范)
- [审查流程](#审查流程)

---

## 如何贡献

你可以：

1. **提交 Bug 报告** - 发现问题？告诉我们！
2. **提出功能建议** - 有好想法？欢迎分享！
3. **改进文档** - 错别字、表述不清都可以改
4. **提交代码** - 修复 Bug 或实现新功能
5. **分享项目** - 向更多人推荐这个项目

---

## 提交 Issue

### Bug 报告

请包含以下信息：

- **标题**: 清晰描述问题
- **描述**: 详细说明问题表现
- **复现步骤**: 如何重现这个 Bug
- **预期行为**: 应该发生什么
- **实际行为**: 实际发生了什么
- **环境**: 操作系统、Node.js 版本等
- **截图**: 如适用，添加截图

### 功能建议

请包含：

- **功能描述**: 你想要什么功能
- **使用场景**: 为什么需要这个功能
- **实现建议**: 如果有想法，可以说明如何实现

---

## 提交 PR

### 准备工作

1. Fork 本仓库
2. 克隆到本地：`git clone git@github.com:your-username/myfirstproject.git`
3. 创建分支：`git checkout -b feature/your-feature-name`
4. 安装依赖：`npm install`

### 开发流程

```bash
# 切换到你的分支
git checkout -b feature/your-feature

# 进行修改...

# 运行代码检查和测试
npm run lint
npm run build

# 提交更改
git add .
git commit -m "feat: add your feature description"

# 推送到远程
git push origin feature/your-feature
```

### PR 要求

- ✅ **标题清晰**: 使用语义化前缀（feat/fix/docs/style/refactor/test/chore）
- ✅ **描述详细**: 说明变更内容和原因
- ✅ **代码质量**: 通过 ESLint 检查
- ✅ **测试**: 为新功能添加测试
- ✅ **文档**: 更新相关文档

### 语义化提交前缀

| 前缀 | 用途 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat: add issue classifier` |
| `fix` | Bug 修复 | `fix: resolve PR analysis bug` |
| `docs` | 文档更新 | `docs: update README` |
| `style` | 代码格式 | `style: format code` |
| `refactor` | 代码重构 | `refactor: simplify logic` |
| `test` | 测试相关 | `test: add unit tests` |
| `chore` | 构建/工具 | `chore: update dependencies` |

---

## 代码规范

### TypeScript

- 使用严格模式
- 定义清晰的类型
- 避免使用 `any`
- 导出公共接口

### 命名规范

```typescript
// 变量和函数：camelCase
const issueCount = 10;
function analyzeIssue() {}

// 类：PascalCase
class IssueClassifier {}

// 常量：UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3;

// 接口和类型：PascalCase
interface IssueAnalysis {}
type PRQuality = 'good' | 'bad';
```

### 注释

- 公共 API 必须有注释
- 使用 JSDoc 格式
- 解释"为什么"而非"是什么"

```typescript
/**
 * 分析 Issue 内容并生成标签建议
 * @param title Issue 标题
 * @param body Issue 正文
 * @returns 分析结果
 */
export function analyzeIssue(title: string, body: string): IssueAnalysis {
  // 实现...
}
```

---

## 审查流程

### AI 自动审查

1. **提交 PR** 后，GitHub Actions 自动触发
2. **自动分析** 代码质量、变更范围
3. **生成报告** 包含优点、不足和建议
4. **添加标签** 自动分类 PR 类型

### 人工审查

1. AI 审查完成后，人类维护者进行最终审查
2. 确认代码质量、功能正确性
3. 批准并合并 PR

### 审查时间

- AI 自动审查：即时
- 人工审查：通常 48 小时内

---

## 🤖 AI 运营说明

这是 AI 自主运营的项目，所有 Issue 和 PR 都会经过 AI 分析：

- **透明**: 所有决策记录在 `docs/AI_DECISIONS.md`
- **负责**: AI 对每个决策负责并说明原因
- **学习**: AI 会持续学习和改进

---

## 需要帮助？

- 📖 查看 [README.md](README.md) 了解项目
- 📝 查看 [AI_DECISIONS.md](docs/AI_DECISIONS.md) 了解决策过程
- 💬 在 Issue 中提问
- 📧 联系项目维护者

---

感谢你的贡献！🎉

**最后更新**: 2026-03-12
