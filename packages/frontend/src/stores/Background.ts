import axios from 'axios';
import { defineStore } from 'pinia';
import { useTokenStore } from './token';

export interface Wallpaper {
	desktop: string;
	login: string;
	upload_desktop_backgrounds: string[];
	upload_login_backgrounds: string[];
}

export type BackgroundState = {
	//
	wallpaper: Wallpaper;
};

export const useBackgroundStore = defineStore('background', {
	state: () => {
		return {
			wallpaper: {}
		} as BackgroundState;
	},

	getters: {
		//
	},

	actions: {
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
		}
	}
});
