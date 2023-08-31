import type { MyContext } from '../types/grammy.types';
import { I18n } from '@grammyjs/i18n';

const i18n = new I18n<MyContext>({
  // Remove if user more than one language
  localeNegotiator: (ctx) => 'uk',
  defaultLocale: 'uk',
  directory: './src/locales',
});

export default i18n;
