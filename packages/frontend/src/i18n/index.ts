import enUS from './en-US';

export default {
	'en-US': enUS
};

export const defaultLanguage = 'en-US';

export const supportLanguages = [
	{ value: 'en-US', label: 'English' },
	{ value: 'zh-CN', label: '简体中文' }
];

export type supportLanguageType = 'en-US' | 'zh-CN' | undefined;
