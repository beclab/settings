import axios from 'axios';
import { defineStore } from 'pinia';
import { useTokenStore } from './token';
import { TerminusApp, TerminusEntrance } from '@bytetrade/core';
import { i18n } from '../boot/i18n';
import { notifySuccess } from 'src/utils/btNotify';
import {
	AppPermission,
	PermissionProviderRegister,
	ApplicationCustonDomain
} from 'src/global';

export const systemApplicationIdList = [''];

export const useApplicationStore = defineStore('application', {
	state: () => ({
		applications: [] as TerminusApp[],
		entrances: {} as Record<string, Record<string, TerminusEntrance>>,
		customDomainApplications: [] as ApplicationCustonDomain[]
	}),

	getters: {},

	actions: {
		getApplicationById(name: string): TerminusApp | undefined {
			return this.applications.find((u) => u.name === name);
		},

		removeApplicationById(name: string) {
			const userIndex = this.applications.findIndex(
				(u) => u.name === name
			);
			if (userIndex < 0) {
				return;
			}
			this.applications.splice(userIndex, 1);
		},

		updateOneApplication(a: TerminusApp) {
			for (let i = 0; i < this.applications.length; ++i) {
				if (this.applications[i].name == a.name) {
					this.applications[i] = a;
					return;
				}
			}
			this.applications.push(a);
		},

		updateOneApplicationState(name: string, state: string) {
			for (let i = 0; i < this.applications.length; ++i) {
				if (this.applications[i].name == name) {
					this.applications[i].state = state;
					return;
				}
			}
		},

		async get_applications() {
			const tokenStore = useTokenStore();
			const data: any = await axios.get(tokenStore.url + '/api/myapps');
			if (this.applications.length != data.length) {
				this.applications = data;
			} else {
				for (let i = 0; i < data.length; ++i) {
					if (data[i].name !== 'settings') {
						this.updateOneApplication(data[i]);
					}
				}
			}
		},

		async resume(name: string) {
			const tokenStore = useTokenStore();

			await axios.get(tokenStore.url + '/api/app/resume/' + name);
		},

		async suspend(name: string) {
			const tokenStore = useTokenStore();
			await axios.get(tokenStore.url + '/api/app/suspend/' + name);
		},

		async status(name: string) {
			const tokenStore = useTokenStore();

			const data: any = await axios.get(
				tokenStore.url + '/api/app/status/' + name
			);
			this.updateOneApplicationState(name, data.status.state);
		},

		async getEntrances(app_name: string | undefined) {
			if (!app_name) {
				return false;
			}
			const tokenStore = useTokenStore();
			const data: any = await axios.get(
				`${tokenStore.url}/api/applications/${app_name}/entrances`
			);

			this.entrances[app_name] = {};
			for (const e of data.items) {
				this.entrances[app_name][e.name] = e;
			}
			return data.items;
		},

		async getPolicy(
			name: string | undefined,
			entrance: string | undefined
		) {
			if (!name || !entrance) {
				return false;
			}
			const tokenStore = useTokenStore();

			const data: any = await axios.get(
				`${tokenStore.url}/api/applications/${name}/${entrance}/setup/policy`
			);
			return data;
		},

		async set_appFa2(
			parmas: any,
			name: string | undefined,
			entrance: string | undefined
		) {
			if (!name || !entrance) {
				return false;
			}
			const tokenStore = useTokenStore();

			await axios.post(
				`${tokenStore.url}/api/applications/${name}/${entrance}/setup/policy`,
				parmas
			);
			notifySuccess(i18n.global.t('success'));
		},

		async getDomainSetup(name: string | undefined, entrance: string) {
			if (!name) {
				return false;
			}
			const tokenStore = useTokenStore();

			const data: any = await axios.get(
				`${tokenStore.url}/api/applications/${name}/${entrance}/setup/domain`
			);
			return data;
		},

		async setupDomain(
			name: string | undefined,
			entrance: string,
			parmas: any
		) {
			if (!name) {
				return false;
			}
			const tokenStore = useTokenStore();
			await axios.post(
				`${tokenStore.url}/api/applications/${name}/${entrance}/setup/domain`,
				parmas
			);
			notifySuccess(i18n.global.t('success'));
		},

		async setupCName(name: string | undefined, entrance: string) {
			const tokenStore = useTokenStore();
			await axios.get(
				`${tokenStore.url}/api/applications/${name}/${entrance}/setup/domain/finish`
			);
			notifySuccess(i18n.global.t('success'));
		},

		async setupAuthLevel(
			name: string | undefined,
			entrance: string,
			parmas: any
		) {
			if (!name) {
				return false;
			}
			const tokenStore = useTokenStore();
			await axios.post(
				`${tokenStore.url}/api/applications/${name}/${entrance}/setup/auth-level`,
				parmas
			);
			await this.getEntrances(name);
			notifySuccess(i18n.global.t('success'));
		},

		async getPermissions(
			app_name: string | undefined
		): Promise<AppPermission | undefined> {
			if (!app_name) {
				return undefined;
			}
			const tokenStore = useTokenStore();
			const data: AppPermission = await axios.get(
				`${tokenStore.url}/api/applications/permissions/${app_name}`
			);
			return data;
		},
		async getProviderRegistry(permission?: {
			dataType: string;
			group: string;
			version: string;
		}): Promise<PermissionProviderRegister | undefined> {
			if (!permission) {
				return undefined;
			}
			const tokenStore = useTokenStore();
			const data: any = await axios.get(
				`${tokenStore.url}/api/applications/provider-registry/${permission.dataType}/${permission.group}/${permission.version}`
			);
			return data;
		},

		async getProviderRegistryList(
			app_name?: string
		): Promise<PermissionProviderRegister[] | undefined> {
			if (!app_name) {
				return undefined;
			}
			const tokenStore = useTokenStore();
			const data: any = await axios.get(
				`${tokenStore.url}/api/applications/provider/registry/${app_name}`
			);
			return data.items;
		},

		async getEntranceSetupDomain() {
			// entrances/setup/domain
			const tokenStore = useTokenStore();
			const data: ApplicationCustonDomain[] = await axios.get(
				`${tokenStore.url}/api/applications/entrances/setup/domain`
			);
			this.customDomainApplications = data;
			return data;
		}
	}
});
