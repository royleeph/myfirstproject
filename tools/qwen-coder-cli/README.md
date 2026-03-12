# 🤖 Qwen Coder CLI - 通义灵码代码生成工具

> 使用通义千问代码模型进行代码生成、审查和解释

---

## 📦 安装

### 依赖

```bash
# 已安装
pip3 install dashscope
```

### 配置

```bash
# 方式 1: 使用默认 API Key（已配置）
# API Key: sk-sp-b36bbbfc16bf49e4aa48b9a4f94cbc6d

# 方式 2: 配置自己的 API Key
./qwen-coder config sk-your-api-key-here

# 方式 3: 使用环境变量
export QWEN_API_KEY=sk-your-api-key-here
```

---

## 🚀 使用方法

### 1. 生成代码

```bash
# 生成 Python 代码
./qwen-coder generate "写一个快速排序算法"

# 生成 JavaScript 代码
./qwen-coder generate "用 JavaScript 写一个防抖函数"

# 生成特定语言
./qwen-coder generate "用 Rust 写一个链表"
```

### 2. 解释代码

```bash
# 解释文件
./qwen-coder explain < script.py

# 解释代码片段
echo "def factorial(n): return 1 if n <= 1 else n * factorial(n-1)" | ./qwen-coder explain
```

### 3. 审查代码

```bash
# 审查文件
./qwen-coder review < script.py

# 审查代码片段
echo "password = '123456'" | ./qwen-coder review
```

---

## 📋 命令

| 命令 | 说明 | 示例 |
|------|------|------|
| `generate` | 生成代码 | `./qwen-coder generate "写个排序"` |
| `explain` | 解释代码 | `./qwen-coder explain < file.py` |
| `review` | 审查代码 | `./qwen-coder review < file.py` |
| `config` | 配置 API Key | `./qwen-coder config sk_xxx` |

---

## 🔧 配置

### API Key 存储位置

```
~/.qwen_coder_config
```

### 配置文件格式

```json
{
  "api_key": "sk-your-api-key-here"
}
```

### 环境变量

```bash
export QWEN_API_KEY=sk-your-api-key-here
export DASHSCOPE_API_KEY=sk-your-api-key-here
```

---

## 🎯 使用场景

### 代码生成

```bash
# 生成工具函数
./qwen-coder generate "Python 读取 JSON 文件并解析"

# 生成算法
./qwen-coder generate "二分查找算法"

# 生成测试
./qwen-coder generate "为这个函数写单元测试：def add(a, b): return a + b"
```

### 代码学习

```bash
# 学习开源代码
curl https://raw.githubusercontent.com/.../app.py | ./qwen-coder explain

# 理解复杂逻辑
cat complex_function.py | ./qwen-coder explain
```

### 代码审查

```bash
# 审查自己的代码
git diff HEAD | ./qwen-coder review

# 审查 PR 代码
cat pull_request.diff | ./qwen-coder review
```

---

## 📊 模型信息

| 参数 | 值 |
|------|------|
| **模型** | qwen-coder-plus |
| **提供商** | 阿里云通义千问 |
| **SDK** | dashscope |
| **API Key** | sk-sp-b36bbbfc16bf49e4aa48b9a4f94cbc6d |

---

## ⚠️ 注意事项

1. **API Key 安全**: 不要将 API Key 提交到 Git
2. **网络要求**: 需要访问阿里云 API
3. **速率限制**: 注意 API 调用频率限制
4. **费用**: 使用 API 会产生费用（按 token 计费）

---

## 📝 示例

### 示例 1: 生成快速排序

```bash
$ ./qwen-coder generate "Python 快速排序"

def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)
```

### 示例 2: 解释代码

```bash
$ echo "print([x**2 for x in range(10)])" | ./qwen-coder explain

这段代码使用了列表推导式：
1. range(10) 生成 0-9 的数字序列
2. x**2 对每个数字进行平方运算
3. [x**2 for x in range(10)] 创建包含所有平方数的列表
4. print() 输出结果：[0, 1, 4, 9, 16, 25, 36, 49, 64, 81]
```

### 示例 3: 代码审查

```bash
$ echo "password = '123456'" | ./qwen-coder review

🔴 安全问题:
1. 硬编码密码 - 不应该在代码中硬编码敏感信息
2. 弱密码 - '123456' 是非常弱的密码

✅ 建议:
- 使用环境变量存储敏感信息
- 使用密码管理工具
- 实施密码强度策略
```

---

## 🔗 相关链接

- [通义千问官网](https://tongyi.aliyun.com/)
- [DashScope 文档](https://help.aliyun.com/zh/dashscope/)
- [Qwen Coder 模型](https://help.aliyun.com/zh/dashscope/developer-reference/quick-start)

---

**版本**: 1.0.0  
**创建日期**: 2026-03-13  
**作者**: AI Operator
