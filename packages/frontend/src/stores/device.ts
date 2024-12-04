import { defineStore } from 'pinia';
import { useBackgroundStore } from './background';

export const useDeviceStore = defineStore('deviceStore', {
	state: () => ({
		isMobile: window.innerWidth < 768
	}),

	getters: {},

	actions: {
		updateIsMobile(isMoble: boolean) {
			if (this.isMobile == isMoble) {
				return;
			}
			this.isMobile = isMoble;
			const backgroundStore = useBackgroundStore();
			backgroundStore.updateBodyBg();
		}
	}
});
