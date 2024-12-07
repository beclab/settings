<template>
	<bt-theme />
	<router-view />
</template>
<script>
import { defineComponent, onMounted } from 'vue';
import { useUserStore } from 'stores/user';
import axios from 'axios';
import { supportLanguages } from './i18n';
import { i18n } from 'src/boot/i18n';

export default defineComponent({
	name: 'App',
	async preFetch() {
		const userStore = useUserStore();
		if (process.env.ACTION === 'PREVIEW') {
			return await axios
				.get(window.location.origin + '/api/profile/init')
				.then((response) => {
					console.log(response.data.data);
					userStore.setUser(response.data.data.profile);
					userStore.setInfo(response.data.data.info);

					const profileName = userStore.user?.terminusName;
					let title = '';
					if (profileName) {
						title = profileName;
					} else {
						title = userStore.info.terminusName;
					}
					document.title = title;
				});
		}
	},
	setup() {
		const userStore = useUserStore();
		let terminusLanguage = '';
		let terminusLanguageInfo = document.querySelector(
			'meta[name="terminus-language"]'
		);
		if (terminusLanguageInfo && terminusLanguageInfo.content) {
			terminusLanguage = terminusLanguageInfo.content;
		} else {
			terminusLanguage = navigator.language;
		}

		console.log(navigator.language);

		if (terminusLanguage) {
			if (supportLanguages.find((e) => e.value === terminusLanguage)) {
				i18n.global.locale.value = terminusLanguage;
			}
		}
		onMounted(async () => {
			if (process.env.ACTION === 'EDITOR') {
				axios
					.get(window.location.origin + '/api/profile/init')
					.then((response) => {
						userStore.setUser(response.data.data.profile);
						userStore.setInfo(response.data.data.info);
						userStore.getNftAddress();
					});
			}

			const updateLayout = () => {
				userStore.isMobile = window.innerWidth < 768;
			};

			window.addEventListener('resize', updateLayout);
		});
	}
});
</script>
