import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { relative, resolve } from 'node:path';

const DEFAULT_ARTIFACT_DIR = '/Users/jiyong/Downloads/jiyong_persona_uiux_artifacts';
const ARTIFACT_DIR = resolve(process.env.PERSONA_UIUX_ARTIFACT_DIR ?? DEFAULT_ARTIFACT_DIR);
const REPORT_DIR = resolve(process.cwd(), '.reports/persona-contract');
const REPORT_PATH = resolve(REPORT_DIR, 'report.json');
const ARCHITECTURE_PATH = resolve(
  ARTIFACT_DIR,
  '01_persona_uiux_architecture_and_test_scenarios.md',
);
const SCENARIO_MATRIX_PATH = resolve(ARTIFACT_DIR, '03_scenario_matrix.csv');
const BACKLOG_PATH = resolve(ARTIFACT_DIR, '02_incremental_implementation_backlog.md');
const RELEASE_EVIDENCE_PATH = resolve(process.cwd(), 'docs/persona-uiux-release-evidence.md');
const SLICE_CONTRACTS_PATH = resolve(process.cwd(), 'docs/persona-uiux-slice-contracts.md');
const HUMAN_REVIEW_NOTES_PATH = resolve(process.cwd(), 'docs/persona-uiux-human-review-notes.md');
const COMPLETION_AUDIT_PATH = resolve(process.cwd(), 'docs/persona-uiux-completion-audit.md');
const ALLOWED_CLASSIFICATIONS = new Set([
  'in_this_slice',
  'later_slice',
  'human_required',
  'blocked',
  'out_of_scope',
]);
const REQUIRED_SLICE_CONTRACT_FIELDS = [
  'Goal:',
  'Included scenarios:',
  'Non-scope:',
  'Files/surfaces touched:',
  'Proof needed:',
  'Done criteria:',
  'Checkpoint:',
  'Recommendation:',
];
const REQUIRED_HUMAN_REVIEW_ANCHORS = [
  'http://127.0.0.1:4321',
  'npm run audit:persona-contract',
  'npm run audit:web',
  '.reports/responsive/screenshots/',
  'npm run audit:production-smoke',
  'PERSONA_PRODUCTION_BASE_URL',
  '/missing-record-drawer-for-i09/',
  'Deployment URL',
  'Production search',
  'Public-release approval',
];

function parseCsvLine(line) {
  const values = [];
  let value = '';
  let insideQuote = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const nextChar = line[index + 1];

    if (char === '"' && insideQuote && nextChar === '"') {
      value += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      insideQuote = !insideQuote;
      continue;
    }

    if (char === ',' && !insideQuote) {
      values.push(value);
      value = '';
      continue;
    }

    value += char;
  }

  values.push(value);
  return values;
}

function parseScenarioMatrix(text) {
  const lines = text
    .trim()
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const header = parseCsvLine(lines[0]);
  const idIndex = header.indexOf('Scenario ID');
  const priorityIndex = header.indexOf('Priority');
  const verificationModeIndex = header.indexOf('Verification Mode');
  const statusIndex = header.indexOf('Current Evidence Status');

  return lines.slice(1).map((line) => {
    const cells = parseCsvLine(line);

    return {
      id: cells[idIndex],
      priority: cells[priorityIndex],
      verificationMode: cells[verificationModeIndex],
      currentEvidenceStatus: cells[statusIndex],
    };
  });
}

function splitMarkdownTableRow(line) {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim());
}

function sliceBetween(text, startHeading, endHeading) {
  const startIndex = text.indexOf(startHeading);

  if (startIndex === -1) {
    return '';
  }

  const endIndex = endHeading ? text.indexOf(endHeading, startIndex + startHeading.length) : -1;
  return text.slice(startIndex, endIndex === -1 ? undefined : endIndex);
}

function parseReleaseScenarioMap(text) {
  const section = sliceBetween(text, '## Scenario Map', '## Backlog Classification');

  return section
    .split(/\r?\n/)
    .filter((line) => /^\|\s*SC-\d{3}\s*\|/.test(line))
    .map((line) => {
      const cells = splitMarkdownTableRow(line);

      return {
        id: cells[0],
        priority: cells[1],
        classification: cells[2],
      };
    });
}

function parseReleaseBacklogClassification(text) {
  const section = sliceBetween(text, '## Backlog Classification', '## Lens Review');

  return section
    .split(/\r?\n/)
    .filter((line) => /^\|\s*I-\d{2}\b/.test(line))
    .map((line) => {
      const cells = splitMarkdownTableRow(line);
      const id = cells[0]?.match(/\bI-\d{2}\b/)?.[0];

      return {
        id,
        title: cells[0],
        classification: cells[1],
      };
    });
}

function splitBacklogSections(text) {
  return splitHeadingSections(text, /^##\s+(I-\d{2})\s+[—-]\s+(.+)$/gm);
}

function splitContractSections(text) {
  return splitHeadingSections(text, /^##\s+(I-\d{2})\s+-\s+(.+)$/gm);
}

function splitHeadingSections(text, headingPattern) {
  const matches = [...text.matchAll(headingPattern)];

  return matches.map((match, index) => {
    const nextMatch = matches[index + 1];

    return {
      id: match[1],
      title: match[2].trim(),
      content: text.slice(match.index, nextMatch?.index),
    };
  });
}

function extractSubsection(content, heading) {
  const lines = content.split(/\r?\n/);
  const headingIndex = lines.findIndex((line) => line.trim() === `### ${heading}`);

  if (headingIndex === -1) {
    return '';
  }

  const sectionLines = [];
  for (const line of lines.slice(headingIndex + 1)) {
    if (line.startsWith('### ') || line.trim() === '---') {
      break;
    }

    sectionLines.push(line);
  }

  return sectionLines.join('\n').trim();
}

function parseSourceBacklog(text) {
  return splitBacklogSections(text).map((section) => {
    const includedScenarioText = extractSubsection(section.content, 'Included scenarios');

    return {
      id: section.id,
      title: section.title,
      includedScenarios: scenarioIdsIn(includedScenarioText),
      includesAllApplicable: /\ball applicable\b/i.test(includedScenarioText),
      hasIncludedScenariosSection: includedScenarioText.length > 0,
    };
  });
}

function scenarioIdsIn(text) {
  return [...new Set([...text.matchAll(/\bSC-\d{3}\b/g)].map((match) => match[0]))];
}

function requirementIdsIn(text) {
  return [...new Set([...text.matchAll(/\bR-\d{2}\b/g)].map((match) => match[0]))];
}

function byId(items) {
  const map = new Map();

  for (const item of items) {
    if (!item.id) {
      continue;
    }

    const list = map.get(item.id) ?? [];
    list.push(item);
    map.set(item.id, list);
  }

  return map;
}

function addSetComparisonIssues(issues, rule, expectedIds, actualIds, label) {
  const expectedSet = new Set(expectedIds);
  const actualSet = new Set(actualIds);
  const missing = expectedIds.filter((id) => !actualSet.has(id));
  const extra = actualIds.filter((id) => !expectedSet.has(id));

  if (missing.length > 0) {
    issues.push({
      rule,
      message: `${label} missing expected IDs: ${missing.join(', ')}`,
    });
  }

  if (extra.length > 0) {
    issues.push({
      rule,
      message: `${label} has unexpected IDs: ${extra.join(', ')}`,
    });
  }
}

function addDuplicateIssues(issues, rule, items, label) {
  const itemMap = byId(items);

  for (const [id, matches] of itemMap.entries()) {
    if (matches.length > 1) {
      issues.push({
        rule,
        message: `${label} contains duplicate ${id} rows (${matches.length})`,
      });
    }
  }
}

function addClassificationIssues(issues, items, label) {
  for (const item of items) {
    if (!ALLOWED_CLASSIFICATIONS.has(item.classification)) {
      issues.push({
        rule: 'invalid-classification',
        message: `${label} ${item.id} uses invalid classification "${item.classification}"`,
      });
    }
  }
}

function addPriorityIssues(issues, sourceScenarios, releaseScenarios) {
  const releaseById = byId(releaseScenarios);

  for (const sourceScenario of sourceScenarios) {
    const releaseScenario = releaseById.get(sourceScenario.id)?.[0];

    if (releaseScenario && releaseScenario.priority !== sourceScenario.priority) {
      issues.push({
        rule: 'scenario-priority-mismatch',
        message: `${sourceScenario.id} priority is ${releaseScenario.priority} in release evidence, expected ${sourceScenario.priority}`,
      });
    }
  }
}

function addHumanRequiredClassificationIssues(issues, sourceScenarios, releaseScenarios) {
  const releaseById = byId(releaseScenarios);

  for (const sourceScenario of sourceScenarios) {
    if (!/\bHUMAN_REQUIRED\b/.test(sourceScenario.verificationMode)) {
      continue;
    }

    const releaseScenario = releaseById.get(sourceScenario.id)?.[0];

    if (releaseScenario && releaseScenario.classification !== 'human_required') {
      issues.push({
        rule: 'human-required-classification',
        message: `${sourceScenario.id} has source verification mode "${sourceScenario.verificationMode}" but release classification is "${releaseScenario.classification}"`,
      });
    }
  }
}

function addBacklogReferenceIssues(issues, sourceBacklog, sourceScenarioIds) {
  const sourceScenarioSet = new Set(sourceScenarioIds);

  for (const backlogItem of sourceBacklog) {
    for (const scenarioId of backlogItem.includedScenarios) {
      if (!sourceScenarioSet.has(scenarioId)) {
        issues.push({
          rule: 'backlog-unknown-scenario',
          message: `${backlogItem.id} references unknown scenario ${scenarioId}`,
        });
      }
    }
  }
}

function addSliceContractIssues(issues, sourceBacklog, contractSections, sourceScenarioIds) {
  const contractsById = byId(contractSections);
  const sourceScenarioSet = new Set(sourceScenarioIds);

  for (const backlogItem of sourceBacklog) {
    const contract = contractsById.get(backlogItem.id)?.[0];

    if (!contract) {
      continue;
    }

    for (const field of REQUIRED_SLICE_CONTRACT_FIELDS) {
      if (!contract.content.includes(field)) {
        issues.push({
          rule: 'slice-contract-required-field',
          message: `${backlogItem.id} is missing required field "${field}"`,
        });
      }
    }

    const contractScenarioIds = scenarioIdsIn(contract.content);

    for (const scenarioId of contractScenarioIds) {
      if (!sourceScenarioSet.has(scenarioId)) {
        issues.push({
          rule: 'slice-contract-unknown-scenario',
          message: `${backlogItem.id} contract references unknown scenario ${scenarioId}`,
        });
      }
    }

    for (const scenarioId of backlogItem.includedScenarios) {
      if (!contractScenarioIds.includes(scenarioId)) {
        issues.push({
          rule: 'slice-contract-missing-source-scenario',
          message: `${backlogItem.id} contract omits source included scenario ${scenarioId}`,
        });
      }
    }

    if (
      backlogItem.includesAllApplicable &&
      !/\ball applicable MUST_PASS and REGRESSION scenarios\b/i.test(contract.content)
    ) {
      issues.push({
        rule: 'slice-contract-missing-all-applicable-scenarios',
        message: `${backlogItem.id} contract does not preserve the all-applicable scenario scope`,
      });
    }
  }
}

function addHumanReviewIssues(issues, sourceScenarioIds, releaseScenarios, humanReviewText) {
  const humanReviewScenarioIds = scenarioIdsIn(humanReviewText);
  const releaseHumanRequiredScenarioIds = releaseScenarios
    .filter((scenario) => scenario.classification === 'human_required')
    .map((scenario) => scenario.id);

  for (const scenarioId of sourceScenarioIds) {
    if (!humanReviewScenarioIds.includes(scenarioId)) {
      issues.push({
        rule: 'human-review-missing-source-scenario',
        message: `Human review notes omit source scenario ${scenarioId}`,
      });
    }
  }

  for (const scenarioId of releaseHumanRequiredScenarioIds) {
    if (!humanReviewScenarioIds.includes(scenarioId)) {
      issues.push({
        rule: 'human-review-missing-human-required-scenario',
        message: `Human review notes omit human-required release scenario ${scenarioId}`,
      });
    }
  }

  for (const anchor of REQUIRED_HUMAN_REVIEW_ANCHORS) {
    if (!humanReviewText.includes(anchor)) {
      issues.push({
        rule: 'human-review-missing-anchor',
        message: `Human review notes omit required review anchor "${anchor}"`,
      });
    }
  }
}

function addCompletionAuditIssues(
  issues,
  sourceRequirementIds,
  sourceScenarioIds,
  completionAuditText,
) {
  const completionAuditRequirementIds = requirementIdsIn(completionAuditText);
  const completionAuditScenarioIds = scenarioIdsIn(completionAuditText);

  addSetComparisonIssues(
    issues,
    'completion-audit-requirement-coverage',
    sourceRequirementIds,
    completionAuditRequirementIds,
    'Completion audit requirements',
  );
  addSetComparisonIssues(
    issues,
    'completion-audit-scenario-coverage',
    sourceScenarioIds,
    completionAuditScenarioIds,
    'Completion audit scenarios',
  );

  const requiredBoundaryAnchors = [
    'Status: local implementation human-approved and production deployment verified.',
    'Mark the full goal complete.',
    'Verified production',
    'https://ji-yong.com',
  ];

  for (const anchor of requiredBoundaryAnchors) {
    if (!completionAuditText.includes(anchor)) {
      issues.push({
        rule: 'completion-audit-missing-boundary-anchor',
        message: `Completion audit omits required boundary anchor "${anchor}"`,
      });
    }
  }
}

async function run() {
  await mkdir(REPORT_DIR, { recursive: true });

  const [
    architectureText,
    scenarioMatrixText,
    backlogText,
    releaseEvidenceText,
    sliceContractsText,
    humanReviewText,
    completionAuditText,
  ] = await Promise.all([
    readFile(ARCHITECTURE_PATH, 'utf8'),
    readFile(SCENARIO_MATRIX_PATH, 'utf8'),
    readFile(BACKLOG_PATH, 'utf8'),
    readFile(RELEASE_EVIDENCE_PATH, 'utf8'),
    readFile(SLICE_CONTRACTS_PATH, 'utf8'),
    readFile(HUMAN_REVIEW_NOTES_PATH, 'utf8'),
    readFile(COMPLETION_AUDIT_PATH, 'utf8'),
  ]);

  const sourceScenarios = parseScenarioMatrix(scenarioMatrixText);
  const sourceRequirementIds = requirementIdsIn(
    sliceBetween(architectureText, '## Explicit requirements', '## Assumptions'),
  );
  const sourceBacklog = parseSourceBacklog(backlogText);
  const releaseScenarios = parseReleaseScenarioMap(releaseEvidenceText);
  const releaseBacklog = parseReleaseBacklogClassification(releaseEvidenceText);
  const contractSections = splitContractSections(sliceContractsText);
  const issues = [];

  const sourceScenarioIds = sourceScenarios.map((scenario) => scenario.id);
  const releaseScenarioIds = releaseScenarios.map((scenario) => scenario.id);
  const sourceBacklogIds = sourceBacklog.map((item) => item.id);
  const releaseBacklogIds = releaseBacklog.map((item) => item.id);
  const contractIds = contractSections.map((section) => section.id);

  if (sourceRequirementIds.length === 0) {
    issues.push({
      rule: 'source-requirement-coverage',
      message: 'No source requirements were parsed from the architecture artifact.',
    });
  }

  addSetComparisonIssues(
    issues,
    'release-scenario-map-coverage',
    sourceScenarioIds,
    releaseScenarioIds,
    'Scenario Map',
  );
  addSetComparisonIssues(
    issues,
    'release-backlog-coverage',
    sourceBacklogIds,
    releaseBacklogIds,
    'Backlog Classification',
  );
  addSetComparisonIssues(
    issues,
    'slice-contract-coverage',
    sourceBacklogIds,
    contractIds,
    'Slice contract register',
  );
  addDuplicateIssues(issues, 'release-scenario-map-duplicates', releaseScenarios, 'Scenario Map');
  addDuplicateIssues(
    issues,
    'release-backlog-duplicates',
    releaseBacklog,
    'Backlog Classification',
  );
  addDuplicateIssues(
    issues,
    'slice-contract-duplicates',
    contractSections,
    'Slice contract register',
  );
  addClassificationIssues(issues, releaseScenarios, 'Scenario Map');
  addClassificationIssues(issues, releaseBacklog, 'Backlog Classification');
  addPriorityIssues(issues, sourceScenarios, releaseScenarios);
  addHumanRequiredClassificationIssues(issues, sourceScenarios, releaseScenarios);
  addBacklogReferenceIssues(issues, sourceBacklog, sourceScenarioIds);
  addSliceContractIssues(issues, sourceBacklog, contractSections, sourceScenarioIds);
  addHumanReviewIssues(issues, sourceScenarioIds, releaseScenarios, humanReviewText);
  addCompletionAuditIssues(issues, sourceRequirementIds, sourceScenarioIds, completionAuditText);

  const summary = {
    requirementSourceCount: sourceRequirementIds.length,
    completionAuditRequirementReferenceCount: requirementIdsIn(completionAuditText).length,
    completionAuditScenarioReferenceCount: scenarioIdsIn(completionAuditText).length,
    scenarioSourceCount: sourceScenarios.length,
    releaseScenarioCount: releaseScenarios.length,
    backlogSourceCount: sourceBacklog.length,
    releaseBacklogCount: releaseBacklog.length,
    sliceContractCount: contractSections.length,
    explicitBacklogScenarioReferenceCount: sourceBacklog.reduce(
      (count, item) => count + item.includedScenarios.length,
      0,
    ),
    allowedClassifications: [...ALLOWED_CLASSIFICATIONS],
    humanRequiredSourceScenarioCount: sourceScenarios.filter((scenario) =>
      /\bHUMAN_REQUIRED\b/.test(scenario.verificationMode),
    ).length,
    humanReviewScenarioReferenceCount: scenarioIdsIn(humanReviewText).length,
    requiredHumanReviewAnchorCount: REQUIRED_HUMAN_REVIEW_ANCHORS.length,
    issueCount: issues.length,
  };

  await writeFile(
    REPORT_PATH,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        sourceArtifactDir: ARTIFACT_DIR,
        checkedFiles: [
          relative(process.cwd(), ARCHITECTURE_PATH),
          relative(process.cwd(), SCENARIO_MATRIX_PATH),
          relative(process.cwd(), BACKLOG_PATH),
          relative(process.cwd(), RELEASE_EVIDENCE_PATH),
          relative(process.cwd(), SLICE_CONTRACTS_PATH),
          relative(process.cwd(), HUMAN_REVIEW_NOTES_PATH),
          relative(process.cwd(), COMPLETION_AUDIT_PATH),
        ],
        summary,
        issues,
      },
      null,
      2,
    ),
    'utf8',
  );

  if (issues.length > 0) {
    console.error(`[audit] Persona contract check failed - ${issues.length} issue(s).`);
    for (const issue of issues.slice(0, 30)) {
      console.error(` - ${issue.rule}: ${issue.message}`);
    }
    if (issues.length > 30) {
      console.error(` - and ${issues.length - 30} more`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(
    `[audit] Persona contract check passed - ${summary.requirementSourceCount} requirements, ${summary.scenarioSourceCount} scenarios, ${summary.backlogSourceCount} backlog slices, ${summary.sliceContractCount} slice contracts, ${summary.completionAuditRequirementReferenceCount} completion-audit requirements, ${summary.completionAuditScenarioReferenceCount} completion-audit scenarios, 0 traceability issues.`,
  );
}

run().catch((error) => {
  console.error('[audit] Persona contract check failed:', error);
  process.exitCode = 1;
});
