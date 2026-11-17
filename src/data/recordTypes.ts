export const recordTypes = {
  'debug-log': {
    label: '디버그 로그',
    description: '증상에서 원인까지 따라가 본 글',
  },
  experiment: {
    label: '실험 기록',
    description: '도구나 아이디어를 직접 써 본 글',
  },
  'system-note': {
    label: '시스템 노트',
    description: '시스템이 어떻게 돌아가는지 정리한 글',
  },
  essay: {
    label: '생각 기록',
    description: '생각을 정리해 적은 글',
  },
  'project-log': {
    label: '프로젝트 로그',
    description: '만들고 고친 과정을 적은 글',
  },
  observation: {
    label: '관찰 기록',
    description: '일상과 고양이들을 지켜보며 적은 글',
  },
} as const;

export const recordStatuses = {
  seed: '메모',
  growing: '쓰는 중',
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
