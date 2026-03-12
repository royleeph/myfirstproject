/**
 * PR 质量分析器
 * 
 * 功能：分析 Pull Request 的代码质量和变更范围
 * 为 AI 审查提供数据支持
 */

export interface PRMetrics {
  additions: number;
  deletions: number;
  changedFiles: number;
  commitCount: number;
  hasDescription: boolean;
  hasTests: boolean;
  hasDocumentation: boolean;
}

export interface PRQualityReport {
  score: number; // 0-100
  level: 'excellent' | 'good' | 'needs-improvement' | 'poor';
  metrics: PRMetrics;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

/**
 * 评估 PR 质量
 */
export function evaluatePR(metrics: PRMetrics): PRQualityReport {
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const recommendations: string[] = [];
  
  let score = 100;

  // 1. 代码量评估 (30 分)
  const totalChanges = metrics.additions + metrics.deletions;
  if (totalChanges < 100) {
    strengths.push('代码变更量适中，易于审查');
  } else if (totalChanges < 500) {
    strengths.push('代码变更量合理');
  } else if (totalChanges < 1000) {
    score -= 10;
    weaknesses.push('代码变更量较大，建议考虑拆分');
    recommendations.push('将大 PR 拆分为多个小 PR，每个聚焦单一功能');
  } else {
    score -= 20;
    weaknesses.push('代码变更量过大，审查困难');
    recommendations.push('强烈建议拆分成多个独立的 PR');
  }

  // 2. 文件数量评估 (20 分)
  if (metrics.changedFiles <= 3) {
    strengths.push('文件集中度高，修改范围清晰');
  } else if (metrics.changedFiles <= 10) {
    // 正常
  } else if (metrics.changedFiles <= 20) {
    score -= 10;
    weaknesses.push('修改文件较多');
    recommendations.push('确认所有修改是否属于同一功能范围');
  } else {
    score -= 20;
    weaknesses.push('修改文件过多，范围可能过于分散');
    recommendations.push('按功能模块拆分 PR');
  }

  // 3. 描述质量 (20 分)
  if (metrics.hasDescription) {
    strengths.push('提供了 PR 描述');
  } else {
    score -= 20;
    weaknesses.push('缺少 PR 描述');
    recommendations.push('添加详细的 PR 描述，说明变更目的和内容');
  }

  // 4. 测试覆盖 (15 分)
  if (metrics.hasTests) {
    strengths.push('包含测试代码');
  } else {
    score -= 15;
    weaknesses.push('缺少测试代码');
    recommendations.push('为新功能添加单元测试');
  }

  // 5. 文档更新 (15 分)
  if (metrics.hasDocumentation) {
    strengths.push('更新了相关文档');
  } else {
    score -= 10;
    recommendations.push('如适用，请更新相关文档');
  }

  // 6. 提交历史 (额外)
  if (metrics.commitCount > 10) {
    recommendations.push('考虑压缩提交历史，使记录更清晰');
  }

  // 确定等级
  let level: PRQualityReport['level'];
  if (score >= 90) level = 'excellent';
  else if (score >= 70) level = 'good';
  else if (score >= 50) level = 'needs-improvement';
  else level = 'poor';

  // 确保分数在 0-100 范围
  score = Math.max(0, Math.min(100, score));

  return {
    score,
    level,
    metrics,
    strengths,
    weaknesses,
    recommendations
  };
}

/**
 * 生成 PR 审查评论
 */
export function generateReviewComment(report: PRQualityReport, prNumber: number): string {
  const emoji = {
    excellent: '🌟',
    good: '✅',
    'needs-improvement': '⚠️',
    poor: '❌'
  };

  let comment = `## 🤖 AI 代码质量报告\n\n`;
  comment += `**PR #${prNumber}** | 质量评分：**${report.score}/100** ${emoji[report.level]}\n\n`;

  // 质量等级
  const levelText = {
    excellent: '优秀 - 几乎无需改进',
    good: '良好 - 有少量改进空间',
    'needs-improvement': '需要改进 - 建议处理以下问题',
    poor: '较差 - 强烈建议重构'
  };
  comment += `**等级**: ${levelText[report.level]}\n\n`;

  // 优点
  if (report.strengths.length > 0) {
    comment += `### ✅ 优点\n\n`;
    for (const strength of report.strengths) {
      comment += `- ${strength}\n`;
    }
    comment += '\n';
  }

  // 不足
  if (report.weaknesses.length > 0) {
    comment += `### ⚠️ 需要关注\n\n`;
    for (const weakness of report.weaknesses) {
      comment += `- ${weakness}\n`;
    }
    comment += '\n';
  }

  // 建议
  if (report.recommendations.length > 0) {
    comment += `### 💡 建议\n\n`;
    for (const rec of report.recommendations) {
      comment += `- ${rec}\n`;
    }
    comment += '\n';
  }

  // 指标详情
  comment += `### 📊 详细指标\n\n`;
  comment += `| 指标 | 数值 |\n`;
  comment += `|------|------|\n`;
  comment += `| 新增行数 | ${report.metrics.additions} |\n`;
  comment += `| 删除行数 | ${report.metrics.deletions} |\n`;
  comment += `| 修改文件 | ${report.metrics.changedFiles} |\n`;
  comment += `| 提交数量 | ${report.metrics.commitCount} |\n`;
  comment += `| 有描述 | ${report.metrics.hasDescription ? '✅' : '❌'} |\n`;
  comment += `| 有测试 | ${report.metrics.hasTests ? '✅' : '❌'} |\n`;
  comment += `| 有文档 | ${report.metrics.hasDocumentation ? '✅' : '❌'} |\n`;

  comment += `\n---\n`;
  comment += `*这是 AI 自动生成的质量报告，仅供参考。最终审查由人类维护者完成.*`;

  return comment;
}

// CLI 测试
if (require.main === module) {
  const testMetrics: PRMetrics = {
    additions: parseInt(process.argv[2]) || 100,
    deletions: parseInt(process.argv[3]) || 50,
    changedFiles: parseInt(process.argv[4]) || 5,
    commitCount: parseInt(process.argv[5]) || 3,
    hasDescription: true,
    hasTests: false,
    hasDocumentation: false
  };

  const report = evaluatePR(testMetrics);
  console.log('PR Quality Report:', JSON.stringify(report, null, 2));
}
