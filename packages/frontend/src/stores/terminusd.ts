import { defineStore } from 'pinia';
import axios from 'axios';
import { useAdminStore } from './admin';
import { useTokenStore } from './token';
import { HostItem } from '../utils/constants';

export const useTerminusDStore = defineStore('terminusd', {
	state: () => ({}),

	actions: {
		async system_status() {
			const admin = useAdminStore();
			console.log(admin.terminus.terminusId);
			const tokenStore = useTokenStore();
			const data: any = await axios.get(
				`${tokenStore.url}/api/system/status`,
				{
					headers: {
						'X-Signature': admin.terminus.terminusId
					}
				}
			);
			console.log(data);
			return data;
		},
		async collect_logs() {
			const admin = useAdminStore();
			console.log(admin.terminus.terminusId);
			const tokenStore = useTokenStore();
			const data: any = await axios.post(
				`${tokenStore.url}/api/command/collectLogs`,
				null,
				{
					headers: {
						'X-Signature': admin.terminus.terminusId
					}
				}
			);
			console.log(data);
			return data;
		},
		async getHostsList(): Promise<HostItem[]> {
			const admin = useAdminStore();
			console.log(admin.terminus.terminusId);
			const tokenStore = useTokenStore();
			const data: any = await axios.get(
				`${tokenStore.url}/api/system/hosts-file`,
				{
					headers: {
						'X-Signature': admin.terminus.terminusId
					}
				}
			);
			console.log(data);
			return data;
		},
		async updateHostsList(items: HostItem[]) {
			const admin = useAdminStore();
			console.log(admin.terminus.terminusId);
			const tokenStore = useTokenStore();
			const data: any = await axios.post(
				`${tokenStore.url}/api/system/hosts-file`,
				{ items: items },
				{
					headers: {
						'X-Signature': admin.terminus.terminusId
					}
				}
			);
			console.log(data);
			return data;
		}
	}
});
