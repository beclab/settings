<template>
	<router-view />
</template>

<script>
import { defineComponent, onMounted } from 'vue';
import { useApplicationStore } from './stores/Application';
import { useAdminStore } from './stores/Admin';
import { useTokenStore } from './stores/token';
import { useHeadScaleStore } from './stores/headscale';
import { useAccountStore } from './stores/Account';
import { useBackgroundStore } from './stores/Background';
import { useDIDStore } from './stores/did';
import axios from 'axios';
import { WebPlatform } from './utils/platform';
import { supportLanguages } from './i18n/index';

const platform = new WebPlatform();

export default defineComponent({
	name: 'App',
	preFetch() {
		const tokenStore = useTokenStore();
		const applicationStore = useApplicationStore();

		const host = window.location.origin;
		tokenStore.setUrl(host);

		const adminStore = useAdminStore();
		const accountStore = useAccountStore();
		const backgroundStore = useBackgroundStore();
		backgroundStore.init();

		let terminusLanguage = '';
		let terminusLanguageInfo = document.querySelector(
			'meta[name="terminus-language"]'
		);
		if (terminusLanguageInfo && terminusLanguageInfo.content) {
			terminusLanguage = terminusLanguageInfo.content;
		} else {
			terminusLanguage = navigator.language || navigator.userLanguage;
		}

		if (terminusLanguage) {
			if (supportLanguages.find((e) => e.value == terminusLanguage)) {
				backgroundStore.updateLanguageLocale(terminusLanguage);
			}
		}

		return new Promise((resolve) => {
			axios.get(tokenStore.url + '/api/init').then((data) => {
				adminStore.terminus = data.terminusInfo;
				adminStore.user = data.userInfo;
				applicationStore.applications = data.applicationData;
				accountStore.secrets = data.secrets;
				adminStore.devices = data.devices;
				backgroundStore.wallpaper = data.wallpaper;
				resolve({});
			});
		});
	},
	setup() {
		const adminStore = useAdminStore();
		const tokenStore = useTokenStore();
		const headScaleStore = useHeadScaleStore();
		const didStore = useDIDStore();

		didStore.setDIDUrl('https://did-gate-v3.bttcdn.com/');
		const host = window.location.origin;
		tokenStore.setUrl(host);
		headScaleStore.setUrl(host + '/headscale');

		onMounted(() => {
			platform.getDeviceInfo().then((deviceInfo) => {
				adminStore.thisDevice = deviceInfo;
			});
		});
		return {};
	}
});
</script>
