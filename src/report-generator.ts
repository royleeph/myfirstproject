/**
 * 周报生成器
 * 
 * 功能：自动生成项目周报
 * 包含 Issue、PR、活跃度等维度的统计
 */

import { Octokit } from '@octokit/rest';

export interface WeeklyStats {
  weekNumber: number;
  startDate: string;
  endDate: string;
  
  // Issues
  newIssues: number;
  closedIssues: number;
  avgIssueResponseTime: number;
  
  // PRs
  newPRs: number;
  mergedPRs: number;
  avgPRReviewTime: number;
  
  // 活跃度
  commits: number;
  contributors: number;
  comments: number;
  
  // 增长
  starGrowth: number;
  forkGrowth: number;
}

export interface WeeklyReport {
  stats: WeeklyStats;
  highlights: string[];
  lowlights: string[];
  nextWeekGoals: string[];
}

/**
 * 生成周报内容
 */
export function generateWeeklyMarkdown(report: WeeklyReport): string {
  const { stats } = report;
  
  let md = `# 📊 项目周报\n\n`;
  md += `**第 ${stats.weekNumber} 周** (${stats.startDate} ~ ${stats.endDate})\n\n`;
  
  // 核心指标
  md += `## 🎯 核心指标\n\n`;
  md += `| 指标 | 本周 | 说明 |\n`;
  md += `|------|------|------|\n`;
  md += `| **新 Issues** | ${stats.newIssues} | ${stats.newIssues > 0 ? '📈' : '➖'} |\n`;
  md += `| **关闭 Issues** | ${stats.closedIssues} | ${stats.closedIssues >= stats.newIssues ? '✅' : '⚠️'} |\n`;
  md += `| **新 PRs** | ${stats.newPRs} | ${stats.newPRs > 0 ? '📈' : '➖'} |\n`;
  md += `| **合并 PRs** | ${stats.mergedPRs} | ${stats.mergedPRs >= stats.newPRs ? '✅' : '⚠️'} |\n`;
  md += `| **提交次数** | ${stats.commits} | ${stats.commits > 0 ? '💪' : '😴'} |\n`;
  md += `| **贡献者** | ${stats.contributors} | ${stats.contributors > 1 ? '👥' : '👤'} |\n`;
  md += `| **Stars 增长** | +${stats.starGrowth} | ${stats.starGrowth > 0 ? '🌟' : '➖'} |\n\n`;
  
  // 亮点
  if (report.highlights.length > 0) {
    md += `## ✨ 本周亮点\n\n`;
    for (const highlight of report.highlights) {
      md += `- ${highlight}\n`;
    }
    md += '\n';
  }
  
  // 需要改进
  if (report.lowlights.length > 0) {
    md += `## ⚠️ 需要改进\n\n`;
    for (const lowlight of report.lowlights) {
      md += `- ${lowlight}\n`;
    }
    md += '\n';
  }
  
  // 下周目标
  if (report.nextWeekGoals.length > 0) {
    md += `## 🎯 下周目标\n\n`;
    for (const goal of report.nextWeekGoals) {
      md += `- ${goal}\n`;
    }
    md += '\n';
  }
  
  // AI 运营备注
  md += `## 🤖 AI 运营备注\n\n`;
  md += `- 本周是 AI 自主运营项目的第 ${Math.ceil(stats.weekNumber * 7)} 天左右\n`;
  md += `- 所有决策和代码变更都记录在项目文档中\n`;
  md += `- 欢迎提交 Issue 和 PR 参与项目\n\n`;
  
  // 详细分析
  md += `## 📈 详细分析\n\n`;
  
  // Issue 分析
  md += `### Issue 动态\n\n`;
  const issueBalance = stats.closedIssues - stats.newIssues;
  if (issueBalance >= 0) {
    md += `✅ Issue 处理及时，本周净减少 ${issueBalance} 个\n`;
  } else {
    md += `⚠️ Issue 积压增加 ${Math.abs(issueBalance)} 个，需要加快处理\n`;
  }
  
  if (stats.avgIssueResponseTime < 24) {
    md += `- 平均响应时间 ${stats.avgIssueResponseTime.toFixed(1)} 小时，表现优秀\n\n`;
  } else if (stats.avgIssueResponseTime < 72) {
    md += `- 平均响应时间 ${stats.avgIssueResponseTime.toFixed(1)} 小时，可以接受\n\n`;
  } else {
    md += `- 平均响应时间 ${stats.avgIssueResponseTime.toFixed(1)} 小时，需要改进\n\n`;
  }
  
  // PR 分析
  md += `### PR 动态\n\n`;
  const prBalance = stats.mergedPRs - stats.newPRs;
  if (prBalance >= 0) {
    md += `✅ PR 审查及时，本周净减少 ${prBalance} 个\n`;
  } else {
    md += `⚠️ PR 积压增加 ${Math.abs(prBalance)} 个，需要加快审查\n`;
  }
  
  if (stats.avgPRReviewTime < 48) {
    md += `- 平均审查时间 ${stats.avgPRReviewTime.toFixed(1)} 小时，表现优秀\n\n`;
  } else if (stats.avgPRReviewTime < 168) {
    md += `- 平均审查时间 ${stats.avgPRReviewTime.toFixed(1)} 小时，可以接受\n\n`;
  } else {
    md += `- 平均审查时间 ${stats.avgPRReviewTime.toFixed(1)} 小时，需要改进\n\n`;
  }
  
  // 活跃度分析
  md += `### 活跃度分析\n\n`;
  if (stats.commits > 20) {
    md += `🔥 非常活跃！本周 ${stats.commits} 次提交\n`;
  } else if (stats.commits > 10) {
    md += `👍 活跃度良好，本周 ${stats.commits} 次提交\n`;
  } else if (stats.commits > 0) {
    md += `😐 活跃度一般，本周 ${stats.commits} 次提交\n`;
  } else {
    md += `😴 本周没有提交，需要加油！\n`;
  }
  
  if (stats.contributors > 3) {
    md += `- 贡献者 ${stats.contributors} 人，社区活跃\n`;
  } else if (stats.contributors > 1) {
    md += `- 贡献者 ${stats.contributors} 人，稳定参与\n`;
  } else {
    md += `- 仅 1 位贡献者，欢迎更多人参与\n`;
  }
  
  md += `\n---\n\n`;
  md += `*报告生成时间*: ${new Date().toISOString()}\n`;
  md += `*生成方式*: GitHub Actions 自动\n`;
  
  return md;
}

/**
 * 分析数据生成亮点和改进点
 */
export function analyzeWeek(stats: WeeklyStats): { highlights: string[]; lowlights: string[]; goals: string[] } {
  const highlights: string[] = [];
  const lowlights: string[] = [];
  const goals: string[] = [];
  
  // Issue 相关
  if (stats.closedIssues >= stats.newIssues && stats.newIssues > 0) {
    highlights.push(`Issue 处理及时，关闭了所有新 Issue`);
  }
  if (stats.avgIssueResponseTime < 24) {
    highlights.push(`Issue 响应速度快，平均 ${stats.avgIssueResponseTime.toFixed(1)} 小时`);
  }
  if (stats.newIssues === 0) {
    highlights.push(`本周没有新 Issue，项目稳定`);
  }
  
  if (stats.closedIssues < stats.newIssues) {
    lowlights.push(`Issue 积压增加 ${stats.newIssues - stats.closedIssues} 个`);
    goals.push(`处理积压的 Issue`);
  }
  if (stats.avgIssueResponseTime > 72) {
    lowlights.push(`Issue 响应时间超过 3 天`);
    goals.push(`加快 Issue 响应速度`);
  }
  
  // PR 相关
  if (stats.mergedPRs >= stats.newPRs && stats.newPRs > 0) {
    highlights.push(`PR 审查及时，合并了所有新 PR`);
  }
  if (stats.avgPRReviewTime < 48) {
    highlights.push(`PR 审查速度快，平均 ${stats.avgPRReviewTime.toFixed(1)} 小时`);
  }
  
  if (stats.mergedPRs < stats.newPRs) {
    lowlights.push(`PR 积压增加 ${stats.newPRs - stats.mergedPRs} 个`);
    goals.push(`加快 PR 审查和合并`);
  }
  
  // 活跃度
  if (stats.commits > 20) {
    highlights.push(`开发活跃，完成 ${stats.commits} 次提交`);
  }
  if (stats.contributors > 3) {
    highlights.push(`社区活跃，${stats.contributors} 位贡献者参与`);
  }
  if (stats.starGrowth > 10) {
    highlights.push(`Stars 增长 ${stats.starGrowth} 个，关注度提升`);
  }
  
  if (stats.commits === 0) {
    lowlights.push(`本周没有代码提交`);
    goals.push(`推进开发进度`);
  }
  if (stats.contributors === 1) {
    lowlights.push(`只有一位贡献者`);
    goals.push(`吸引更多社区成员参与`);
  }
  
  // 默认目标
  if (goals.length === 0) {
    goals.push(`保持当前良好状态`);
    goals.push(`继续改进项目质量`);
  }
  
  return { highlights, lowlights, goals };
}

// CLI 测试
if (require.main === module) {
  const testStats: WeeklyStats = {
    weekNumber: 1,
    startDate: '2026-03-12',
    endDate: '2026-03-18',
    newIssues: 5,
    closedIssues: 3,
    avgIssueResponseTime: 24,
    newPRs: 2,
    mergedPRs: 2,
    avgPRReviewTime: 36,
    commits: 15,
    contributors: 2,
    comments: 20,
    starGrowth: 5,
    forkGrowth: 1
  };
  
  const analysis = analyzeWeek(testStats);
  const report: WeeklyReport = {
    stats: testStats,
    highlights: analysis.highlights,
    lowlights: analysis.lowlights,
    nextWeekGoals: analysis.goals
  };
  
  console.log(generateWeeklyMarkdown(report));
}
