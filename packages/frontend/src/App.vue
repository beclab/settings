<template>
	<router-view />
</template>

<script>
import { defineComponent, onMounted } from 'vue';
import { useApplicationStore } from './stores/application';
import { useAdminStore } from './stores/admin';
import { useTokenStore } from './stores/token';
import { useHeadScaleStore } from './stores/headscale';
import { useAccountStore } from './stores/account';
import { useBackgroundStore } from './stores/background';
import { useDIDStore } from './stores/did';
import axios from 'axios';
import { WebPlatform } from './utils/platform';
import { supportLanguages, languagesShort } from './i18n/index';
import { useSocketStore } from './stores/websocketStore';
import { useUpgradeStore } from './stores/upgrade';

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
		const didStore = useDIDStore();
		const upgradeStore = useUpgradeStore();

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
			if (languagesShort[terminusLanguage]) {
				backgroundStore.updateLanguageLocale(
					languagesShort[terminusLanguage]
				);
			} else if (
				supportLanguages.find((e) => e.value == terminusLanguage)
			) {
				backgroundStore.updateLanguageLocale(
					languagesShort[terminusLanguage]
				);
			}
		}

		return axios
			.get(tokenStore.url + '/api/init')
			.then((data) => {
				adminStore.terminus = data.terminusInfo;
				adminStore.user = data.userInfo;
				applicationStore.applications = data.applicationData;
				accountStore.secrets = data.secrets;
				adminStore.devices = data.devices;
				backgroundStore.wallpaper = data.wallpaper;
				didStore.setDIDUrl(data.didUrl);
			})
			.then(() => {
				upgradeStore.checkLastOsVersion();
			});
	},
	setup() {
		const adminStore = useAdminStore();
		const tokenStore = useTokenStore();
		const headScaleStore = useHeadScaleStore();

		const host = window.location.origin;
		tokenStore.setUrl(host);
		headScaleStore.setUrl(host + '/headscale');

		onMounted(() => {
			platform.getDeviceInfo().then((deviceInfo) => {
				adminStore.thisDevice = deviceInfo;
			});

			const websocketStore = useSocketStore();
			websocketStore.start();
		});
		return {};
	}
});
</script>
