<template>
	<!-- <div class="column"> -->
	<page-title-component :show-back="true" title="Device of Vault Truste" />
	<bt-scroll-area class="nav-height-scroll-area-conf">
		<template v-for="(device, index) in devices" :key="'device' + index">
			<trust-device-item :device="device" />
		</template>
	</bt-scroll-area>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useAdminStore } from 'src/stores/Admin';
import PageTitleComponent from 'components/PageTitleComponent.vue';
import TrustDeviceItem from 'components/person/TrustDeviceItem.vue';

const adminStore = useAdminStore();

const devices = ref([]);
onMounted(async () => {
	devices.value = await adminStore.get_vault_devices();
});
</script>
