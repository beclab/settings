import { defineStore } from 'pinia';
import { ResolutionResult } from '@bytetrade/core';
import axios, { AxiosInstance } from 'axios';

export type SSIState = {
	did_url: string | undefined;

	did_instance: AxiosInstance | undefined;
};

export const useDIDStore = defineStore('did', {
	state: () => {
		return {
			did_url: undefined,

			did_instance: undefined
		} as SSIState;
	},
	getters: {},
	actions: {
		async pre_did_register(jws: string) {
			const data = await this.did_instance!.post('/create_local', {
				jws
			});
			return data;
		},
		async get_name_by_did(did: string): Promise<string | null | undefined> {
			try {
				const get_did_response = await this.did_instance!.get(
					'/get_name_by_did/' + did
				);

				if (get_did_response && get_did_response.status == 200) {
					if (get_did_response.data.code == 0) {
						return get_did_response.data.data;
					} else {
						return null;
					}
				}
				return null;
			} catch (err) {
				console.log(err);
				return undefined;
			}
		},
		async resolve_did(did: string): Promise<ResolutionResult | null> {
			try {
				const get_did_response = await this.did_instance!.get(
					'/1.0/identifiers/' + did
				);

				if (get_did_response && get_did_response.status == 200) {
					return get_did_response.data;
				}
				return null;
			} catch (err) {
				console.log(err);
				return null;
			}
		},
		async resolve_name(name: string): Promise<ResolutionResult | null> {
			try {
				const get_name_response = await this.did_instance!.get(
					'/1.0/name/' + name.replace('@', '.')
				);
				if (get_name_response && get_name_response.status == 200) {
					return get_name_response.data;
				}
				return null;
			} catch (err) {
				console.log(err);
				return null;
			}
		},
		setDIDUrl(did_url: string) {
			this.did_url = did_url;
			this.did_instance = axios.create({
				baseURL: this.did_url,
				timeout: 10000,
				headers: {
					'Content-Type': 'application/json'
				}
			});
		}
	}
});
