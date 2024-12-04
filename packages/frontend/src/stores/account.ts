import axios from 'axios';
import { defineStore } from 'pinia';
import { useTokenStore } from './token';
import { SpaceSaveData, Secret } from '@bytetrade/core';

import { IntegrationAccount } from 'src/services/abstractions/integration/integrationService';

import { AccountType, IntegrationAccountMiniData } from '@bytetrade/core';

const SPACE_URL = process.env.SPACE_URL || 'https://cloud-api.bttcdn.com';

export interface AccountData {
	token?: string;
	refresh_token?: string;
	data?: string;
}

export interface AccountInfo {
	id: string;
	name: string;
	icon: string;
	desc: string;
	router: string;
	url: string;
}

export type AccountState = {
	accounts: AccountInfo[];
	secrets: Secret[];
};

export const useAccountStore = defineStore('account', {
	state: () => {
		return {
			accounts: [
				{
					id: 'space',
					name: 'Olares Space',
					icon: '',
					desc: 'Olares Space',
					router: '/account/space',
					url: SPACE_URL
				}
			],
			secrets: []
		} as AccountState;
	},

	getters: {
		space(): AccountInfo {
			return this.accounts.find(
				(item) => item.id === 'space'
			) as AccountInfo;
		},
		space_account(): SpaceSaveData | undefined {
			const res = this.secrets.find((item) =>
				item.name.startsWith('integration-account:space')
			);
			if (res) {
				return JSON.parse(res.value);
			} else {
				return undefined;
			}
		}
	},

	actions: {
		async retrieveSecret(name: string): Promise<Secret | null> {
			const tokenStore = useTokenStore();

			const data: Secret = await axios.get(
				`${tokenStore.url}/api/secret/${name}`
			);

			this.secrets.find((item) => item.name == data.name);
			return data;
		},

		async updateSecret(name: string, value: string) {
			const tokenStore = useTokenStore();
			const data: any = await axios.put(`${tokenStore.url}/api/secret`, {
				name,
				value
			});
			return data;
		},

		async deleteSecret(name: string) {
			const tokenStore = useTokenStore();
			await axios.delete(`${tokenStore.url}/api/secret/${name}`);
		},

		async listSecret(): Promise<Secret[]> {
			const tokenStore = useTokenStore();

			const data: Secret[] = await axios.get(
				`${tokenStore.url}/api/secret`
			);
			this.secrets = data;
			return data;
		},
		async createAccount(name: string, value: any) {
			const tokenStore = useTokenStore();
			const data: any = await axios.post(
				`${tokenStore.url}/api/account/create`,
				{
					name,
					type: 'space',
					raw_data: value
				}
			);
			return data;
		},
		async getAccount(
			type: AccountType | 'all'
		): Promise<IntegrationAccountMiniData[]> {
			const tokenStore = useTokenStore();
			const result: any = await axios.get(
				`${tokenStore.url}/api/account/` + type
			);
			return result;
		},
		async deleteAccount(data: IntegrationAccountMiniData) {
			const key = this.get_store_key(data);
			const tokenStore = useTokenStore();
			return await axios.delete(`${tokenStore.url}/api/account/${key}`);
		},
		get_store_key(data: IntegrationAccountMiniData | IntegrationAccount) {
			if (data.name) {
				return 'integration-account:' + data.type + ':' + data.name;
			} else {
				return 'integration-account:' + data.type;
			}
		}
	}
});
