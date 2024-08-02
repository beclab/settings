<template>
	<adaptive-layout>
		<template v-slot:pc>
			<layout-pc />
		</template>
		<template v-slot:mobile>
			<layout-mobile />
		</template>
	</adaptive-layout>
</template>

<script lang="ts" setup>
import LayoutPc from './LayoutPc.vue';
import LayoutMobile from './LayoutMobile.vue';
import AdaptiveLayout from '../components/AdaptiveLayout.vue';
import '../css/common.scss';
import { useDeviceStore } from '../stores/device';
import { useRoute, useRouter } from 'vue-router';
const deviceStore = useDeviceStore();
const router = useRouter();
const route = useRoute();

if (route.fullPath.startsWith('/video') && route.fullPath.length > 6) {
	router.replace('/video');
}

window.addEventListener('resize', function () {
	const isMoble = window.innerWidth < 768;
	if (!deviceStore.isMobile && isMoble) {
		router.replace('/');
	}
	deviceStore.updateIsMobile(isMoble);
});
</script>
