import { defineStore } from 'pinia';
import axios from 'axios';
import { useTokenStore } from './token';
import { UserInfo } from 'src/global';
import {
	TerminusInfo,
	DefaultTerminusInfo,
	TermiPassDeviceInfo,
	SSOToken
} from '@bytetrade/core';

export type UserSate = {
	terminus: TerminusInfo;
	user: UserInfo;
	devices: TermiPassDeviceInfo[];
	thisDevice: TermiPassDeviceInfo | null;
};

export interface SSOResult {
	sso: SSOToken;
	termiPass: TermiPassDeviceInfo;
}

export const useAdminStore = defineStore('admin', {
	state: () => {
		return {
			terminus: DefaultTerminusInfo,
			user: {
				created_user: '',
				is_ephemeral: false,
				name: '',
				owner_role: '',
				terminusName: '',
				wizard_complete: true,
				zone: '',
				imgContentMode: 'fill'
			},
			devices: [],
			thisDevice: null
		} as UserSate;
	},
	getters: {
		userManagerPermission(): boolean {
			return (
				this.user.owner_role != undefined &&
				this.user.owner_role === 'platform-admin'
			);
		},
		isAdmin(): boolean {
			return (
				this.user.owner_role != undefined &&
				this.user.owner_role === 'platform-admin'
			);
		}
	},

	actions: {
		saveUserName(userName: string) {
			this.user.name = userName;
		},

		async get_user_info() {
			const tokenStore = useTokenStore();

			const data: any = await axios.get(
				tokenStore.url + '/api/backend/v1/user-info'
			);

			this.user = data;
		},
		async get_vault_devices(): Promise<any> {
			const tokenStore = useTokenStore();

			const data: any = await axios.get(
				tokenStore.url + '/api/device/vault'
			);

			return data;
		},
		async get_sso(): Promise<SSOResult[]> {
			const tokenStore = useTokenStore();

			const data: SSOResult[] = await axios.get(
				tokenStore.url + '/api/device/sso'
			);

			return data;
		},
		async revoke_token(token: SSOResult) {
			const tokenStore = useTokenStore();
			await axios.delete(
				`${tokenStore.url}/api/device/sso/${token.termiPass.sso}`
			);
		}
	}
});
