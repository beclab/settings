import { defineStore } from 'pinia';
import axios from 'axios';
import {
	AccountType,
	IntegrationAccount,
	IntegrationAccountMiniData
} from 'src/services/abstractions/integration/integrationService';
import { useTokenStore } from './token';
import integrationService from '../services/integration/index';

export type IntegrationState = {
	accounts: IntegrationAccountMiniData[];
};

export const useIntegrationStore = defineStore('integration', {
	state: () => ({ accounts: [] } as IntegrationState),

	getters: {},

	actions: {
		async getAccount(
			type: AccountType | 'all'
		): Promise<IntegrationAccountMiniData[]> {
			const tokenStore = useTokenStore();
			const result: any = await axios.get(
				`${tokenStore.url}/api/account/` + type
			);
			this.accounts = result;
			return result;
		},
		async getAccountByTypeAndName(
			type: AccountType,
			name: string
		): Promise<IntegrationAccountMiniData[]> {
			const tokenStore = useTokenStore();
			const result: any = await axios.get(
				`${tokenStore.url}/api/account/` + type + '/' + name
			);
			return result;
		},
		async createAccount(data: IntegrationAccount) {
			const tokenStore = useTokenStore();
			return await axios.post(
				`${tokenStore.url}/api/account/create`,
				data
			);
		},
		async deleteAccount(data: IntegrationAccountMiniData) {
			const tokenStore = useTokenStore();
			const key = this.get_store_key(data);
			return await axios.delete(`${tokenStore.url}/api/account/${key}`);
		},
		get_store_key(data: IntegrationAccountMiniData | IntegrationAccount) {
			if (data.name) {
				return 'integration-account:' + data.type + ':' + data.name;
			} else {
				return 'integration-account:' + data.type;
			}
		},
		getAccountByType(
			data: IntegrationAccountMiniData | IntegrationAccount
		) {
			return integrationService.getAccountByType(data.type);
		}
	}
});
