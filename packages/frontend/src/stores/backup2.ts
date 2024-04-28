import { defineStore } from 'pinia';
import axios from 'axios';
import { useTokenStore } from './token';
import {
	BackupCreateReq,
	BackupUpdateReq,
	BackupPlanItems,
	BackupPlanItem,
	BackupSnapshots,
	BackupSnapshotDetail
} from '@bytetrade/core';

export type BackupState = {
	plans: BackupPlanItem[];
};

export const useBackup2Store = defineStore('backup2', {
	state: () => {
		return {
			plans: []
		} as BackupState;
	},
	getters: {},
	actions: {
		async init() {
			await this.getPlans();
		},
		updateOnePlan(data: BackupPlanItem) {
			for (let i = 0; i < this.plans.length; ++i) {
				if (this.plans[i].name === data.name) {
					this.plans[i] = data;
					return;
				}
			}
			this.plans.push(data);
		},
		async SetPlanPassword(name: string, password: string) {
			const tokenStore = useTokenStore();

			await axios.put(tokenStore.url + '/api/backup/password/' + name, {
				password
			});
		},
		async createPlan(req: BackupCreateReq) {
			const tokenStore = useTokenStore();

			await axios.post(tokenStore.url + '/api/backup/plans', req);
		},
		async updatePlan(name: string, req: BackupUpdateReq) {
			const tokenStore = useTokenStore();
			const data: BackupPlanItems = await axios.put(
				tokenStore.url + '/api/backup/plans/' + name,
				req
			);

			for (let i = 0; i < data.total; ++i) {
				this.updateOnePlan(data.items[i]);
			}
		},
		async deletePlan(name: string) {
			const tokenStore = useTokenStore();
			await axios.delete(tokenStore.url + '/api/backup/plans/' + name);
			this.plans = this.plans.filter((item) => item.name !== name);
		},
		async getPlans() {
			const tokenStore = useTokenStore();
			const data: BackupPlanItems = await axios.get(
				tokenStore.url + '/api/backup/plans'
			);
			this.plans = data.items;
		},
		async getPlan(name: string): Promise<BackupPlanItem | null> {
			const tokenStore = useTokenStore();
			const data: BackupPlanItem = await axios.get(
				tokenStore.url + '/api/backup/plans/' + name
			);

			this.updateOnePlan(data);
			return data;
		},
		async getSnapshots(name: string) {
			const tokenStore = useTokenStore();
			const data: BackupSnapshots = await axios.get(
				tokenStore.url + '/api/backup/' + name + '/snapshots'
			);

			return data.items.reverse();
		},

		async getSnapShotDetail(
			plan: string,
			snapshot: string
		): Promise<BackupSnapshotDetail> {
			const tokenStore = useTokenStore();
			const data = await axios.get(
				tokenStore.url +
					'/api/backup/' +
					plan +
					'/snapshots/' +
					snapshot
			);
			console.log(data);
			return data.data;
		},
		async deleteSnapShot(plan: string, snapshot: string): Promise<void> {
			const tokenStore = useTokenStore();
			const data: BackupSnapshotDetail = await axios.delete(
				tokenStore.url +
					'/api/backup/' +
					plan +
					'/snapshots/' +
					snapshot
			);
			console.log(data);
		}
	}
});
