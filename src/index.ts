/**
 * AI GitHub Operator - 主入口
 * 
 * 这是 AI 自主运营项目的核心工具集
 * 包含 Issue 管理、PR 审查、健康监控、周报生成等功能
 */

export { analyzeIssue, generateReplySuggestion } from './issue-classifier';
export type { IssueAnalysis } from './issue-classifier';

export { evaluatePR, generateReviewComment } from './pr-analyzer';
export type { PRMetrics, PRQualityReport } from './pr-analyzer';

export { evaluateHealth, generateHealthReport } from './health-monitor';
export type { HealthMetrics, HealthReport } from './health-monitor';

export { generateWeeklyMarkdown, analyzeWeek } from './report-generator';
export type { WeeklyStats, WeeklyReport } from './report-generator';

// 示例用法
async function main() {
  console.log('🤖 AI GitHub Operator initialized');
  console.log('Available modules:');
  console.log('  - issue-classifier: Issue 智能分类');
  console.log('  - pr-analyzer: PR 质量分析');
  console.log('  - health-monitor: 项目健康度监控');
  console.log('  - report-generator: 周报生成');
}

if (require.main === module) {
  main();
}
