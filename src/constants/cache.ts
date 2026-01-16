/**
 * Next.js Data Cache - Revalidate Time (seconds)
 *
 * 공개 데이터에 대한 서버 캐시 시간
 * 개인 데이터는 cache 옵션을 사용하지 않음 (no-store)
 */
export const REVALIDATE_TIME = {
  // Group (팀) - 자주 변경되지 않음
  GROUP_LIST: 60, // 1분 - 팀 목록
  GROUP_DETAIL: 60, // 1분 - 팀 상세

  // Task List (할 일 목록) - 중간 빈도
  TASK_LIST: 30, // 30초 - 할 일 목록
  TASK_DETAIL: 30, // 30초 - 할 일 상세

  // Article (게시글) - 자주 변경됨
  ARTICLE_LIST: 120, // 2분 - 게시글 목록
  ARTICLE_DETAIL: 60, // 1분 - 게시글 상세
  BEST_ARTICLE: 300, // 5분 - 베스트 게시글

  // User Stats (개인 - Cookie로 사용자별 캐시 분리)
  USER_HISTORY: 120, // 2분 - 사용자 히스토리
  USER_STATS: 120, // 2분 - 사용자 통계
} as const;

/**
 * Revalidate Paths
 *
 * Server Action에서 revalidatePath 호출 시 사용
 */
export const REVALIDATE_PATH = {
  // Group
  GROUP_LIST: "/teamlist",
  GROUP_DETAIL: (groupId: string) => `/${groupId}`,

  // Task
  TASK_LIST: (groupId: string) => `/${groupId}/tasklist`,

  // Article
  ARTICLE_LIST: "/boards",
  ARTICLE_DETAIL: (articleId: string) => `/boards/${articleId}`,

  // User
  USER_HISTORY: "/myhistory",
} as const;

/**
 * Revalidate Tags
 *
 * revalidateTag로 세밀한 캐시 무효화 가능
 * Path보다 더 정밀한 캐시 제어가 필요한 경우 사용
 */
export const REVALIDATE_TAG = {
  // Group
  GROUP: (groupId: string) => `group-${groupId}`,
  GROUP_LIST: "group-list",
  GROUP_MEMBERS: (groupId: string) => `group-${groupId}-members`,
  GROUP_TASKS: (groupId: string) => `group-${groupId}-tasks`,

  // Task List
  TASK_LIST: (taskListId: number) => `task-list-${taskListId}`,
  TASK: (taskId: number) => `task-${taskId}`,

  // Article
  ARTICLE: (articleId: number) => `article-${articleId}`,
  ARTICLE_LIST: "article-list",
  ARTICLE_COMMENTS: (articleId: number) => `article-${articleId}-comments`,

  // User
  USER: (userId: number) => `user-${userId}`,
  USER_HISTORY: (userId: number) => `user-${userId}-history`,
} as const;
