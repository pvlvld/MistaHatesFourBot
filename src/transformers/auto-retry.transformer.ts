import { autoRetry } from '@grammyjs/auto-retry';

const autoRetryTransformer = autoRetry({
  maxDelaySeconds: 60,
  maxRetryAttempts: 3,
  retryOnInternalServerErrors: false,
});

export default autoRetryTransformer;
