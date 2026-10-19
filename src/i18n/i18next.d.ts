import 'i18next';

import type { resources } from './index';

// Typage des clés : t('home.title') est vérifié par TypeScript
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: (typeof resources)['fr'];
  }
}
