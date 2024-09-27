import { defineStore } from 'pinia';
import axios from 'axios';
import { useTokenStore } from './token';
import { VRAMMode } from 'src/utils/constants';
import { notifyFailed } from 'src/utils/btNotify';

export const useGPUStore = defineStore('gpu', {
	state: () => ({
		managed_memory: false //# true 共享模式 or false 独占模式
	}),

	getters: {
		currentVRAMMode(state) {
			return state.managed_memory ? VRAMMode.Shared : VRAMMode.Standalone;
		}
	},

	actions: {
		async configManagerMemoryMode() {
			const tokenStore = useTokenStore();
			try {
				const managedMemory: any = await axios.get(
					`${tokenStore.url}/api/gpu/managed-memory`
				);
				console.log('managedMemory ====>', managedMemory);
				if (
					managedMemory != undefined &&
					managedMemory.managed_memory != undefined
				) {
					this.managed_memory = managedMemory.managed_memory;
				}
			} catch (error) {
				console.log(error);
			}
		},
		async setManagerMemoryMode(mode: VRAMMode) {
			const tokenStore = useTokenStore();
			try {
				const result: any = await axios.post(
					`${tokenStore.url}/api/gpu/managed-memory`,
					{ managedMemory: mode == VRAMMode.Shared ? true : false }
				);
				console.log('managedMemory ====>', result);
				this.managed_memory = mode == VRAMMode.Shared;
			} catch (error) {
				console.log(error);
				// notifyFailed(error.message);
			}
		}
	}
});
