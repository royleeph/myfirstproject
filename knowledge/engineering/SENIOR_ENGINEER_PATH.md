# 🎓 高级软件工程师能力建设

> **目标**: 把自己打造成具备成熟软件工程能力的 AI，达到高级工程师水平

**创建日期**: 2026-03-12  
**学习来源**: software-engineer skill + 实践总结

---

## 📚 核心能力模型

### 高级工程师 vs 初级工程师

| 维度 | 初级工程师 | 高级工程师 |
|------|------------|------------|
| **代码质量** | 能跑就行 | 可读、可维护、可测试 |
| **错误处理** | try-catch 或忽略 | 类型化、有上下文、可恢复 |
| **架构设计** | 直接实现功能 | 分层清晰、边界明确 |
| **抽象能力** | 过度抽象或没有抽象 | 恰当时机、适度抽象 |
| **权衡思维** | 追求"完美"方案 | 明确 trade-offs，务实决策 |
| **测试意识** | 不写或很少写 | 测试金字塔，覆盖关键路径 |
| **代码审查** | 看表面语法 | 看架构、边界、错误处理 |

---

## 🏗️ 核心原则（内化为本能）

### 1. Read Before Write（先读后写）

**行为准则**:
- ✅ 写任何代码前，先查看项目现有代码风格
- ✅ 尊重现有 tech stack，不随意更换库
- ✅ 匹配现有命名约定、格式化、项目结构

**检查清单**:
```markdown
- [ ] 已查看项目中类似功能的实现
- [ ] 已了解项目使用的库和版本
- [ ] 已确认命名约定（camelCase/PascalCase）
- [ ] 已了解项目目录结构
```

**反模式**:
- ❌ 直接套用通用模板，不看项目上下文
- ❌ 引入新库而不说明理由
- ❌ 使用与项目不一致的代码风格

---

### 2. Code That Compiles（能编译的代码）

**行为准则**:
- ✅ 每个代码块都有正确的 import
- ✅ 使用的 API 在依赖版本中存在
- ✅ 通过基本语法检查，没有 `// TODO: implement`

**检查清单**:
```markdown
- [ ] 所有 import 都正确且存在
- [ ] 使用的函数/方法在库中存在
- [ ] 类型定义正确（TypeScript）
- [ ] 没有占位符代码
- [ ] 变量已声明
```

**反模式**:
- ❌  inventing APIs - 编造不存在的函数
- ❌ 使用未导入的库
- ❌ 留下 TODO 而不实现

---

### 3. Minimal First（最小化优先）

**行为准则**:
- ✅ 解决具体问题，不是假设的未来问题
- ✅ 有 3 个具体案例后再抽象，不是之前
- ✅ 可能需要的功能→跳过，需要的功能→实现

**决策框架**:
```
问自己：
1. 这是真实需求还是假设需求？
2. 我有几个具体案例需要这个抽象？
3. 如果现在不实现，以后加的成本多大？
4. 这个抽象会让代码更简单还是更复杂？
```

**反模式**:
- ❌ "可能以后会用到"
- ❌ "为了扩展性"（没有具体扩展场景）
- ❌ YAGNI 违反

---

### 4. Errors as First-Class Citizens（错误是一等公民）

**行为准则**:
- ✅ 类型化错误，不是通用字符串
- ✅ 包含上下文：什么操作失败，输入是什么
- ✅ 区分可恢复错误和致命错误

**错误处理模式**:
```typescript
// ❌ 糟糕的错误处理
catch (e) {}
catch (e) { console.log(e) }
catch (e) { throw new Error(e) }

// ✅ 良好的错误处理
catch (error) {
  logger.error('数据库保存失败', {
    error: error.message,
    userId: user.id,
    operation: 'save_user'
  });
  throw new DatabaseError('保存用户失败', {
    cause: error,
    userId: user.id
  });
}
```

**错误分类**:
| 类型 | 处理策略 | 示例 |
|------|----------|------|
| **可恢复** | 重试、降级、默认值 | 网络超时、缓存未命中 |
| **致命** | 记录、抛出、通知 | 数据库连接失败、配置错误 |
| **用户错误** | 友好提示、引导修正 | 表单验证失败、权限不足 |

---

### 5. Boundaries and Separation（边界和分层）

**三层架构**:
```
┌─────────────────────────────────────┐
│  Handler/Controller                 │  ← HTTP 解析、验证
├─────────────────────────────────────┤
│  Service/Domain                     │  ← 业务逻辑、编排
├─────────────────────────────────────┤
│  Repository/Adapter                 │  ← 数据访问、外部 API
└─────────────────────────────────────┘
```

**各层职责**:
| 层 | 包含 | 禁止 |
|----|------|------|
| Handler | HTTP 解析、参数验证 | 业务逻辑、SQL |
| Service | 业务规则、协调 repos | HTTP 细节、原始 SQL |
| Repository | 数据访问、查询构建 | 业务决策 |

**检查清单**:
```markdown
- [ ] Handler 只负责解析和验证
- [ ] Service 包含业务逻辑
- [ ] Repository 负责数据访问
- [ ] 没有跨层调用（Handler → Repository）
```

---

### 6. Explicit Trade-offs（明确的权衡）

**决策记录模板**:
```markdown
## 决策：选择 SQLite 作为数据库

**背景**: 项目初期，需要快速迭代

**选择**: SQLite

**理由**:
- 零配置，快速启动
- 单文件，便于备份
- 足够支持初期用户量

**权衡**:
- ❌ 不支持高并发写入
- ❌ 不支持分布式部署

**何时重新评估**:
- 并发写入 > 1 次/秒
- 需要水平扩展时
```

**决策框架**:
```
1. 问题是什么？
2. 有哪些可选方案？
3. 选择了哪个？为什么？
4. 放弃了什么？（trade-off）
5. 何时重新评估？
```

---

### 7. PR-Ready Code（PR 就绪代码）

**检查清单**:
```markdown
## 代码质量
- [ ] 没有死代码、注释块、调试语句
- [ ] 函数不超过 30 行
- [ ] 没有魔术数字（使用命名常量）
- [ ] 使用 early returns，避免嵌套条件
- [ ] 边界情况已处理：null、空、错误状态

## 可读性
- [ ] 变量/函数名清晰表达意图
- [ ] 代码结构清晰，逻辑流畅
- [ ] 必要的注释（解释 why，不是 what）

## 测试
- [ ] 关键逻辑有单元测试
- [ ] 边界情况有测试覆盖
- [ ] 测试通过
```

**高级工程师的代码特征**:
- ✅ 名字解释"是什么"和"为什么"，不是"怎么做"
- ✅ 初级工程师 30 秒内能理解
- ✅ 没有需要注释解释的"聪明"代码

---

## 🧪 测试能力

### 测试金字塔

```
        ╱╲
       ╱E2E╲        少量：关键用户流程
      ╱──────╲
     ╱ 集成测试 ╲    中量：API、数据库查询
    ╱────────────╲
   ╱   单元测试    ╲  大量：纯函数、业务逻辑
  ╱────────────────╲
```

### 测试什么

| 要测试 | 不测试 |
|--------|--------|
| 业务逻辑 | 框架内部实现 |
| 边界情况 | Getter/Setter |
| 错误路径 | 第三方库 |
| 公共 API | 实现细节 |

### 单元测试模板

```typescript
describe('calculateDiscount', () => {
  // 快乐路径
  test('applies 10% discount for orders over 100', () => {
    const order = { total: 150 };
    expect(calculateDiscount(order)).toBe(15);
  });

  // 边界情况
  test('returns 0 for orders under 100', () => {
    const order = { total: 99 };
    expect(calculateDiscount(order)).toBe(0);
  });

  // 空输入
  test('throws for null order', () => {
    expect(() => calculateDiscount(null)).toThrow(ValidationError);
  });
});
```

---

## 🎯 架构决策能力

### 数据库选择

| 规模 | 推荐 | 理由 |
|------|------|------|
| <10K 行，单写入者 | SQLite | 零配置，够快 |
| <1M 行，中等并发 | PostgreSQL | 功能丰富，稳定 |
| 高读，可接受最终一致 | + Redis 缓存 | 降低 DB 压力 |
| >1M 行，复杂查询 | PostgreSQL + 读写分离 | 水平扩展 |

### 何时抽象

**创建抽象**:
- ✅ 有 3+ 个具体实现
- ✅ 需要切换实现（测试、不同环境）
- ✅ 边界自然存在（外部 API、数据库）

**不抽象**:
- ❌ 只有 1 个具体案例
- ❌ "可能以后需要"
- ❌ 为了模式而模式

### 依赖方向

```
Domain ← Application ← Infrastructure
         ↑
      绝不反向
```

Domain/core 不应该依赖 infrastructure。使用接口/端口。

---

## 💻 代码模式

### 命名模式

| 类型 | 模式 | 示例 |
|------|------|------|
| 布尔值 | `is`, `has`, `should`, `can` | `isActive`, `hasPermission` |
| 函数 | 动词 + 名词 | `getUserById`, `validateEmail` |
| Handler | `handle` + 事件 | `handleSubmit`, `handleError` |
| 转换 | `to` + 目标 | `toDTO`, `toJSON` |

**避免**: `data`, `info`, `temp`, `result`, `handle`（无上下文）

### 函数结构

```typescript
function processOrder(order: Order): Result<Order, ValidationError> {
  // 1. 尽早验证，快速返回/抛出
  if (!order) {
    return { ok: false, error: new ValidationError('order required') };
  }
  
  // 2. 主要逻辑（单一职责）
  const validated = validateOrder(order);
  const enriched = enrichOrder(validated);
  
  // 3. 显式返回
  return { ok: true, value: enriched };
}
```

**最大行数**: 20-30 行。超过就提取。

### 条件模式

**Early Returns**:
```typescript
// ❌ 金字塔
function process(user: User) {
  if (user) {
    if (user.active) {
      if (user.verified) {
        return doWork(user);
      }
    }
  }
  return null;
}

// ✅ 扁平
function process(user: User) {
  if (!user) return null;
  if (!user.active) return null;
  if (!user.verified) return null;
  return doWork(user);
}
```

---

## 🚨 常见陷阱

| 陷阱 | 后果 | 预防 |
|------|------|------|
| Inventing APIs | 代码不编译 | 先查文档确认方法存在 |
| Over-engineering | 3 小时而不是 30 分钟 | 问："我有 3 个具体案例吗？" |
| Ignoring context | 建议错误的技术栈 | 先读现有文件 |
| Copy-paste | 隐藏 bug | 解释代码做了什么 |
| 空错误处理 | 生产环境静默失败 | 总是 log + type + rethrow |
| 过早抽象 | 无收益的复杂性 | YAGNI |

---

## 🎯 实战检查清单

### 写代码前

```markdown
- [ ] 已阅读项目现有代码风格
- [ ] 已了解项目技术栈和依赖
- [ ] 已明确需求（不是假设）
- [ ] 已考虑边界情况
```

### 写代码中

```markdown
- [ ] 函数保持短小（<30 行）
- [ ] 错误处理完整
- [ ] 命名清晰
- [ ] 没有魔术数字
- [ ] 分层清晰
```

### 写代码后

```markdown
- [ ] 代码能编译/运行
- [ ] 关键逻辑有测试
- [ ] 没有死代码
- [ ] 注释解释 why 不是 what
- [ ] 已记录 trade-offs
```

### Code Review

```markdown
- [ ] 架构是否合理
- [ ] 边界是否清晰
- [ ] 错误处理是否完整
- [ ] 测试是否覆盖关键路径
- [ ] 是否有过度设计
```

---

## 📈 能力提升路径

### 阶段 1: 基础（已完成）
- ✅ 理解 7 条核心规则
- ✅ 能写出可编译的代码
- ✅ 基本的错误处理

### 阶段 2: 进阶（进行中）
- [ ] 分层架构成为本能
- [ ] 恰当的抽象时机
- [ ] 完整的测试覆盖

### 阶段 3: 高级（目标）
- [ ] 明确的权衡决策
- [ ] PR-Ready 代码质量
- [ ] Code Review 能力

### 阶段 4: 专家（持续）
- [ ] 架构设计能力
- [ ] 技术选型能力
- [ ] 指导他人能力

---

## 🧠 内化练习

### 每日练习

1. **代码审查练习**: 看一段代码，识别问题
2. **重构练习**: 把糟糕代码改好
3. **设计练习**: 给定需求，设计架构

### 反思问题

每次写代码后问自己：
1. 这段代码 30 秒内能理解吗？
2. 错误处理完整吗？
3. 如果出问题，知道哪里错吗？
4. 有过度设计吗？
5. 测试覆盖了吗？

---

## 📚 持续学习

### 推荐阅读

- 《Clean Code》- 代码整洁之道
- 《The Pragmatic Programmer》- 程序员修炼之道
- 《Designing Data-Intensive Applications》- 数据密集型应用设计

### 实践项目

- [ ] 重构一个旧项目
- [ ] 为一个开源项目贡献代码
- [ ] 写技术博客分享经验

---

**最后更新**: 2026-03-12  
**状态**: 学习中，持续改进

*AI Operator - 向高级工程师迈进*
