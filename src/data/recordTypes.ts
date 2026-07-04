export const recordTypes = {
  'debug-log': {
    label: '디버그 로그',
    description: '증상과 원인을 따라가며 남긴 기록',
  },
  experiment: {
    label: '실험 기록',
    description: '도구와 아이디어를 직접 시험한 기록',
  },
  'system-note': {
    label: '시스템 노트',
    description: '구조와 흐름을 정리한 기록',
  },
  essay: {
    label: '생각 기록',
    description: '판단과 관찰을 다시 적어둔 기록',
  },
  'project-log': {
    label: '프로젝트 로그',
    description: '만들고 고친 과정을 남긴 기록',
  },
  observation: {
    label: '관찰 기록',
    description: '일상과 만냥구름을 조용히 살핀 기록',
  },
} as const;

export const recordStatuses = {
  seed: '씨앗',
  growing: '키우는 중',
  stable: '정리됨',
} as const;

export type RecordType = keyof typeof recordTypes;
export type RecordStatus = keyof typeof recordStatuses;

const isRecordType = (value?: string): value is RecordType =>
  Boolean(value && value in recordTypes);

const isRecordStatus = (value?: string): value is RecordStatus =>
  Boolean(value && value in recordStatuses);

export const getRecordType = (recordType?: string) => {
  if (isRecordType(recordType)) {
    return recordTypes[recordType];
  }

  return undefined;
};

export const getRecordStatus = (status?: string) =>
  isRecordStatus(status) ? recordStatuses[status] : undefined;
