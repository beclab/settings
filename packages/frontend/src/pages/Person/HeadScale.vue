<template>
	<page-title-component
		:show-back="true"
		:title="t('headScale_connection_status')"
	/>

	<bt-scroll-area class="nav-height-scroll-area-conf">
		<div
			class="q-list-class"
			style="padding: 0"
			v-for="device in headScaleStore.devices"
			:key="device.id"
		>
			<DeviceCard :device="device" />
		</div>
	</bt-scroll-area>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { useAdminStore } from 'src/stores/Admin';
import UpdateUserPassworDialog from '../Account/dialog/UpdateUserPassworDialog.vue';
import { useQuasar } from 'quasar';
import { useUserStore } from 'src/stores/User';
import { useHeadScaleStore } from 'src/stores/headscale';
import DeviceCard from './DeviceCard.vue';
import PageTitleComponent from 'components/PageTitleComponent.vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
	name: 'IndexPage',
	components: {
		PageTitleComponent,
		DeviceCard
	},
	setup() {
		const adminStore = useAdminStore();
		const quasar = useQuasar();
		const accountStore = useUserStore();
		const headScaleStore = useHeadScaleStore();
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

		const updatePassword = async () => {
			quasar.dialog({
				component: UpdateUserPassworDialog,
				componentProps: {
					name: adminStore.user.name
				}
			});
		};

		const toggle = async () => {
			if (!headScaleStore.headScaleStatus) {
				let total = 0;
				for (const device of headScaleStore.devices) {
					if (device.online) {
						total += 1;
					}
				}

				if (total < 3) {
					quasar.notify({
						message: t(
							'you_need_at_least_3_devices_online_to_activate_headScale'
						),
						type: 'negative',
						position: 'bottom',
						timeout: 2000
					});
					return;
				}
			}

			await headScaleStore.toggleHeadScaleStatus();
			await headScaleStore.getHeadScaleStatus();
		};

		return {
			adminStore,
			headScaleStore,
			updatePassword,
			toggle,
			t
		};
	}
});
</script>

<style scoped lang="scss">
.personal-page-root {
	height: 100%;
}
</style>
