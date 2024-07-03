import axios from 'axios';
import { defineStore } from 'pinia';
import { useTokenStore } from './token';
import {
	AccountInfo,
	AccountModifyStatus,
	CreateAccountRequest,
	RestAccountPassword,
	UpdateAccountQuotaRequest,
	UsersParam
} from '../global';
import { useAdminStore } from './Admin';

export type AccountState = {
	accounts: AccountInfo[];
};

export interface UserUsage {
	user_cpu_total: number;
	user_cpu_usage: number;
	user_memory_usage: number;
	user_memory_total: number;
}

export const useUserStore = defineStore('user', {
	state: () => {
		return {
			accounts: []
		} as AccountState;
	},

	getters: {
		currentUserInfo(): AccountInfo | undefined {
			const admin = useAdminStore();
			return this.accounts.find((a) => admin.user.name === a.name);
		}
	},

	actions: {
		async create_account(req: CreateAccountRequest) {
			const tokenStore = useTokenStore();
			await axios.post(tokenStore.url + '/api/users', req);
		},

		async update_account_quoto(
			user: string,
			body: UpdateAccountQuotaRequest
		) {
			const tokenStore = useTokenStore();
			await axios.put(
				tokenStore.url + '/api/users/' + user + '/limits',
				body
			);
		},

		async update_account(account: AccountInfo) {
			for (let i = 0; i < this.accounts.length; ++i) {
				if (this.accounts[i].name == account.name) {
					this.accounts[i] = account;
					return;
				}
			}
			this.accounts.push(account);
		},

		async get_accounts() {
			const tokenStore = useTokenStore();
			const data: any = await axios.get(tokenStore.url + '/api/users');
			for (let i = 0; i < data.items.length; ++i) {
				this.update_account(data.items[i]);
			}

			const admins: AccountInfo[] = [];
			const actives: AccountInfo[] = [];
			const noActives: AccountInfo[] = [];
			this.accounts.sort((a, b) => {
				return a.creation_timestamp - b.creation_timestamp;
			});

			this.accounts.forEach((e) => {
				if (
					e.roles.findIndex((role) => role == 'platform-admin') >= 0
				) {
					admins.push(e);
					return;
				}
				if (e.wizard_complete) {
					actives.push(e);
					return;
				}
				noActives.push(e);
			});

			this.accounts = [...admins, ...actives, ...noActives];
		},

		getUserByName(name: string) {
			return this.accounts.find((u) => u.name === name);
		},

		async get_account_info(username: string) {
			return this.accounts.find((account) => account.name == username);
		},

		async update_account_info(username: string) {
			const tokenStore = useTokenStore();
			const data: any = await axios.get(
				tokenStore.url + '/api/users/' + username
			);

			this.update_account(data);
		},

		async get_admin_account_useage(): Promise<UserUsage> {
			const tokenStore = useTokenStore();
			const data: any = await axios.get(
				tokenStore.url + '/api/monitor/cluster'
			);
			const user_cpu_total = data.cpu.total;
			const user_cpu_usage = data.cpu.usage;
			const user_memory_total = data.memory.total * 1024 * 1024 * 1024;
			const user_memory_usage = data.memory.usage * 1024 * 1024 * 1024;
			return {
				user_cpu_total,
				user_cpu_usage,
				user_memory_usage,
				user_memory_total
			};
		},

		async get_account_useage(username: string): Promise<UserUsage> {
			const tokenStore = useTokenStore();
			const data: any = await axios.get(
				tokenStore.url +
					'/kapis/monitoring.kubesphere.io/v1alpha3/users/' +
					username +
					'?metrics_filter=user_cpu_usage|user_memory_usage|user_cpu_total|user_memory_total$',
				{}
			);

			const user_cpu_total = data.results.find(
				(re) => re.metric_name == 'user_cpu_total'
			).data.result[0].value[1];
			const user_cpu_usage = data.results.find(
				(re) => re.metric_name == 'user_cpu_usage'
			).data.result[0].value[1];

			const user_memory_usage = data.results.find(
				(re) => re.metric_name == 'user_memory_usage'
			).data.result[0].value[1];

			const user_memory_total = data.results.find(
				(re) => re.metric_name == 'user_memory_total'
			).data.result[0].value[1];

			return {
				user_cpu_total,
				user_cpu_usage,
				user_memory_usage,
				user_memory_total
			};
		},

		async delete_account(username: string) {
			const tokenStore = useTokenStore();
			return await axios.delete(
				tokenStore.url + '/api/users/' + username,
				{}
			);
		},

		async removeLocalAccount(username: string) {
			const index = this.accounts.findIndex(
				(account) => account.name == username
			);
			if (index >= 0) {
				this.accounts.splice(index, 1);
			}
		},

		async reset_account_password(req: RestAccountPassword) {
			const tokenStore = useTokenStore();
			const data: any = await axios.put(
				tokenStore.url + '/api/users/' + req.username + '/password',
				req
			);
			return data;
		},

		async get_account_status(
			username: string
		): Promise<AccountModifyStatus> {
			const tokenStore = useTokenStore();
			const data: any = await axios.get(
				tokenStore.url + '/api/users/' + username + '/status'
			);
			return data;
		},

		async getLoginrecords(params: UsersParam): Promise<any> {
			const tokenStore = useTokenStore();
			const { user, ...rest } = params;
			const data: any = await axios.get(
				tokenStore.url +
					'/kapis/iam.kubesphere.io/v1alpha2/users/' +
					user +
					' /loginrecords',
				{ params: rest }
			);
			return data;
		}
	}
});
