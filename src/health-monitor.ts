/**
 * 项目健康度监控器
 * 
 * 功能：监控项目整体健康状态
 * 包括 Issue 响应时间、PR 积压、活跃度等指标
 */

export interface HealthMetrics {
  // Issue 相关
  openIssues: number;
  avgIssueResponseTime: number; // 小时
  issueCloseRate: number; // 百分比
  
  // PR 相关
  openPRs: number;
  avgPRReviewTime: number; // 小时
  prMergeRate: number; // 百分比
  
  // 活跃度
  recentCommits: number; // 近 7 天
  recentContributors: number; // 近 30 天
  starsGrowth: number; // 近 30 天增长
  
  // 代码质量
  testCoverage: number; // 百分比
  ciPassRate: number; // 百分比
}

export interface HealthReport {
  score: number; // 0-100
  level: 'healthy' | 'attention-needed' | 'critical';
  metrics: HealthMetrics;
  alerts: string[];
  recommendations: string[];
}

/**
 * 评估项目健康度
 */
export function evaluateHealth(metrics: HealthMetrics): HealthReport {
  const alerts: string[] = [];
  const recommendations: string[] = [];
  let score = 100;

  // 1. Issue 响应 (25 分)
  if (metrics.avgIssueResponseTime < 24) {
    // 优秀 - 24 小时内响应
  } else if (metrics.avgIssueResponseTime < 72) {
    score -= 5;
  } else if (metrics.avgIssueResponseTime < 168) {
    score -= 15;
    alerts.push('Issue 响应时间超过 3 天');
    recommendations.push('尽快响应未处理的 Issue');
  } else {
    score -= 25;
    alerts.push('⚠️ Issue 响应时间超过 1 周 - 严重');
    recommendations.push('需要立即处理积压的 Issue');
  }

  // 2. Issue 关闭率 (10 分)
  if (metrics.issueCloseRate > 70) {
    // 健康
  } else if (metrics.issueCloseRate > 50) {
    score -= 5;
  } else {
    score -= 10;
    alerts.push('Issue 关闭率低于 50%');
    recommendations.push('加快 Issue 处理速度');
  }

  // 3. PR 审查时间 (25 分)
  if (metrics.avgPRReviewTime < 48) {
    // 优秀 - 48 小时内审查
  } else if (metrics.avgPRReviewTime < 168) {
    score -= 10;
    recommendations.push('加快 PR 审查速度');
  } else {
    score -= 25;
    alerts.push('⚠️ PR 审查时间超过 1 周');
    recommendations.push('优先处理积压的 PRs');
  }

  // 4. PR 合并率 (10 分)
  if (metrics.prMergeRate > 60) {
    // 健康
  } else if (metrics.prMergeRate > 40) {
    score -= 5;
  } else {
    score -= 10;
    alerts.push('PR 合并率偏低');
  }

  // 5. 活跃度 (15 分)
  if (metrics.recentCommits > 10) {
    // 活跃
  } else if (metrics.recentCommits > 3) {
    score -= 5;
  } else {
    score -= 15;
    alerts.push('⚠️ 项目活跃度低 - 近 7 天提交少于 3 次');
    recommendations.push('增加开发活跃度');
  }

  // 6. CI 通过率 (15 分)
  if (metrics.ciPassRate > 90) {
    // 优秀
  } else if (metrics.ciPassRate > 70) {
    score -= 5;
  } else if (metrics.ciPassRate > 50) {
    score -= 10;
    alerts.push('CI 通过率偏低');
  } else {
    score -= 15;
    alerts.push('⚠️ CI 通过率低于 50% - 严重');
    recommendations.push('修复失败的 CI 任务');
  }

  // 7. 开放 Issue/PR 数量警告
  if (metrics.openIssues > 50) {
    alerts.push(`当前有 ${metrics.openIssues} 个开放 Issue`);
    recommendations.push('优先关闭或处理旧 Issue');
  }

  if (metrics.openPRs > 10) {
    alerts.push(`当前有 ${metrics.openPRs} 个开放 PR`);
    recommendations.push('加快 PR 审查和合并');
  }

  // 确保分数在 0-100 范围
  score = Math.max(0, Math.min(100, score));

  // 确定健康等级
  let level: HealthReport['level'];
  if (score >= 80) level = 'healthy';
  else if (score >= 50) level = 'attention-needed';
  else level = 'critical';

  return {
    score,
    level,
    metrics,
    alerts,
    recommendations
  };
}

/**
 * 生成健康报告
 */
export function generateHealthReport(report: HealthReport): string {
  const emoji = {
    healthy: '✅',
    'attention-needed': '⚠️',
    critical: '❌'
  };

  const levelText = {
    healthy: '健康 - 项目运行良好',
    'attention-needed': '需要关注 - 存在一些問題',
    critical: '危急 - 需要立即处理'
  };

  let output = `## 🏥 项目健康度报告\n\n`;
  output += `**健康评分**: ${report.score}/100 ${emoji[report.level]}\n`;
  output += `**状态**: ${levelText[report.level]}\n\n`;

  // 警报
  if (report.alerts.length > 0) {
    output += `### 🚨 警报\n\n`;
    for (const alert of report.alerts) {
      output += `- ${alert}\n`;
    }
    output += '\n';
  }

  // 建议
  if (report.recommendations.length > 0) {
    output += `### 💡 改进建议\n\n`;
    for (const rec of report.recommendations) {
      output += `- ${rec}\n`;
    }
    output += '\n';
  }

  // 详细指标
  output += `### 📊 详细指标\n\n`;
  output += `#### Issue 指标\n`;
  output += `- 开放 Issue: ${report.metrics.openIssues}\n`;
  output += `- 平均响应时间：${report.metrics.avgIssueResponseTime.toFixed(1)} 小时\n`;
  output += `- 关闭率：${report.metrics.issueCloseRate.toFixed(1)}%\n\n`;

  output += `#### PR 指标\n`;
  output += `- 开放 PR: ${report.metrics.openPRs}\n`;
  output += `- 平均审查时间：${report.metrics.avgPRReviewTime.toFixed(1)} 小时\n`;
  output += `- 合并率：${report.metrics.prMergeRate.toFixed(1)}%\n\n`;

  output += `#### 活跃度\n`;
  output += `- 近 7 天提交：${report.metrics.recentCommits}\n`;
  output += `- 近 30 天贡献者：${report.metrics.recentContributors}\n`;
  output += `- Stars 增长 (30 天): ${report.metrics.starsGrowth}\n\n`;

  output += `#### 代码质量\n`;
  output += `- 测试覆盖率：${report.metrics.testCoverage.toFixed(1)}%\n`;
  output += `- CI 通过率：${report.metrics.ciPassRate.toFixed(1)}%\n`;

  return output;
}

// CLI 测试
if (require.main === module) {
  const testMetrics: HealthMetrics = {
    openIssues: 15,
    avgIssueResponseTime: 24,
    issueCloseRate: 75,
    openPRs: 5,
    avgPRReviewTime: 48,
    prMergeRate: 60,
    recentCommits: 10,
    recentContributors: 3,
    starsGrowth: 5,
    testCoverage: 80,
    ciPassRate: 95
  };

  const report = evaluateHealth(testMetrics);
  console.log(generateHealthReport(report));
}
