import axios from 'axios';
import { defineStore } from 'pinia';
import { useTokenStore } from './token';

export interface SearchFileForder {
	index_doc_num: number;
	last_update_time: string;
	paths: string;
	p: string[];
	status: string;
}
export type FileState = {
	folder: SearchFileForder;
};

export const useFilesStore = defineStore('files', {
	state: () => {
		return {
			folder: {}
		} as FileState;
	},

	getters: {
		//
	},

	actions: {
		async GetSearchFolderStatus() {
			const tokenStore = useTokenStore();
			const data: any = await axios.get(
				`${tokenStore.url}/api/files/GetSearchFolderStatus`
			);

			this.folder = data;
			if (this.folder.paths == '') {
				this.folder.p = [];
			} else {
				this.folder.p = this.folder.paths.split(',');
			}
			return data;
		},
		async UpdateSearchFolderPaths(paths: string[]) {
			const tokenStore = useTokenStore();
			await axios.post(
				`${tokenStore.url}/api/files/UpdateSearchFolderPaths`,
				{ paths }
			);
		}
	}
});
