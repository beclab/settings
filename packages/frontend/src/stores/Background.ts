import axios from 'axios';
import { defineStore } from 'pinia';
import { useTokenStore } from './token';
import { Cookies, Dark } from 'quasar';
import { getSecondLevelDomain } from '../utils/constants';
import { ThemeDefinedMode, themeModeName } from '@bytetrade/ui';
import { i18n } from '../boot/i18n';
import { useDeviceStore } from './device';
import { SupportLanguageType } from 'src/i18n';

export interface Wallpaper {
	desktop: string;
	login: string;
	upload_desktop_backgrounds: string[];
	upload_login_backgrounds: string[];
}

export const themeOptions = [
	{
		label: i18n.global.t('light'),
		value: ThemeDefinedMode.LIGHT
	},
	{
		label: i18n.global.t('dark'),
		value: ThemeDefinedMode.DARK
	},
	{
		label: i18n.global.t('auto'),
		value: ThemeDefinedMode.AUTO
	}
];

export type BackgroundState = {
	//
	wallpaper: Wallpaper;
	theme: ThemeDefinedMode;
	locale: SupportLanguageType;
	isMobile: boolean;
};

export const useBackgroundStore = defineStore('background', {
	state: () => {
		return {
			wallpaper: {},
			theme: ThemeDefinedMode.LIGHT,
			isMobile: false
		} as BackgroundState;
	},

	getters: {
		//
	},

	actions: {
		async init() {
			const themeName = Cookies.get(themeModeName);
			if (themeName) {
				this.theme = Number(themeName);
				this.themeUpdate(Number(themeName));
			}
		},
		async get_wallpaper() {
			const tokenStore = useTokenStore();

			const data: any = await axios.get(
				`${tokenStore.url}/api/wallpaper`
			);

			this.wallpaper = data;
		},
		async upload_desktop_background(bg: string) {
			const tokenStore = useTokenStore();
			this.wallpaper.upload_desktop_backgrounds.push(bg);
			const data: any = await axios.post(
				`${tokenStore.url}/api/wallpaper/upload/desktop`,
				{ bg }
			);
			return data;
		},
		async delete_desktop_background(bg: string) {
			const tokenStore = useTokenStore();

			this.wallpaper.upload_desktop_backgrounds =
				this.wallpaper.upload_desktop_backgrounds.filter(
					(item) => item == bg
				);

			const data: any = await axios.post(
				`${tokenStore.url}/api/wallpaper/delete/desktop`,
				{ bg }
			);

			return data;
		},
		async set_desktop_background(bg: string) {
			const tokenStore = useTokenStore();
			this.wallpaper.desktop = bg;
			const data: any = await axios.post(
				`${tokenStore.url}/api/wallpaper/desktop`,
				{ bg }
			);
			return data;
		},
		async upload_login_background(bg: string) {
			const tokenStore = useTokenStore();
			this.wallpaper.upload_login_backgrounds.push(bg);
			const data: any = await axios.post(
				`${tokenStore.url}/api/wallpaper/upload/login`,
				{ bg }
			);
			return data;
		},
		async delete_login_background(bg: string) {
			const tokenStore = useTokenStore();

			this.wallpaper.upload_login_backgrounds =
				this.wallpaper.upload_login_backgrounds.filter(
					(item) => item == bg
				);

			const data: any = await axios.post(
				`${tokenStore.url}/api/wallpaper/delete/login`,
				{ bg }
			);

			return data;
		},
		async set_login_background(bg: string) {
			const tokenStore = useTokenStore();

			this.wallpaper.login = bg;
			const data: any = await axios.post(
				`${tokenStore.url}/api/wallpaper/login`,
				{ bg }
			);
			return data;
		},
		async themeUpdate(theme: ThemeDefinedMode) {
			this.theme = theme;
			this.updateQuasarDark();
			Cookies.set(themeModeName, `${theme}`, {
				path: '/',
				domain: getSecondLevelDomain(),
				sameSite: 'None',
				secure: true
			});
			window.parent.postMessage(
				{
					message: 'theme_update',
					info: {
						theme
					}
				},
				'*'
			);
			this.updateBodyBg();
		},
		updateBodyBg() {
			if (this.theme == ThemeDefinedMode.DARK) {
				document.body.style.background = '#1f1f1f';
			} else {
				const deviceStore = useDeviceStore();
				if (deviceStore.isMobile) {
					document.body.style.background = '#f6f6f6';
				} else {
					document.body.style.background = '#ffffff';
				}
			}
		},
		async updateQuasarDark() {
			if (this.theme == ThemeDefinedMode.AUTO) {
				Dark.set('auto');
			} else {
				Dark.set(this.theme == ThemeDefinedMode.DARK);
			}
		},
		async updateLanguageLocale(locale: SupportLanguageType) {
			this.locale = locale;
			// await userModeSetItem('locale', this.locale);
			if (this.locale) {
				i18n.global.locale.value = this.locale;
			}
		}
	}
});
