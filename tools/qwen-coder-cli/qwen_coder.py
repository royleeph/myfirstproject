#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Qwen Coder CLI - 通义灵码代码生成工具
=====================================

使用通义千问代码模型进行代码生成、审查和解释。

API Key 配置：
- 已有 API Key: sk-sp-b36bbbfc16bf49e4aa48b9a4f94cbc6d
- 存储位置：~/.qwen_coder_config

使用方法:
    qwen-coder generate "写一个快速排序"
    qwen-coder explain < file.py
    qwen-coder review < file.py
"""

import os
import sys
import json
from pathlib import Path

# 尝试导入 dashscope
try:
    import dashscope
    from dashscope import Generation
except ImportError:
    print("❌ 错误：缺少 dashscope 库")
    print("请运行：pip3 install dashscope")
    sys.exit(1)

# 配置文件路径
CONFIG_FILE = Path.home() / ".qwen_coder_config"

# 默认 API Key（从 MEMORY.md 获取）
DEFAULT_API_KEY = "sk-sp-b36bbbfc16bf49e4aa48b9a4f94cbc6d"

# 模型配置
QWEN_CODER_MODEL = "qwen-coder-plus"  # 通义灵码代码模型


def load_api_key():
    """加载 API Key"""
    # 1. 尝试从配置文件加载
    if CONFIG_FILE.exists():
        with open(CONFIG_FILE, 'r') as f:
            config = json.load(f)
            api_key = config.get('api_key')
            if api_key:
                return api_key
    
    # 2. 尝试从环境变量加载
    api_key = os.environ.get('QWEN_API_KEY') or os.environ.get('DASHSCOPE_API_KEY')
    if api_key:
        return api_key
    
    # 3. 使用默认 API Key
    return DEFAULT_API_KEY


def save_api_key(api_key):
    """保存 API Key 到配置文件"""
    config = {'api_key': api_key}
    with open(CONFIG_FILE, 'w') as f:
        json.dump(config, f, indent=2)
    print(f"✅ API Key 已保存到 {CONFIG_FILE}")


def generate_code(prompt: str, language: str = "python"):
    """生成代码"""
    api_key = load_api_key()
    dashscope.api_key = api_key
    
    messages = [
        {
            'role': 'system',
            'content': f'你是一个专业的{language}程序员。请生成高质量、可读性强、遵循最佳实践的代码。只返回代码，不要解释。'
        },
        {
            'role': 'user',
            'content': prompt
        }
    ]
    
    try:
        response = Generation.call(
            model=QWEN_CODER_MODEL,
            messages=messages,
            result_format='message'
        )
        
        if response.status_code == 200:
            return response.output.choices[0].message.content
        else:
            return f"❌ 错误：{response.code} - {response.message}"
    
    except Exception as e:
        return f"❌ 异常：{str(e)}"


def explain_code(code: str):
    """解释代码"""
    api_key = load_api_key()
    dashscope.api_key = api_key
    
    messages = [
        {
            'role': 'system',
            'content': '你是一个专业的代码讲解员。请用简洁清晰的语言解释代码的功能、逻辑和关键点。使用中文。'
        },
        {
            'role': 'user',
            'content': f'请解释以下代码：\n\n```{code}```'
        }
    ]
    
    try:
        response = Generation.call(
            model=QWEN_CODER_MODEL,
            messages=messages,
            result_format='message'
        )
        
        if response.status_code == 200:
            return response.output.choices[0].message.content
        else:
            return f"❌ 错误：{response.code} - {response.message}"
    
    except Exception as e:
        return f"❌ 异常：{str(e)}"


def review_code(code: str):
    """审查代码"""
    api_key = load_api_key()
    dashscope.api_key = api_key
    
    messages = [
        {
            'role': 'system',
            'content': '''你是一个资深的代码审查专家。请从以下维度审查代码：
1. 代码质量（命名、结构、可读性）
2. 潜在 Bug（边界条件、错误处理）
3. 安全性（输入验证、敏感信息）
4. 性能（时间复杂度、空间复杂度）
5. 改进建议

请用中文回复，给出具体的问题和修改建议。'''
        },
        {
            'role': 'user',
            'content': f'请审查以下代码：\n\n```{code}```'
        }
    ]
    
    try:
        response = Generation.call(
            model=QWEN_CODER_MODEL,
            messages=messages,
            result_format='message'
        )
        
        if response.status_code == 200:
            return response.output.choices[0].message.content
        else:
            return f"❌ 错误：{response.code} - {response.message}"
    
    except Exception as e:
        return f"❌ 异常：{str(e)}"


def main():
    """主函数"""
    if len(sys.argv) < 2:
        print(__doc__)
        print("\n❌ 错误：请提供命令")
        print("\n可用命令:")
        print("  qwen-coder generate <prompt>  - 生成代码")
        print("  qwen-coder explain < file.py  - 解释代码")
        print("  qwen-coder review < file.py   - 审查代码")
        print("  qwen-coder config <api_key>   - 配置 API Key")
        sys.exit(1)
    
    command = sys.argv[1]
    
    if command == "config":
        if len(sys.argv) < 3:
            print("❌ 请提供 API Key")
            sys.exit(1)
        save_api_key(sys.argv[2])
    
    elif command == "generate":
        if len(sys.argv) < 3:
            print("❌ 请提供代码生成提示")
            print("示例：qwen-coder generate '写一个快速排序'")
            sys.exit(1)
        prompt = " ".join(sys.argv[2:])
        result = generate_code(prompt)
        print(result)
    
    elif command == "explain":
        # 从 stdin 读取代码
        code = sys.stdin.read()
        if not code:
            print("❌ 请提供代码（通过管道或重定向）")
            sys.exit(1)
        result = explain_code(code)
        print(result)
    
    elif command == "review":
        # 从 stdin 读取代码
        code = sys.stdin.read()
        if not code:
            print("❌ 请提供代码（通过管道或重定向）")
            sys.exit(1)
        result = review_code(code)
        print(result)
    
    else:
        print(f"❌ 未知命令：{command}")
        print("\n可用命令:")
        print("  generate - 生成代码")
        print("  explain  - 解释代码")
        print("  review   - 审查代码")
        print("  config   - 配置 API Key")
        sys.exit(1)


if __name__ == "__main__":
    main()
