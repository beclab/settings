import { DifyModelInfo } from '..//utils/constants';
import axios from 'axios';

export async function get_model_list(): Promise<DifyModelInfo[]> {
	try {
		const data: any = await axios.get('/nitro/model');
		console.log('get_model_list');
		return data ? data : [];
	} catch (e) {
		console.log(e);
		return [];
	}
}

export async function install_model(id: string) {
	await axios.post('/nitro/model/' + encodeURIComponent(id));
	console.log('install_model');
}

export async function get_model_info(
	id: string
): Promise<DifyModelInfo | null> {
	try {
		const data: any = await axios.get(
			'/nitro/model/' + encodeURIComponent(id)
		);
		console.log('get_model_info');
		return data ? data : null;
	} catch (e) {
		console.log(e);
		return null;
	}
}

export async function load_model(id: string) {
	await axios.post('/nitro/model/' + encodeURIComponent(id) + '/load');
	console.log('load_model');
}

export async function stop_model(id: string) {
	await axios.post('/nitro/model/' + encodeURIComponent(id) + '/stop');
	console.log('stop_model');
}

export async function delete_model(id: string) {
	await axios.delete('/nitro/model/' + encodeURIComponent(id));
	console.log('delete_model');
}
