# 📋 Code Review 代码审查技能

> **目标**: 具备高级工程师的代码审查能力，能轻松看懂、解析、理解、评判代码，发现 BUG、漏洞、错误，并提供修改建议

**创建日期**: 2026-03-12  
**能力等级**: 高级工程师

---

## 🎯 核心能力模型

### Code Review 能力层次

| 层级 | 能力 | 描述 |
|------|------|------|
| **L1: 理解** | 读懂代码 | 理解代码功能、逻辑流程 |
| **L2: 分析** | 识别模式 | 识别设计模式、架构风格 |
| **L3: 发现** | 找出问题 | Bug、安全漏洞、性能问题 |
| **L4: 评判** | 质量评估 | 代码质量、可维护性评分 |
| **L5: 建议** | 改进建议 | 具体可行的修改建议 |
| **L6: 修复** | 直接修改 | 提供修复代码 |

---

## 📚 知识体系

### 1. 代码理解能力

#### 快速理解代码结构

**5 分钟理解法**:
```markdown
1. [ ] 入口在哪里？（main、index、app）
2. [ ] 核心功能是什么？（读 README、注释）
3. [ ] 目录结构如何？（src、lib、test）
4. [ ] 依赖有哪些？（package.json、requirements.txt）
5. [ ] 测试如何运行？（test 命令）
```

**代码阅读顺序**:
```
README → package.json → 入口文件 → 核心模块 → 测试
```

#### 理解代码逻辑

**追踪执行流程**:
```typescript
// 1. 找到入口
// app.ts
app.post('/users', createUserHandler);

// 2. 追踪 Handler
// handlers/user.ts
export async function createUserHandler(req, res) {
  const user = await userService.create(req.body);
  res.json(user);
}

// 3. 追踪 Service
// services/user.ts
export async function create(userData) {
  validateUser(userData);           // ← 验证
  const hashed = await hashPassword(userData.password);  // ← 加密
  return db.users.insert({ ...userData, password: hashed });  // ← 数据库
}
```

**画出调用关系**:
```
Controller → Service → Repository → Database
             ↓
          Validator
```

---

### 2. Bug 发现能力

#### 常见 Bug 模式

**1. 空指针/Undefined**
```typescript
// ❌ 容易出错
const userName = user.name;  // user 可能为 undefined
const firstTag = tags[0];    // tags 可能为空数组

// ✅ 安全写法
const userName = user?.name ?? 'Anonymous';
const firstTag = tags?.[0] ?? null;
```

**检查清单**:
- [ ] 对象属性访问前检查 null/undefined
- [ ] 数组访问前检查长度
- [ ] 函数返回值可能为 null 的情况

---

**2. 类型错误**
```typescript
// ❌ 类型混淆
const count = "5";
const total = count + 1;  // "51" 而不是 6

// ✅ 明确类型
const count = 5;
const total = count + 1;  // 6
```

**检查清单**:
- [ ] 数字运算前确认是 number 类型
- [ ] 字符串拼接前确认是 string 类型
- [ ] 函数参数类型与声明一致

---

**3. 异步错误**
```typescript
// ❌ 忘记 await
async function getData() {
  const data = fetchData();  // 返回 Promise，不是数据
  console.log(data.id);      // undefined
}

// ✅ 正确 await
async function getData() {
  const data = await fetchData();
  console.log(data.id);
}
```

**检查清单**:
- [ ] async 函数内调用 Promise 要 await
- [ ] forEach 内不能用 await（用 for...of）
- [ ] 错误处理有 catch

---

**4. 资源泄漏**
```typescript
// ❌ 文件未关闭
const file = fs.openSync('data.txt', 'r');
const data = fs.readFileSync(file);
// 忘记 fs.closeSync(file)

// ✅ 使用自动关闭
const data = fs.readFileSync('data.txt', 'utf-8');
```

**检查清单**:
- [ ] 文件操作后关闭
- [ ] 数据库连接释放
- [ ] 网络连接关闭
- [ ] 使用 try-finally 或 with

---

**5. 竞态条件**
```typescript
// ❌ 并发修改
let count = 0;
async function increment() {
  count = count + 1;  // 多个调用会丢失更新
}

// ✅ 原子操作或锁
class Counter {
  private count = 0;
  private lock = new Lock();
  
  async increment() {
    await this.lock.acquire();
    try {
      this.count++;
    } finally {
      this.lock.release();
    }
  }
}
```

**检查清单**:
- [ ] 共享状态并发访问
- [ ] 数据库事务隔离
- [ ] 前端重复提交

---

#### Bug 检查清单（完整版）

**逻辑错误**:
- [ ] 边界条件（0、-1、空数组、null）
- [ ] 循环终止条件
- [ ] 条件判断完整性（if-else 覆盖所有情况）
- [ ] 返回值处理

**数据错误**:
- [ ] 输入验证
- [ ] 类型转换
- [ ] 数据格式化
- [ ] 编码问题（UTF-8、Base64）

**并发错误**:
- [ ] 竞态条件
- [ ] 死锁
- [ ] 资源争用

**集成错误**:
- [ ] API 调用超时
- [ ] 网络错误处理
- [ ] 第三方服务失败

---

### 3. 安全漏洞发现能力

#### OWASP Top 10 检查

**1. 注入攻击（Injection）**
```typescript
// ❌ SQL 注入
const sql = `SELECT * FROM users WHERE id = ${userId}`;

// ✅ 参数化查询
const sql = 'SELECT * FROM users WHERE id = ?';
db.execute(sql, [userId]);
```

**检查点**:
- [ ] SQL 查询使用参数化
- [ ] 不拼接用户输入到命令
- [ ] 输入验证和转义

---

**2. XSS（跨站脚本）**
```typescript
// ❌ 直接渲染用户输入
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// ✅ 转义或使用纯文本
<div>{userContent}</div>  // React 自动转义
```

**检查点**:
- [ ] 用户输入转义
- [ ] 不使用 innerHTML
- [ ] CSP 头配置

---

**3. 认证和会话管理**
```typescript
// ❌ 弱密码验证
if (password === user.password) {}  // 明文存储

// ✅ 哈希存储
const valid = await bcrypt.compare(password, user.hashedPassword);
```

**检查点**:
- [ ] 密码哈希存储（bcrypt、argon2）
- [ ] Session 安全配置
- [ ] JWT 签名验证
- [ ] 登录失败限制

---

**4. 敏感数据暴露**
```typescript
// ❌ 日志打印敏感信息
console.log('User login:', { email, password });

// ✅ 脱敏
console.log('User login:', { email, password: '***' });
```

**检查点**:
- [ ] 密码、Token 不日志
- [ ] 敏感数据加密传输（HTTPS）
- [ ] 数据库加密存储

---

**5. 权限控制**
```typescript
// ❌ 缺少权限检查
app.delete('/users/:id', (req, res) => {
  db.users.delete(req.params.id);  // 任何人都能删除
});

// ✅ 权限验证
app.delete('/users/:id', authMiddleware, (req, res) => {
  if (!req.user.isAdmin) return res.status(403).send();
  db.users.delete(req.params.id);
});
```

**检查点**:
- [ ] 每层都验证权限
- [ ] 不信任客户端传入的用户 ID
- [ ] 水平权限（只能访问自己的数据）
- [ ] 垂直权限（管理员功能）

---

**6. 文件上传安全**
```typescript
// ❌ 不验证文件类型
app.post('/upload', (req, res) => {
  const file = req.files[0];
  fs.writeFileSync(`uploads/${file.name}`, file.data);  // 可能上传 .php、.exe
});

// ✅ 验证文件类型和大小
const allowedTypes = ['image/jpeg', 'image/png'];
const maxSize = 5 * 1024 * 1024;  // 5MB

if (!allowedTypes.includes(file.mimetype)) {
  return res.status(400).send('Invalid file type');
}
if (file.size > maxSize) {
  return res.status(400).send('File too large');
}
```

**检查点**:
- [ ] 验证文件类型（MIME，不是扩展名）
- [ ] 限制文件大小
- [ ] 重命名文件（不用原名）
- [ ] 存储在非 Web 目录

---

#### 安全检查清单（完整版）

| 类别 | 检查项 | 优先级 |
|------|--------|--------|
| **注入** | SQL 参数化、命令转义 | 🔴 Critical |
| **XSS** | 输入转义、CSP | 🔴 Critical |
| **认证** | 密码哈希、Session 安全 | 🔴 Critical |
| **授权** | 权限验证、水平/垂直权限 | 🔴 Critical |
| **数据** | 敏感数据加密、HTTPS | 🟠 High |
| **日志** | 不记录敏感信息 | 🟠 High |
| **文件** | 上传验证、存储安全 | 🟠 High |
| **依赖** | 无已知漏洞（npm audit） | 🟡 Medium |

---

### 4. 性能问题发现能力

#### 常见性能问题

**1. N+1 查询**
```typescript
// ❌ N+1 问题
const users = await db.users.findMany();
for (const user of users) {
  user.orders = await db.orders.findMany({ userId: user.id });  // N 次查询
}

// ✅ 批量查询
const users = await db.users.findMany({ include: { orders: true } });  // 1 次查询
```

**检查点**:
- [ ] 循环内无数据库查询
- [ ] 使用 JOIN 或 include
- [ ] 批量操作代替单个操作

---

**2. 内存泄漏**
```typescript
// ❌ 无限增长
const cache = {};
function getData(key) {
  if (!cache[key]) {
    cache[key] = fetchData();  // 只增不减
  }
  return cache[key];
}

// ✅ LRU 缓存
const cache = new LRUCache({ max: 1000 });
```

**检查点**:
- [ ] 缓存有上限和过期
- [ ] 事件监听器移除
- [ ] 定时器清理
- [ ] 大对象及时释放

---

**3. 重复计算**
```typescript
// ❌ 重复计算
function getTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {  // 每次都计算 length
    total += items[i].price;
  }
  return total;
}

// ✅ 缓存长度
function getTotal(items) {
  let total = 0;
  const len = items.length;  // 缓存
  for (let i = 0; i < len; i++) {
    total += items[i].price;
  }
  return total;
}
```

**检查点**:
- [ ] 循环内不重复计算
- [ ] 缓存昂贵计算结果
- [ ] 使用 memoization

---

**4. 阻塞操作**
```typescript
// ❌ 同步阻塞
app.get('/data', (req, res) => {
  const data = fs.readFileSync('data.json');  // 阻塞事件循环
  res.json(data);
});

// ✅ 异步非阻塞
app.get('/data', async (req, res) => {
  const data = await fs.promises.readFile('data.json');
  res.json(data);
});
```

**检查点**:
- [ ] 无同步文件 I/O
- [ ] 无同步网络请求
- [ ] 耗时操作后台处理

---

#### 性能检查清单

| 类别 | 检查项 | 影响 |
|------|--------|------|
| **数据库** | 无 N+1 查询、有索引 | 🔴 高 |
| **缓存** | 热点数据缓存 | 🔴 高 |
| **内存** | 无泄漏、有上限 | 🟠 中 |
| **I/O** | 异步非阻塞 | 🟠 中 |
| **计算** | 无重复计算 | 🟡 低 |

---

### 5. 代码质量评判能力

#### 代码质量维度

**1. 可读性**
```typescript
// ❌ 难读
function p(u) { return u.a ? u.a + ' ' + u.b : u.b; }

// ✅ 清晰
function formatUserName(user: User): string {
  if (user.firstName) {
    return `${user.firstName} ${user.lastName}`;
  }
  return user.lastName;
}
```

**评分标准**:
- 5 分：30 秒内理解
- 3 分：需要思考几分钟
- 1 分：难以理解

---

**2. 可维护性**
```typescript
// ❌ 难维护
function process(data, flag, opt1, opt2, opt3, opt4, opt5) {
  // 100 行代码，各种 if-else
}

// ✅ 易维护
interface ProcessOptions {
  flag: boolean;
  opt1?: string;
  opt2?: number;
}

function process(data: Data, options: ProcessOptions): Result {
  // 职责单一
}
```

**评分标准**:
- 5 分：容易修改和扩展
- 3 分：需要小心修改
- 1 分：不敢修改

---

**3. 可测试性**
```typescript
// ❌ 难测试
class UserService {
  private db = new Database();  // 硬编码依赖
  async getUser(id: number) {
    return this.db.query(`SELECT * FROM users WHERE id = ${id}`);
  }
}

// ✅ 易测试
class UserService {
  constructor(private db: Database) {}  // 依赖注入
  async getUser(id: number) {
    return this.db.query('SELECT * FROM users WHERE id = ?', [id]);
  }
}
```

**评分标准**:
- 5 分：容易写单元测试
- 3 分：可以测试但麻烦
- 1 分：难以测试

---

#### 代码质量评分表

| 维度 | 权重 | 得分 (1-5) | 加权分 |
|------|------|-----------|--------|
| **可读性** | 25% | | |
| **可维护性** | 25% | | |
| **可测试性** | 20% | | |
| **性能** | 15% | | |
| **安全** | 15% | | |
| **总分** | 100% | | |

**评级**:
- 4.5-5.0: ⭐⭐⭐⭐⭐ 优秀
- 4.0-4.4: ⭐⭐⭐⭐ 良好
- 3.0-3.9: ⭐⭐⭐ 合格
- 2.0-2.9: ⭐⭐ 需要改进
- 1.0-1.9: ⭐ 不合格

---

### 6. 改进建议能力

#### 建议的 SMART 原则

**Specific（具体）**:
- ❌ "改进性能"
- ✅ "添加 Redis 缓存用户查询，减少数据库负载"

**Measurable（可衡量）**:
- ❌ "更快"
- ✅ "响应时间从 500ms 降低到 100ms"

**Achievable（可实现）**:
- ❌ "重写整个系统"
- ✅ "重构这个函数，提取为 3 个小函数"

**Relevant（相关）**:
- ❌ "使用最新框架"
- ✅ "升级到 Express 5，因为需要 WebSocket 支持"

**Time-bound（有时限）**:
- ❌ "以后优化"
- ✅ "下周前完成，因为下周有流量高峰"

---

#### 建议优先级

| 优先级 | 标准 | 示例 |
|--------|------|------|
| **P0** | 必须立即修复 | 安全漏洞、数据丢失 Bug |
| **P1** | 尽快修复 | 功能 Bug、性能瓶颈 |
| **P2** | 计划内修复 | 代码异味、技术债务 |
| **P3** | 可选优化 | 代码风格、小优化 |

---

### 7. 直接修复能力

#### 修复代码模板

**Bug 修复**:
```typescript
// ❌ 原代码（有问题）
function getUserTotal(userId: string): number {
  const user = db.users.find(userId);
  const orders = db.orders.findByUser(userId);
  return orders.reduce((sum, o) => sum + o.total, 0);  // user 可能 undefined
}

// ✅ 修复后
function getUserTotal(userId: string): number {
  const user = db.users.find(userId);
  if (!user) {
    throw new NotFoundError(`User ${userId} not found`);
  }
  const orders = db.orders.findByUser(userId);
  return orders.reduce((sum, o) => sum + o.total, 0);
}
```

---

## 🧪 Code Review 检查清单

### 通用检查清单

#### 功能正确性
- [ ] 代码实现需求功能
- [ ] 边界情况处理（空、null、0、-1）
- [ ] 错误处理完整
- [ ] 返回值正确

#### 代码质量
- [ ] 函数短小（<30 行）
- [ ] 命名清晰
- [ ] 无重复代码（DRY）
- [ ] 单一职责（SRP）

#### 安全性
- [ ] 无 SQL 注入
- [ ] 无 XSS 漏洞
- [ ] 输入验证
- [ ] 权限检查

#### 性能
- [ ] 无 N+1 查询
- [ ] 缓存合理使用
- [ ] 无内存泄漏
- [ ] 异步非阻塞

#### 测试
- [ ] 有单元测试
- [ ] 覆盖边界情况
- [ ] 测试通过

#### 文档
- [ ] 必要的注释
- [ ] API 文档更新
- [ ] README 更新

---

## 📋 Code Review 报告模板

```markdown
# Code Review 报告

**PR**: #[编号] - [标题]  
**作者**: @[作者]  
**审查人**: @[审查人]  
**日期**: YYYY-MM-DD

---

## 📊 总体评分

| 维度 | 得分 | 备注 |
|------|------|------|
| 功能正确性 | ⭐⭐⭐⭐⭐ | 功能完整 |
| 代码质量 | ⭐⭐⭐⭐ | 少量改进空间 |
| 安全性 | ⭐⭐⭐⭐⭐ | 无安全问题 |
| 性能 | ⭐⭐⭐⭐ | 有优化空间 |
| 测试覆盖 | ⭐⭐⭐ | 需补充边界测试 |

**总体**: ⭐⭐⭐⭐ 良好，建议修改后合并

---

## ✅ 优点

1. **架构清晰**: 分层合理，职责明确
2. **命名规范**: 变量/函数名清晰表达意图
3. **错误处理**: 完整的 try-catch 和错误日志

---

## 🔴 必须修复（P0）

### 1. [问题标题]
**位置**: `file.ts:line`  
**类型**: Bug / 安全 / 性能  
**描述**: [问题描述]  
**建议**: 
```typescript
// 原代码
[有问题的代码]

// 建议修改为
[修复后的代码]
```

---

## 🟠 建议修复（P1）

### 1. [问题标题]
**位置**: `file.ts:line`  
**描述**: [问题描述]  
**建议**: [修改建议]

---

## 🟡 可选优化（P2）

### 1. [优化建议]
**位置**: `file.ts:line`  
**描述**: [优化描述]  
**收益**: [优化后的收益]

---

## 📝 其他意见

- [其他评论或建议]

---

## ✅ 审查结论

- [ ] **批准合并** - 代码质量良好，无阻塞问题
- [x] **修改后合并** - 需要修复 P0/P1 问题
- [ ] **需要重审** - 有重大架构问题
- [ ] **拒绝** - 方向错误或质量太差

**下一步**: 请修复 P0 和 P1 问题后合并
```

---

## 🎯 实战练习

### 练习 1: 找出 Bug

```typescript
// 找出以下代码的问题
async function processUsers(userIds: string[]) {
  const results = [];
  userIds.forEach(async (id) => {
    const user = await getUser(id);
    const data = transformUser(user);
    results.push(data);
  });
  return results;  // 问题：返回空数组
}
```

**答案**:
```typescript
// 问题：forEach 不支持 async，应该用 for...of 或 Promise.all
async function processUsers(userIds: string[]) {
  const results = [];
  for (const id of userIds) {  // ✅ 正确
    const user = await getUser(id);
    const data = transformUser(user);
    results.push(data);
  }
  return results;
}

// 或并行处理
async function processUsers(userIds: string[]) {
  return Promise.all(userIds.map(id => {
    const user = await getUser(id);
    return transformUser(user);
  }));
}
```

---

## 📚 持续学习

### 推荐资源

**书籍**:
- 《Code Review 最佳实践》
- 《Clean Code》
- 《The Art of Code Review》

**工具**:
- ESLint - 代码风格检查
- SonarQube - 代码质量平台
- GitHub Code Review - PR 审查

**实践**:
- 每日 Code Review 练习
- 参与开源项目审查
- 写 Code Review 博客

---

**最后更新**: 2026-03-12  
**状态**: 持续完善中

*AI Operator - 具备高级工程师 Code Review 能力*
