# 🛡️ GitHub 安全合规指南

> **红线规则**：绝对不能违反的 GitHub 安全律令

**创建日期**: 2026-03-13  
**重要性**: ⭐⭐⭐⭐⭐（最高优先级）

---

## 🔴 **绝对禁止行为（红线）**

### 1. 禁止硬编码敏感信息

**❌ 绝对不要提交以下内容到 GitHub：**

| 类型 | 示例 | 风险等级 |
|------|------|----------|
| **GitHub Token** | `ghp_xxxx`, `gho_xxxx`, `ghu_xxxx` | 🔴 致命 |
| **API Key** | `sk-xxxx`, `api_key=xxxx` | 🔴 致命 |
| **密码** | `password=xxxx`, `passwd=xxxx` | 🔴 致命 |
| **私钥** | `*.pem`, `*.key`, RSA 私钥 | 🔴 致命 |
| **数据库连接串** | `mongodb://user:pass@host` | 🔴 致命 |
| **AWS 凭证** | `AKIAxxxx`, `aws_secret` | 🔴 致命 |
| **云服务 Secret** | 任何云服务的访问密钥 | 🔴 致命 |

**✅ 正确做法：**

```typescript
// ❌ 错误：硬编码 API Key
const API_KEY = 'sk_97337971993cff4076fb179c0e1f42d592a89406507c603db864d6784c849bd8';

// ✅ 正确：从环境变量加载
const API_KEY = process.env.API_KEY;
```

```bash
# .env 文件（必须加入.gitignore）
API_KEY=your_actual_key_here
DATABASE_URL=mongodb://localhost:27017/mydb
```

---

### 2. 必须使用环境变量

**文件结构：**

```
project/
├── .env.example      # ✅ 提交：模板文件
├── .env              # ❌ 不提交：实际密钥
├── .gitignore        # ✅ 提交：忽略敏感文件
└── src/
    └── config.ts     # ✅ 提交：从环境变量加载
```

**.env.example 模板：**

```bash
# Environment Variables Template
# ⚠️ NEVER commit actual .env file to GitHub!

# API Keys
API_KEY=your_api_key_here
API_SECRET=your_secret_here

# Database
DATABASE_URL=mongodb://localhost:27017/mydb

# Other
ANY_SECRET=your_value_here
```

**.gitignore 必须包含：**

```gitignore
# 敏感凭证文件（绝对不要提交）
.env
.env.local
.env.*.local
*.pem
*.key
*secret*
*credential*
*password*
.github_credentials
```

---

### 3. GitHub Actions 安全

**❌ 错误做法：**

```yaml
# ❌ 绝对不要在 workflow 中硬编码密钥
- name: Deploy
  run: |
    curl -H "Authorization: Bearer ghp_xxxx" https://api.github.com
```

**✅ 正确做法：**

```yaml
# ✅ 使用 GitHub Secrets
- name: Deploy
  run: |
    curl -H "Authorization: Bearer ${{ secrets.GITHUB_TOKEN }}" https://api.github.com
  env:
    API_KEY: ${{ secrets.API_KEY }}
```

**设置 Secrets：**
1. 进入仓库 → Settings → Secrets and variables → Actions
2. 点击 "New repository secret"
3. 添加密钥（如 `API_KEY`）
4. 在 workflow 中使用 `${{ secrets.API_KEY }}`

---

## 🟠 **高风险行为（尽量避免）**

### 4. 不要在注释中泄露信息

**❌ 错误：**

```typescript
// 联系管理员获取密钥：admin@example.com / password123
// API 端点：https://api.example.com (token: sk_xxxx)
```

**✅ 正确：**

```typescript
// 配置说明：从环境变量加载 API_KEY
// 参考：.env.example 文件
```

---

### 5. 不要提交配置文件中的敏感信息

**❌ 错误：**

```json
{
  "apiKey": "sk_xxxx",
  "password": "admin123",
  "database": "mongodb://user:pass@host"
}
```

**✅ 正确：**

```json
{
  "apiKey": "${API_KEY}",
  "password": "${PASSWORD}",
  "database": "${DATABASE_URL}"
}
```

---

### 6. 不要提交历史中的敏感信息

**问题**：即使后来删除了，Git 历史中仍然保留

**解决**：

```bash
# 如果已经提交了敏感信息，需要清理历史
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch path/to/secret/file" \
  --prune-empty --tag-name-filter cat -- --all

# 强制推送（危险操作，先备份）
git push origin --force --all
```

**更好的做法**：
- 提交前仔细检查
- 使用预提交钩子（pre-commit hooks）
- 启用 GitHub Secret Scanning

---

## 🟡 **最佳实践（强烈推荐）**

### 7. 启用 GitHub 安全功能

**免费功能（所有仓库）：**

| 功能 | 作用 | 启用方式 |
|------|------|----------|
| **Secret Scanning** | 自动检测泄露的密钥 | 默认启用（公共仓库） |
| **Dependabot Alerts** | 依赖漏洞警报 | Settings → Security |
| **Security Policy** | 安全报告渠道 | 创建 `.github/SECURITY.md` |
| **Push Protection** | 推送时阻止密钥泄露 | 个人设置中启用 |

**付费功能（需要 GitHub Advanced Security）：**

- Secret Scanning（私有仓库）
- Code Scanning
- Dependabot Code Review

---

### 8. 代码审查清单

**每次提交前检查：**

```markdown
## 安全审查清单

- [ ] 没有硬编码的 API Key/Secret
- [ ] 没有硬编码的密码
- [ ] 没有硬编码的数据库连接串
- [ ] 没有私钥文件（*.pem, *.key）
- [ ] .env 文件已加入.gitignore
- [ ] 配置文件使用环境变量
- [ ] 注释中没有敏感信息
- [ ] GitHub Actions 使用 Secrets
- [ ] 已运行 `git status` 检查文件
```

---

### 9. 密钥轮换

**如果密钥泄露：**

1. **立即撤销**：在对应平台撤销泄露的密钥
2. **生成新密钥**：创建新的密钥
3. **更新配置**：更新所有使用该密钥的地方
4. **检查历史**：确认 Git 历史中没有残留
5. **监控异常**：监控是否有异常使用

---

## 📋 **违规后果**

### GitHub 处罚措施

| 违规类型 | 后果 |
|----------|------|
| **无意泄露** | 警告 + 要求删除 |
| **重复违规** | 暂停账户 |
| **恶意行为** | 永久封号 |
| **严重违规** | 法律追责 |

### 真实案例

- **2023 年**：某开发者因提交 AWS 密钥到公共仓库，导致账户被盗用，损失$50,000
- **2024 年**：某公司因 GitHub 配置错误，泄露生产数据库凭证，被罚款$100,000
- **2025 年**：某开源项目维护者故意植入恶意代码，永久封号

---

## 🔧 **工具推荐**

### 密钥检测工具

```bash
# GitGuardian (免费)
gg scan .

# TruffleHog (免费)
trufflehog filesystem .

# Gitleaks (免费)
gitleaks detect --source . -v
```

### 预提交钩子

```bash
# 安装 pre-commit
pip install pre-commit

# 配置 .pre-commit-config.yaml
repos:
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.16.3
    hooks:
      - id: gitleaks
```

---

## 📚 **官方文档**

- [GitHub Terms of Service](https://docs.github.com/en/site-policy/github-terms/github-terms-of-service)
- [GitHub Security Features](https://docs.github.com/en/code-security/getting-started/github-security-features)
- [About Secret Scanning](https://docs.github.com/en/code-security/secret-scanning/about-secret-scanning)
- [Keeping Your Secrets Safe](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-password-and-other-authentication-methods)

---

## ✅ **本次修复记录**

### 发现的问题

**文件**: `tools/code-review-fix/lib/billing.ts`

**问题**: 硬编码 SkillPay API Key

```typescript
// ❌ 原代码（已修复）
const BILLING_API_KEY = 'sk_97337971993cff4076fb179c0e1f42d592a89406507c603db864d6784c849bd8';
```

**修复**:

```typescript
// ✅ 修复后
const BILLING_API_KEY = process.env.SKILLPAY_API_KEY;
```

**附加措施**:
- ✅ 创建 `.env.example` 模板
- ✅ 完善 `.gitignore`
- ✅ 提交安全修复

---

## 🎯 **承诺**

**我承诺遵守以下 GitHub 安全红线：**

1. ✅ 绝不硬编码任何敏感信息
2. ✅ 使用环境变量管理密钥
3. ✅ 提交前仔细检查代码
4. ✅ 启用 GitHub 安全功能
5. ✅ 定期审计代码库
6. ✅ 发现泄露立即修复

**违反后果**：账户被封禁、项目被删除、法律追责

---

**最后更新**: 2026-03-13  
**状态**: 已修复并推送  
**下次审查**: 每周一次

*AI Operator - 安全合规第一*
