<template>
	<page-title-component
		:show-back="true"
		:title="t('headScale_connection_status')"
	/>

	<bt-scroll-area class="nav-height-scroll-area-conf">
		<div
			:class="
				deviceStore.isMobile
					? 'mobile-items-list q-mt-md'
					: 'q-list-class'
			"
			style="padding: 0"
			v-for="device in headScaleStore.devices"
			:key="device.id"
		>
			<DeviceCard :device="device" />
		</div>
	</bt-scroll-area>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useUserStore } from 'src/stores/User';
import { useHeadScaleStore } from 'src/stores/headscale';
import DeviceCard from './DeviceCard.vue';
import PageTitleComponent from 'components/PageTitleComponent.vue';
import { useI18n } from 'vue-i18n';
import { useDeviceStore } from '../../stores/device';

const accountStore = useUserStore();
const headScaleStore = useHeadScaleStore();
const deviceStore = useDeviceStore();
const { t } = useI18n();

onMounted(async () => {
	try {
		await headScaleStore.getDevices();
		await headScaleStore.getHeadScaleStatus();
	} catch (e) {
		console.log(e);
	}
	accountStore.get_accounts();
});
</script>

<style scoped lang="scss">
.personal-page-root {
	height: 100%;
}
</style>
