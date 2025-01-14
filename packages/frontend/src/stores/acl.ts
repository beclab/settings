import { defineStore } from 'pinia';
import { useTokenStore } from './token';
import { notifySuccess } from '../utils/btNotify';
import { i18n } from '../boot/i18n';
import axios from 'axios';

export enum ActionType {
	APPLIED = 'applied',
	APPLYING = 'applying'
}

export interface AclInfo {
	proto: string;
	dst: string[];
}

export type AclState = {
	allow_ssh: boolean;
	state: ActionType;
	appAclList: AclInfo[];
};

export const useAclStore = defineStore('acl', {
	state: () => {
		return {
			allow_ssh: false,
			state: ActionType.APPLYING,
			appAclList: []
		} as AclState;
	},
	actions: {
		async getAclStatus() {
			const tokenStore = useTokenStore();

			const data: any = await axios.get(
				tokenStore.url + '/api/acl/ssh/status'
			);
			this.allow_ssh = data.allow_ssh;
			this.state = data.state;
		},

		async toggleAclStatus(open: boolean) {
			if (this.state === ActionType.APPLYING) {
				return;
			}
			const tokenStore = useTokenStore();
			let requestUrl = '';
			if (open) {
				requestUrl = '/api/acl/ssh/enable';
			} else {
				requestUrl = '/api/acl/ssh/disable';
			}

			await axios.post(tokenStore.url + requestUrl, {});
			notifySuccess(i18n.global.t('success'));
		},
		async getAppAclStatus(name: string) {
			this.appAclList = [];
			const tokenStore = useTokenStore();

			const data: any = await axios.get(
				tokenStore.url + '/api/acl/app/status?name=' + name
			);
			console.log(data);
			if (data.code === 0) {
				this.appAclList = data.data;
			} else {
				this.appAclList = [];
			}
		}
	}
});
