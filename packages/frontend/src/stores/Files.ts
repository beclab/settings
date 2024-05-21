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
	indexDocNum?: number;
	paths: string[];
	linkedAgentNum?: number;
	default: boolean;
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
			console.log('request GetDatasetFolderStatus');

			const data: any = await axios.get(
				`${tokenStore.url}/api/files/GetDatasetFolderStatus`
			);
			console.log('data ==>');
			console.log(data);
			console.log(Object.values(data));
			this.datasets = Object.values(data);
			console.log(this.datasets);
			return data;
		},
		// datasetID,
		// datasetName,
		// paths,
		// create_or_delete,
		// 4. create_or_delete: 1表示新建（仅当提交的数据集名称不存在对应数据集时），-1表示删除（需要同时提交paths为空列表），其余值或不传不会引发特殊操作
		async UpdateDatasetFolderPaths(
			datasetID?: string,
			datasetName?: string,
			paths = [] as string[],
			create_or_delete = 0
		) {
			const tokenStore = useTokenStore();
			const data = await axios.post(
				`${tokenStore.url}/api/files/UpdateDatasetFolderPaths`,
				{ paths, datasetID, datasetName, create_or_delete }
			);

			console.log();
			console.log('data ==>');
			console.log(data);
			await this.GetDatasetFolderStatus();
			return data;
		}
	}
});
