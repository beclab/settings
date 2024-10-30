import { defineStore } from 'pinia';
import { NewVersion } from '../global';
import axios from 'axios';
import { useTokenStore } from './token';

export const useUpgradeStore = defineStore('upgrade', {
	getters: {},
	actions: {
		async upgrade() {
			const tokenStore = useTokenStore();
			const data: any = await axios.get(
				tokenStore.url + '/api/upgrade',
				{}
			);
			return data;
		},

		async new_version() {
			const tokenStore = useTokenStore();

			const data: NewVersion = await axios.get(
				tokenStore.url + '/api/checkLastOsVersion'
			);
			return data;
		},

		async upgradeState() {
			const tokenStore = useTokenStore();
			try {
				const data: any = await axios.get(
					tokenStore.url + '/api/upgrade/state'
				);
				return data;
			} catch (error) {
				console.log('upgradeState error', error);
			}
		}
	}
});
