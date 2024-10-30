<template>
	<AdaptiveLayout>
		<template v-slot:pc>
			<bt-grid>
				<template v-slot:title>
					<div
						class="device-item-title row justify-between items-center"
					>
						<div class="row justify-start items-center">
							<q-img
								class="device-title-image"
								no-spinner
								:src="`devices/${getIconName()}.png`"
							/>
							<div class="text-subtitle1 title-left-label">
								{{ device?.description }}
							</div>
							<div
								v-if="device?.tailScale_id"
								class="text-overline title-left-vpn row items-center"
							>
								<q-img
									class="title-vpn-image"
									src="vpn_lock.svg"
								/>
								<div class="title-vpn-label">
									{{ t('vpn') }}
								</div>
							</div>
						</div>
						<div
							v-if="isMe"
							class="local-machine text-caption text-ink-2"
						>
							{{ t('local_machine') }}
						</div>
					</div>
				</template>
				<template v-slot:grid>
					<bt-grid-item
						:label="t('software_type')"
						:value="
							device?.client_type
								? device?.client_type.charAt(0).toUpperCase() +
								  device?.client_type.slice(1)
								: ''
						"
					/>
					<bt-grid-item
						:label="t('last_active_time')"
						:value="
							device
								? formattedDate(device.lastSeenTime * 1000)
								: ''
						"
					/>
					<bt-grid-item
						:label="t('location')"
						:value="device?.lastIpLocation || device?.lastIp"
					/>
				</template>
			</bt-grid>
		</template>
		<template v-slot:mobile>
			<q-item class="mobile-device-item item-padding-x">
				<q-item-section
					avatar
					class="q-pr-none"
					style="min-width: 40px"
				>
					<q-img
						class="device-mobile-image"
						:src="`devices/${getIconName()}.png`"
					/>
				</q-item-section>

				<q-item-section
					class="text-subtitle3-m text-ink-1"
					style="margin-left: 8px"
				>
					<q-item-label>
						<div class="row items-center">
							<div>
								{{ device?.description }}
							</div>
							<div
								v-if="device?.tailScale_id"
								class="text-overline title-left-vpn row items-center"
							>
								<q-img
									class="title-vpn-image"
									src="vpn_lock.svg"
								/>
								<div class="title-vpn-label">
									{{ t('vpn') }}
								</div>
							</div>
						</div>
					</q-item-label>
					<q-item-label class="text-overline-m text-ink-3">
						<div v-html="formatMobileDetail()"></div>
					</q-item-label>
				</q-item-section>
				<q-item-section side v-if="isMe">
					<q-icon name="sym_r_devices" size="24px" color="ink-3" />
				</q-item-section>
			</q-item>
			<bt-separator v-if="!isLatest" />
		</template>
	</AdaptiveLayout>
</template>

<script lang="ts" setup>
import { PropType, computed } from 'vue';
import { TermiPassDeviceInfo } from '@bytetrade/core';
import BtGrid from '../base/BtGrid.vue';
import BtGridItem from '../base/BtGridItem.vue';
import { date } from 'quasar';
import { useAdminStore } from '../../stores/Admin';
import { useI18n } from 'vue-i18n';
import AdaptiveLayout from '../AdaptiveLayout.vue';
import BtSeparator from '../base/BtSeparator.vue';

const { t } = useI18n();

const adminStore = useAdminStore();

const props = defineProps({
	device: {
		type: Object as PropType<TermiPassDeviceInfo>
	},
	isLatest: {
		type: Boolean,
		default: false,
		required: false
	}
});

const formattedDate = (
	datetime: string | number,
	format = 'YYYY-MM-DD HH:mm:ss'
) => {
	const originalDate = new Date(datetime);
	return date.formatDate(originalDate, format);
};

const formatMobileDetail = () => {
	const formatDat = props.device
		? formattedDate(props.device.lastSeenTime * 1000, 'MM-DD HH:mm:ss')
		: '';
	const location = props.device?.lastIpLocation || props.device?.lastIp || '';
	return [formatDat, location].filter((e) => e.length > 0).join('&emsp;');
};

const getIconName = () => {
	if (props.device) {
		switch (props.device.platform) {
			case 'android':
			case 'Android':
				switch (props.device.manufacturer) {
					case 'Xiaomi':
						return 'xiaomi';
					case 'HUAWEI':
						return 'huawei';
					case 'Honor':
						return 'honor';
					case 'Oppo':
						return 'oppo';
					case 'Vivo':
						return 'vivo';
					case 'Samsung':
						return 'samsung';
					case 'Google':
						return 'google';
					default:
						return 'android';
				}
			case 'ios':
			case 'iOS':
				return 'iPhone';
			case 'chrome extends':
				return 'chrome';
			case 'MacOS':
				return 'mac';
			case 'Windows':
				return 'windows';
		}
	}
};

const isMe = computed(() => {
	return (
		adminStore.thisDevice &&
		adminStore.thisDevice.platform == props.device?.platform &&
		adminStore.thisDevice.manufacturer == props.device.manufacturer &&
		adminStore.thisDevice.client_type == props.device.client_type &&
		adminStore.thisDevice.description == props.device.description
	);
});
</script>

<style scoped lang="scss">
.device-item-title {
	margin-bottom: 12px;

	.device-title-image {
		height: 32px;
		width: 32px;
	}

	.local-machine {
		border: 1px solid $separator;
		padding: 4px 8px;
		border-radius: 4px;
	}

	.title-left-label {
		margin-left: 8px;
		color: $ink-1;
	}
}

.mobile-device-item {
	height: 64px;
	.device-mobile-image {
		height: 40px;
	}
}

.title-left-vpn {
	margin-left: 6px;
	border-radius: 12px;
	border: 1px solid $separator;
	padding: 4px 8px;

	.title-vpn-image {
		height: 12px;
		width: 12px;
	}

	.title-vpn-label {
		margin-left: 4px;
		color: $ink-1;
	}
}
</style>
