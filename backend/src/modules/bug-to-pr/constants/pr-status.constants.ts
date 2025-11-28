export const PR_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
} as const;

export type PRStatus = typeof PR_STATUS[keyof typeof PR_STATUS];

