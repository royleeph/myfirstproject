# ✅ Qwen Coder CLI 配置完成

**更新日期**: 2026-03-13 01:40  
**状态**: ✅ 已正确配置

---

## ✅ 完成的配置

### 1. 环境变量配置

**文件**: `~/.qwen_coder_env`

```bash
export ANTHROPIC_BASE_URL="https://coding.dashscope.aliyuncs.com/apps/anthropic"
export ANTHROPIC_API_KEY="sk-sp-b36bbbfc16bf49e4aa48b9a4f94cbc6d"
export QWEN_MODEL="qwen3-coder-plus"
```

### 2. 工具更新

**文件**: `tools/qwen-coder-cli/qwen_coder.py`

- ✅ 使用 Anthropic SDK（兼容接口）
- ✅ 正确的 API 端点
- ✅ 正确的模型名称：`qwen3-coder-plus`
- ✅ 自动加载环境变量

### 3. 文档更新

**文件**: `tools/qwen-coder-cli/README.md`

- ✅ 3 种使用方式
- ✅ 完整配置说明
- ✅ 使用示例

---

## 🚀 使用方法

### 方式 1: Claude Code CLI（推荐）

```bash
# 最简单的方式
claude -p --model qwen3-coder-plus "用 Python 写一个快速排序"

# 交互式编程
claude --model qwen3-coder-plus
```

### 方式 2: Qwen Coder CLI

```bash
# 加载环境变量
. ~/.qwen_coder_env

# 生成代码
qwen-coder generate "写一个 Hello World"

# 解释代码
qwen-coder explain < file.py

# 审查代码
qwen-coder review < file.py
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
        {"role": "user", "content": "Hello World"}
    ]
)
```

---

## 📊 配置对比

| 项目 | 旧配置（错误） | 新配置（正确） |
|------|---------------|---------------|
| **SDK** | dashscope | anthropic |
| **API 端点** | 默认 | https://coding.dashscope.aliyuncs.com/apps/anthropic |
| **模型** | qwen-coder-plus | qwen3-coder-plus |
| **调用方式** | 直接 API | Anthropic 兼容接口 |

---

## ✅ 验证配置

```bash
# 测试 Claude Code CLI
claude -p --model qwen3-coder-plus "Hello"

# 测试 Qwen Coder CLI
. ~/.qwen_coder_env
qwen-coder generate "Hello World"
```

---

**配置已完成，现在可以正常使用 Qwen Coder 了！** 🦞

*AI Operator - 2026-03-13 01:40*
