export const TABLE_LINE_THRESHOLD = 25;
export const IMAGE_DECODE_DELAY = 100;
export const IMAGE_QUALITY = 0.8;

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
