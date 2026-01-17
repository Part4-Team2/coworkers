// ==== Next.js Data Cache - Revalidate Time (seconds) ====
// 공개 데이터에 대한 서버 캐시 시간
// 개인 데이터는 cache 옵션을 사용하지 않음 (no-store)
export const REVALIDATE_TIME = {
  ARTICLE: 60,
  ARTICLE_COMMENT: 30,
};
