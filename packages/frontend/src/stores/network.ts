import { defineStore } from 'pinia';
import { useTokenStore } from './token';
import axios from 'axios';
import { notifyFailed } from 'src/utils/btNotify';

export interface ReverseProxy {
	frp_server: string;
	frp_port: number;
	frp_auth_method: string;
	frp_auth_token: string;
	ip: string;
	enable_cloudflare_tunnel: boolean;
	enable_frp: boolean;
}

export interface TerminusTunnelInterface {
	name: string;
	host: string;
}

export type NetworkState = {
	reverseProxy?: ReverseProxy;
	terminusTunnels: TerminusTunnelInterface[];
};

export const useNetworkStore = defineStore('network', {
	state: () => ({ reverseProxy: undefined } as NetworkState),

	getters: {},

	actions: {
		async configReverseProxy() {
			const tokenStore = useTokenStore();
			try {
				const proxyData: any = await axios.get(
					`${tokenStore.url}/api/reverse-proxy`
				);
				console.log('proxyData ====>', proxyData);
				this.reverseProxy = proxyData;
			} catch (error) {
				console.log(error);
			}
		},

		async getTerminusTunnels() {
			try {
				const terminusTunnels: any = await axios.get(
					'https://terminus-frp.snowinning.com/servers'
				);
				console.log('terminusTunnels ====>', terminusTunnels.data);
				this.terminusTunnels = terminusTunnels.data;
			} catch (error) {
				console.log(error);
			}
		},

		async updateReverseProxy(proxy: ReverseProxy) {
			const tokenStore = useTokenStore();
			try {
				const proxyData: any = await axios.post(
					`${tokenStore.url}/api/reverse-proxy`,
					proxy
				);
				console.log('proxyData ====>', proxyData);
				// this.reverseProxy = proxyData;
				await this.configReverseProxy();
			} catch (error) {
				console.log(error);
				notifyFailed(error.message);
			}
		},
		terminusTunnelsOptions() {
			console.log('this.terminusTunnels===>', this.terminusTunnels);

			return this.terminusTunnels.map(
				(item: TerminusTunnelInterface) => ({
					label: item.name,
					value: item.host,
					enable: true
				})
			);
		}
	}
});
