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
	datasets: DatasetFolder[];
};

export interface DatasetFolder {
	datasetName: string;
	datasetID: string;
	status: string; //indexing | running | errored
	lastUpdateTime: string;
	indexDocNum: number;
	Paths: string[];
}

export const useFilesStore = defineStore('files', {
	state: () => {
		return {
			datasets: []
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

			// this.folder = data;
			// if (this.folder.paths == '') {
			// 	this.folder.p = [];
			// } else {
			// 	this.folder.p = this.folder.paths.split(',');
			// }
			this.UpdateSearchFolderPaths(['/data/Home/Documents']);
			return data;
		},
		async UpdateSearchFolderPaths(paths: string[]) {
			const tokenStore = useTokenStore();
			await axios.post(
				`${tokenStore.url}/api/files/UpdateSearchFolderPaths`,
				{ paths }
			);
		},
		async GetDatasetFolderStatus() {
			const tokenStore = useTokenStore();
			const data: DatasetFolder[] = await axios.get(
				`${tokenStore.url}/api/files/GetDatasetFolderStatus`
			);

			return data;
		},
		async UpdateDatasetFolderPaths(datasetID: string, paths: string[]) {
			const tokenStore = useTokenStore();
			await axios.post(
				`${tokenStore.url}/api/files/UpdateDatasetFolderPaths`,
				{ paths, datasetID }
			);
		}
	}
});
