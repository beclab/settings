import axios from 'axios';
import { defineStore } from 'pinia';
import { useTokenStore } from './token';
import { Cookies, Dark } from 'quasar';

export interface Wallpaper {
	desktop: string;
	login: string;
	upload_desktop_backgrounds: string[];
	upload_login_backgrounds: string[];
}

export enum Exterior {
	AUTO = 0,
	WHITE = 1,
	DARK = 2
}

export const exteriorOptions = [
	{
		label: 'White',
		value: Exterior.WHITE
	},
	{
		label: 'Dark',
		value: Exterior.DARK
	},
	{
		label: 'Auto',
		value: Exterior.AUTO
	}
];

export type BackgroundState = {
	//
	wallpaper: Wallpaper;
	exterior: Exterior;
};

export const exterior_mode = 'exterior_mode';

export const useBackgroundStore = defineStore('background', {
	state: () => {
		return {
			wallpaper: {},
			exterior: Exterior.AUTO
		} as BackgroundState;
	},

	getters: {
		//
	},

	actions: {
		async init() {
			const exterior_name = Cookies.get(exterior_mode);
			console.log('exterior_name', exterior_name);

			if (exterior_name) {
				this.exterior = Number(exterior_name);
			}
			this.updateQuasarDark();
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
		async exteriorUpdate(exterior: Exterior) {
			this.exterior = exterior;
			this.updateQuasarDark();

			Cookies.set(exterior_mode, `${exterior}`, {
				path: '/',
				sameSite: 'None',
				secure: true
			});
		},
		async updateQuasarDark() {
			if (this.exterior == Exterior.AUTO) {
				Dark.set('auto');
			} else {
				Dark.set(this.exterior == Exterior.DARK);
			}
		}
	}
});
