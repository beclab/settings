import axios from 'axios';
import { defineStore } from 'pinia';
import { useTokenStore } from './token';
import { Cookies, Dark } from 'quasar';
import { getSecondLevelDomain } from '../utils/constants';
import { ThemeDefinedMode, themeModeName } from '@bytetrade/ui';

export interface Wallpaper {
	desktop: string;
	login: string;
	upload_desktop_backgrounds: string[];
	upload_login_backgrounds: string[];
}

export const themeOptions = [
	{
		label: 'Light',
		value: ThemeDefinedMode.LIGHT
	},
	{
		label: 'Dark',
		value: ThemeDefinedMode.DARK
	},
	{
		label: 'Auto',
		value: ThemeDefinedMode.AUTO
	}
];

export type BackgroundState = {
	//
	wallpaper: Wallpaper;
	theme: ThemeDefinedMode;
};

export const useBackgroundStore = defineStore('background', {
	state: () => {
		return {
			wallpaper: {},
			theme: ThemeDefinedMode.LIGHT
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
			console.log('post window.parent ===>');
			window.parent.postMessage(
				{
					message: 'theme_update',
					info: {
						theme
					}
				},
				'*'
			);
		},
		async updateQuasarDark() {
			if (this.theme == ThemeDefinedMode.AUTO) {
				Dark.set('auto');
			} else {
				Dark.set(this.theme == ThemeDefinedMode.DARK);
			}
		}
	}
});
