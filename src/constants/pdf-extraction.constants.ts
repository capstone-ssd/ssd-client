export const TABLE_LINE_THRESHOLD = 25;
export const IMAGE_DECODE_DELAY = 100;
export const IMAGE_QUALITY = 0.8;

// 같은 줄로 판단할 yRatio 허용 오차 (페이지 높이 대비)
export const SAME_LINE_Y_THRESHOLD = 0.008;
// 새 단락으로 분리할 yRatio 간격 (이 값 이상 벌어지면 줄바꿈으로 판단)
export const NEW_LINE_Y_THRESHOLD = 0.018;

export const AZURE_EXTRACT_INFO = Object.freeze({
  MAX_POST_ATTEMPTS: 10,
  MAX_POLLING_ATTEMPTS: 60,
  INITIAL_DELAY_MS: 2000,
  RATE_LIMIT_MULTIPLIER: 2,
  POLLING_DELAY_MULTIPLIER: 1.5,
  MAX_POLLING_DELAY_MS: 10000,

  endpoint: import.meta.env.VITE_AZURE_ENDPOINT,
  apiKey: import.meta.env.VITE_AZURE_KEY,
});
