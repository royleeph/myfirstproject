#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Qwen Coder CLI - 通义灵码代码生成工具
=====================================

配置方式：
- API 端点：https://coding.dashscope.aliyuncs.com/apps/anthropic (Anthropic 兼容)
- API Key: sk-sp-b36bbbfc16bf49e4aa48b9a4f94cbc6d
- 模型：qwen3-coder-plus

使用方法:
    claude -p --model qwen3-coder-plus "你的编程问题"
    qwen-coder generate "写一个快速排序"
    qwen-coder explain < file.py
    qwen-coder review < file.py
"""

import os
import sys
import json
from pathlib import Path

# 尝试导入 anthropic
try:
    from anthropic import Anthropic
except ImportError:
    print("❌ 错误：缺少 anthropic 库")
    print("请运行：pip3 install anthropic")
    sys.exit(1)

# 配置文件路径
CONFIG_FILE = Path.home() / ".qwen_coder_env"

# 默认配置（从用户提供的信息）
DEFAULT_CONFIG = {
    'base_url': "https://coding.dashscope.aliyuncs.com/apps/anthropic",
    'api_key': "sk-sp-b36bbbfc16bf49e4aa48b9a4f94cbc6d",
    'model': "qwen3-coder-plus"
}


def load_config():
    """加载配置"""
    # 1. 优先使用环境变量
    config = {
        'base_url': os.environ.get('ANTHROPIC_BASE_URL', DEFAULT_CONFIG['base_url']),
        'api_key': os.environ.get('ANTHROPIC_API_KEY', DEFAULT_CONFIG['api_key']),
        'model': os.environ.get('QWEN_MODEL', DEFAULT_CONFIG['model'])
    }
    
    # 2. 尝试从配置文件加载
    if CONFIG_FILE.exists():
        with open(CONFIG_FILE, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    key = key.strip().replace('export ', '')
                    value = value.strip().strip('"\'')
                    if key == 'ANTHROPIC_BASE_URL':
                        config['base_url'] = value
                    elif key == 'ANTHROPIC_API_KEY':
                        config['api_key'] = value
                    elif key == 'QWEN_MODEL':
                        config['model'] = value
    
    return config


def get_client():
    """获取 Anthropic 客户端"""
    config = load_config()
    return Anthropic(
        base_url=config['base_url'],
        api_key=config['api_key']
    )


def generate_code(prompt: str, language: str = "python"):
    """生成代码"""
    client = get_client()
    config = load_config()
    
    try:
        response = client.messages.create(
            model=config['model'],
            max_tokens=4096,
            system=f"你是一个专业的{language}程序员。请生成高质量、可读性强、遵循最佳实践的代码。",
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        return response.content[0].text
    except Exception as e:
        return f"❌ 错误：{str(e)}"


def explain_code(code: str):
    """解释代码"""
    client = get_client()
    config = load_config()
    
    try:
        response = client.messages.create(
            model=config['model'],
            max_tokens=4096,
            system="你是一个专业的代码讲解员。请用简洁清晰的语言解释代码的功能、逻辑和关键点。使用中文。",
            messages=[
                {"role": "user", "content": f"请解释以下代码：\n\n```{code}```"}
            ]
        )
        return response.content[0].text
    except Exception as e:
        return f"❌ 错误：{str(e)}"


def review_code(code: str):
    """审查代码"""
    client = get_client()
    config = load_config()
    
    try:
        response = client.messages.create(
            model=config['model'],
            max_tokens=4096,
            system="""你是一个资深的代码审查专家。请从以下维度审查代码：
1. 代码质量（命名、结构、可读性）
2. 潜在 Bug（边界条件、错误处理）
3. 安全性（输入验证、敏感信息）
4. 性能（时间复杂度、空间复杂度）
5. 改进建议

请用中文回复，给出具体的问题和修改建议。""",
            messages=[
                {"role": "user", "content": f"请审查以下代码：\n\n```{code}```"}
            ]
        )
        return response.content[0].text
    except Exception as e:
        return f"❌ 错误：{str(e)}"


def main():
    """主函数"""
    if len(sys.argv) < 2:
        print(__doc__)
        print("\n❌ 错误：请提供命令")
        print("\n可用命令:")
        print("  qwen-coder generate <prompt>  - 生成代码")
        print("  qwen-coder explain < file.py  - 解释代码")
        print("  qwen-coder review < file.py   - 审查代码")
        print("\n或者使用 Claude Code CLI:")
        print('  claude -p --model qwen3-coder-plus "你的编程问题"')
        sys.exit(1)
    
    command = sys.argv[1]
    
    if command == "generate":
        if len(sys.argv) < 3:
            print("❌ 请提供代码生成提示")
            print("示例：qwen-coder generate '写一个快速排序'")
            sys.exit(1)
        prompt = " ".join(sys.argv[2:])
        result = generate_code(prompt)
        print(result)
    
    elif command == "explain":
        code = sys.stdin.read()
        if not code:
            print("❌ 请提供代码（通过管道或重定向）")
            sys.exit(1)
        result = explain_code(code)
        print(result)
    
    elif command == "review":
        code = sys.stdin.read()
        if not code:
            print("❌ 请提供代码（通过管道或重定向）")
            sys.exit(1)
        result = review_code(code)
        print(result)
    
    else:
        print(f"❌ 未知命令：{command}")
        sys.exit(1)


if __name__ == "__main__":
    main()
