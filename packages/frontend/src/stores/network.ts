import { defineStore } from 'pinia';
import { useTokenStore } from './token';
import axios from 'axios';
import { notifyFailed } from 'src/utils/btNotify';
import { useBackgroundStore } from './Background';
import { OLaresFrpServer } from 'src/utils/servers';

export interface ReverseProxy {
	frp_server: string;
	frp_port: number;
	frp_auth_method: string;
	frp_auth_token: string;
	ip: string;
	enable_cloudflare_tunnel: boolean;
	enable_frp: boolean;
}

export interface OlaresTunnelInterface {
	name: string;
	host: string;
}

export type NetworkState = {
	reverseProxy?: ReverseProxy;
	olaresTunnels: OlaresTunnelInterface[];
};

export const useNetworkStore = defineStore('network', {
	state: () =>
		({ reverseProxy: undefined, olaresTunnels: [] } as NetworkState),

	getters: {},

	actions: {
		async configReverseProxy() {
			const tokenStore = useTokenStore();
			try {
				if (this.olaresTunnels.length == 0) {
					await this.getOlaresTunnels();
				}
				const proxyData: any = await axios.get(
					`${tokenStore.url}/api/reverse-proxy`
				);
				this.reverseProxy = proxyData;
			} catch (error) {
				console.log(error);
			}
		},

		async updateReverseProxy(proxy: ReverseProxy) {
			const tokenStore = useTokenStore();
			try {
				await axios.post(`${tokenStore.url}/api/reverse-proxy`, proxy);
				await this.configReverseProxy();
			} catch (error) {
				console.log(error);
				notifyFailed(error.message);
			}
		},

		async getOlaresTunnels() {
			const backgroundStore = useBackgroundStore();
			try {
				const olaresTunnels: any = await axios.get(
					backgroundStore.localeIsCN
						? OLaresFrpServer.cn
						: OLaresFrpServer.others
				);
				this.olaresTunnels = olaresTunnels.data;
			} catch (error) {
				console.log(error);
			}
		},
		olaresTunnelsOptions() {
			return this.olaresTunnels.map((item: OlaresTunnelInterface) => ({
				label: item.name,
				value: item.host,
				enable: true
			}));
		}
	}
});
