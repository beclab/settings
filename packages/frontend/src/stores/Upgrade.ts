import { defineStore } from 'pinia';
import { NewVersion } from '../global';
import axios from 'axios';
import { useTokenStore } from './token';

const checkDevMode = () => {
	const dev_mode = localStorage.getItem('dev_mode');

	if (dev_mode === 'true') {
		return '?dev_mode=true';
	}
	return '?dev_mode=false';
};

export const useUpgradeStore = defineStore('upgrade', {
	getters: {},
	actions: {
		async upgrade() {
			const tokenStore = useTokenStore();
			const data: any = await axios.get(
				tokenStore.url + '/api/upgrade' + checkDevMode(),
				{}
			);
			return data;
		},

		async new_version() {
			const tokenStore = useTokenStore();

			const data: NewVersion = await axios.get(
				tokenStore.url + '/api/checkLastOsVersion' + checkDevMode()
			);
			return data;
		},

		async upgradeState() {
			const tokenStore = useTokenStore();
			try {
				const data: any = await axios.get(
					tokenStore.url + '/api/upgrade/state' + checkDevMode(),
					{}
				);
				return data;
			} catch (error) {
				console.log('upgradeState error', error);
			}
		}
	}
});
