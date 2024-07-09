import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useAccountStore } from 'src/stores/Account';
//import { useTokenStore } from '../stores/token';
import qs from 'qs';
import { notifyFailed } from '../utils/btNotify';

declare module '@vue/runtime-core' {
	interface ComponentCustomProperties {
		$axios: AxiosInstance;
	}
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({ baseURL: 'https://api.example.com' });

export default boot(({ app }) => {
	// for use inside Vue files (Options API) through this.$axios and this.$api

	app.config.globalProperties.$axios = axios;
	// ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
	//       so you won't necessarily have to import axios in each vue file

	app.config.globalProperties.$api = api;
	// ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
	//       so you can easily perform requests against your app's API

	app.config.globalProperties.$axios.interceptors.request.use(
		(config: AxiosRequestConfig) => {
			const store = useAccountStore();
			if (
				config.url &&
				config.url.indexOf(store.space.url) !== -1 &&
				config.method === 'post'
			) {
				config.data = qs.stringify(config.data || {});
				return config;
			} else {
				config.headers['Access-Control-Allow-Origin'] = '*';
				config.headers['Access-Control-Allow-Headers'] =
					'X-Requested-With,Content-Type';
				config.headers['Access-Control-Allow-Methods'] =
					'PUT,POST,GET,DELETE,OPTIONS';
				return config;
			}
		}
	);

	app.config.globalProperties.$axios.interceptors.response.use(
		(response: AxiosResponse) => {
			const store = useAccountStore();
			if (
				response.config.url &&
				response.config.url.indexOf(store.space.url) !== -1 &&
				response.config.method === 'post'
			) {
				const data = response.data;

				if (data && data.code === 401) {
					return response;
				}

				if (data.code !== 200) {
					throw new Error(data.message);
				}

				return data;
			} else {
				if (
					!response ||
					(response.status != 200 && response.status != 201) ||
					!response.data
				) {
					throw Error('Network error, please try again later');
				}

				const data = response.data;
				if (data.code == 100001) {
					//store.commit("account/remove");
					if (data.message) {
						notifyFailed('' + data.code + ' ' + data.message);
					}
					// router. push( { path : '/login' });
					throw Error(data.message);
					//return response;
				}

				console.log(response.config.url);

				if (
					response.config.url!.indexOf('kapis') >= 0 ||
					response.config.url!.indexOf(
						'ndbq.ursa-services.bttcdn.com'
					) >= 0
				) {
					return data;
				} else {
					if (data.code != 0 && data.code != 200 && !data.items) {
						//kapis return used in login history
						if (
							data.message &&
							response.config.url!.indexOf('permissions') < 0
						) {
							notifyFailed(
								data.message ||
									'Something wrong, please try again.'
							);
						}
						//return response;
						throw Error(data.message);
					}

					console.log(data);
					if (data.code == 0 || data.code == 200) {
						return data.data;
					} else {
						return data; //kapis return used in login history
					}
				}
			}
		}
	);
});

export { api };
