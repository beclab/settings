import enUS from './en-US';
import zhCN from './zh-CN';

export default {
	'en-US': enUS,
	'zh-CN': zhCN
};

export const defaultLanguage = 'en-US';

export const supportLanguages = [
	{ value: 'en-US', label: 'English', enable: true },
	{ value: 'zh-CN', label: '简体中文', enable: true }
];

export const languagesShort = {
	en: 'en-US',
	zh: 'zh-CN'
};

export type SupportLanguageType = 'en-US' | 'zh-CN' | undefined;

export const languagesJson: Record<string, SupportLanguageType> = {
	English: 'en-US',
	'Chinese (Simplified)': 'zh-CN'
};
