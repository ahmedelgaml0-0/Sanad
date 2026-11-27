// Mock writes wait a moment, so loading states are visible while the real endpoints don't exist.
export const mockDelay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));
