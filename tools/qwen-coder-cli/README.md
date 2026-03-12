# 🤖 Qwen Coder CLI - 通义灵码代码生成工具

> 使用通义千问代码模型进行代码生成、审查和解释

---

## 📦 安装

### 依赖

```bash
# 安装 Anthropic SDK
pip3 install anthropic
```

### 配置

**方式 1: 环境变量（推荐）**

```bash
# 添加到 ~/.bashrc 或 ~/.zshrc
export ANTHROPIC_BASE_URL="https://coding.dashscope.aliyuncs.com/apps/anthropic"
export ANTHROPIC_API_KEY="sk-sp-b36bbbfc16bf49e4aa48b9a4f94cbc6d"
export QWEN_MODEL="qwen3-coder-plus"
```

**方式 2: 配置文件**

```bash
# 创建 ~/.qwen_coder_env 文件
cat > ~/.qwen_coder_env << EOF
export ANTHROPIC_BASE_URL="https://coding.dashscope.aliyuncs.com/apps/anthropic"
export ANTHROPIC_API_KEY="sk-sp-b36bbbfc16bf49e4aa48b9a4f94cbc6d"
export QWEN_MODEL="qwen3-coder-plus"
EOF
```

---

## 🚀 使用方法

### 方式 1: Qwen Coder CLI

```bash
# 生成代码
qwen-coder generate "写一个快速排序算法"

# 解释代码
qwen-coder explain < script.py

# 审查代码
qwen-coder review < script.py
```

### 方式 2: Claude Code CLI（推荐）

```bash
# 直接调用
claude -p --model qwen3-coder-plus "用 Python 写一个快速排序"

# 交互式
claude --model qwen3-coder-plus
```

### 方式 3: Python API

```python
from anthropic import Anthropic

client = Anthropic(
    base_url="https://coding.dashscope.aliyuncs.com/apps/anthropic",
    api_key="sk-sp-b36bbbfc16bf49e4aa48b9a4f94cbc6d"
)

response = client.messages.create(
    model="qwen3-coder-plus",
    max_tokens=4096,
    messages=[
        {"role": "user", "content": "写一个 Python Hello World"}
    ]
)

print(response.content[0].text)
```

---

## 📋 命令

| 命令 | 说明 | 示例 |
|------|------|------|
| `generate` | 生成代码 | `qwen-coder generate "写个排序"` |
| `explain` | 解释代码 | `qwen-coder explain < file.py` |
| `review` | 审查代码 | `qwen-coder review < file.py` |

---

## 🔧 配置详情

### API 端点

| 类型 | 端点 |
|------|------|
| **Anthropic 兼容** | https://coding.dashscope.aliyuncs.com/apps/anthropic |
| **OpenAI 兼容** | https://coding.dashscope.aliyuncs.com/v1 |

### 认证

```bash
export ANTHROPIC_API_KEY="sk-sp-b36bbbfc16bf49e4aa48b9a4f94cbc6d"
```

### 模型

```bash
export QWEN_MODEL="qwen3-coder-plus"
```

---

## 🎯 使用场景

### 代码生成

```bash
# 生成工具函数
claude -p --model qwen3-coder-plus "Python 读取 JSON 文件"

# 生成算法
claude -p --model qwen3-coder-plus "二分查找算法"

# 生成测试
claude -p --model qwen3-coder-plus "为这个函数写单元测试"
```

### 代码学习

```bash
# 学习开源代码
curl https://raw.githubusercontent.com/.../app.py | qwen-coder explain

# 理解复杂逻辑
cat complex_function.py | qwen-coder explain
```

### 代码审查

```bash
# 审查自己的代码
git diff HEAD | qwen-coder review

# 审查 PR 代码
cat pull_request.diff | qwen-coder review
```

---

## 📊 配置信息

| 参数 | 值 |
|------|------|
| **模型** | qwen3-coder-plus |
| **提供商** | 阿里云通义千问 |
| **SDK** | anthropic (Anthropic 兼容 API) |
| **API 端点** | https://coding.dashscope.aliyuncs.com/apps/anthropic |
| **API Key** | sk-sp-b36bbbfc16bf49e4aa48b9a4f94cbc6d |

---

## ⚠️ 注意事项

1. **API Key 安全**: 不要将 API Key 提交到 Git
2. **网络要求**: 需要访问阿里云 API
3. **速率限制**: 注意 API 调用频率限制
4. **费用**: 使用 API 会产生费用（按 token 计费）

---

## 🔗 相关链接

- [通义千问官网](https://tongyi.aliyun.com/)
- [DashScope 文档](https://help.aliyun.com/zh/dashscope/)
- [Qwen Coder 模型](https://help.aliyun.com/zh/dashscope/developer-reference/quick-start)

---

**版本**: 1.1.0  
**创建日期**: 2026-03-13  
**更新日期**: 2026-03-13（正确配置方式）  
**作者**: AI Operator
