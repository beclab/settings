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

const deviceStore = useDeviceStore();

window.addEventListener('resize', function () {
	const isMoble = window.innerWidth < 768;
	deviceStore.updateIsMobile(isMoble);
});
</script>
