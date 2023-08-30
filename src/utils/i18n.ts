import type { MyContext } from '../types/grammy.types';
import { I18n } from '@grammyjs/i18n';

const i18n = new I18n<MyContext>({
  defaultLocale: 'uk',
  directory: 'locales',
});

export default i18n;
