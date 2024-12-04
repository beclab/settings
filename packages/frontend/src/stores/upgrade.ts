import { defineStore } from 'pinia';
import axios from 'axios';
import { useTokenStore } from './token';
import { UpgradeStatus, VersionInfo } from '../utils/constants';

interface upgradeState {
	versionInfo: VersionInfo | undefined;
	upgradeState: string;
}

export const useUpgradeStore = defineStore('upgrade', {
	state: () => {
		return {
			versionInfo: undefined,
			upgradeState: ''
		} as upgradeState;
	},
	actions: {
		async upgrade() {
			this.upgradeState = UpgradeStatus.Running;
			const tokenStore = useTokenStore();
			return await axios.get(tokenStore.url + '/api/upgrade', {});
		},

		async checkLastOsVersion() {
			try {
				const tokenStore = useTokenStore();
				this.versionInfo = await axios.get(
					tokenStore.url + '/api/checkLastOsVersion'
				);
			} catch (error) {
				console.log(error);
			}
		},

		async queryUpgradeState() {
			const tokenStore = useTokenStore();
			try {
				const res: any = await axios.get(
					tokenStore.url + '/api/upgrade/state'
				);
				this.upgradeState = res.state;
			} catch (error) {
				console.log('upgradeState error', error);
			}
		}
	}
});
