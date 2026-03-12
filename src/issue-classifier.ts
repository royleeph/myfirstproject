/**
 * Issue 智能分类器
 * 
 * 功能：分析 Issue 内容，自动分类和打标签
 * 这是 AI 自主运营的核心工具之一
 */

import { Octokit } from '@octokit/rest';

// 标签关键词映射
const LABEL_KEYWORDS: Record<string, string[]> = {
  'bug': ['bug', '错误', '问题', '崩溃', 'fail', 'error', 'exception'],
  'enhancement': ['enhancement', 'feature', '功能', '建议', '改进', 'request'],
  'documentation': ['documentation', 'docs', '文档', 'readme', 'typo'],
  'question': ['question', 'help', '疑问', '如何', '怎么', 'ask'],
  'good first issue': ['first', 'beginner', '简单', '入门', 'easy'],
  'urgent': ['urgent', '紧急', 'critical', '严重', 'blocking'],
  'ai-decision': ['ai', 'decision', '决策', '自动', 'operator']
};

// 优先级判断规则
interface PriorityRule {
  keywords: string[];
  priority: 'high' | 'medium' | 'low';
}

const PRIORITY_RULES: PriorityRule[] = [
  { keywords: ['critical', 'blocking', '严重', '紧急'], priority: 'high' },
  { keywords: ['important', '重要', 'priority'], priority: 'medium' },
  { keywords: ['nice to have', '可选', 'suggestion'], priority: 'low' }
];

export interface IssueAnalysis {
  labels: string[];
  priority: 'high' | 'medium' | 'low';
  confidence: number;
  suggestions: string[];
}

/**
 * 分析 Issue 内容
 */
export function analyzeIssue(title: string, body: string): IssueAnalysis {
  const content = `${title} ${body}`.toLowerCase();
  const labels: string[] = [];
  const suggestions: string[] = [];
  let confidence = 0;

  // 1. 标签匹配
  for (const [label, keywords] of Object.entries(LABEL_KEYWORDS)) {
    const matchCount = keywords.filter(kw => content.includes(kw)).length;
    if (matchCount > 0) {
      labels.push(label);
      confidence += matchCount * 0.1;
    }
  }

  // 2. 优先级判断
  let priority: 'high' | 'medium' | 'low' = 'medium';
  for (const rule of PRIORITY_RULES) {
    if (rule.keywords.some(kw => content.includes(kw))) {
      priority = rule.priority;
      break;
    }
  }

  // 3. 内容质量检查
  if (body.length < 20) {
    suggestions.push('Issue 描述过于简单，建议补充更多细节');
    confidence -= 0.2;
  } else if (body.length > 1000) {
    suggestions.push('Issue 描述较长，建议结构化分段');
  }

  // 4. 检查是否包含必要信息
  if (!content.includes('reproduce') && !content.includes('复现') && labels.includes('bug')) {
    suggestions.push('Bug 类 Issue 建议提供复现步骤');
  }

  if (!content.includes('expect') && !content.includes('预期') && labels.includes('bug')) {
    suggestions.push('建议说明预期行为和实际行为');
  }

  // 5. 置信度归一化
  confidence = Math.min(Math.max(confidence, 0), 1);

  return {
    labels,
    priority,
    confidence,
    suggestions
  };
}

/**
 * 生成 Issue 回复建议
 */
export function generateReplySuggestion(analysis: IssueAnalysis, issueNumber: number): string {
  let reply = `感谢提交 Issue #${issueNumber}！\n\n`;

  if (analysis.labels.length > 0) {
    reply += `**自动分类**: ${analysis.labels.join(', ')}\n\n`;
  }

  if (analysis.suggestions.length > 0) {
    reply += `**建议补充**:\n`;
    for (const suggestion of analysis.suggestions) {
      reply += `- ${suggestion}\n`;
    }
    reply += '\n';
  }

  reply += `AI 会持续跟踪此 Issue 的进展。如有更多信息，欢迎随时补充！`;

  return reply;
}

// CLI 测试入口
if (require.main === module) {
  const testTitle = process.argv[2] || 'Test Issue';
  const testBody = process.argv[3] || 'This is a test';
  
  const analysis = analyzeIssue(testTitle, testBody);
  console.log('Analysis Result:', JSON.stringify(analysis, null, 2));
}
