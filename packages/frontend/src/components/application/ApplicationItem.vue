<template>
	<div class="application-item-root column justify-start">
		<q-item clickable class="application-item item">
			<q-item-section class="item-margin-left">
				<div class="row items-center">
					<div style="position: relative">
						<q-img
							class="application-logo"
							no-spinner
							:src="icon"
							style="border-radius: 10px"
						>
						</q-img>

						<ApplicationMobileStatus
							v-if="!hideStatus && deviceStore.isMobile"
							:running="status == 'running'"
						/>
						<slot name="mobile-status" />
					</div>
					<div
						class="application-name"
						:class="{
							'text-body2': !deviceStore.isMobile,
							'text-subtitle3-m': deviceStore.isMobile
						}"
					>
						{{ title }}
					</div>

					<slot name="status" />
				</div>
			</q-item-section>
			<q-item-section side class="item-margin-right">
				<div
					class="row justify-end items-center"
					v-if="adminStore.isAdmin || !isDemo"
				>
					<ApplicationStatus
						v-if="!hideStatus && !deviceStore.isMobile"
						:realStatus="realStatus"
						:running="status == 'running'"
					/>
					<q-icon
						name="sym_r_chevron_right"
						color="ink-1"
						size="20px"
					/>
				</div>
			</q-item-section>
		</q-item>
		<bt-separator v-if="widthSeparator" :offset="20" />
	</div>
</template>

<script lang="ts" setup>
import { watch, ref, computed } from 'vue';
import { APP_STATUS, getApplicationStatus } from '../../utils/constants';
import BtSeparator from '../base/BtSeparator.vue';
import ApplicationStatus from './ApplicationStatus.vue';
import ApplicationMobileStatus from './ApplicationMobileStatus.vue';
import { useDeviceStore } from '../../stores/device';
import { useAdminStore } from '../../stores/admin';

const adminStore = useAdminStore();
const isDemo = computed(() => {
	return !!process.env.DEMO;
});

const props = defineProps({
	icon: {
		type: String,
		require: true
	},
	title: {
		type: String,
		require: true
	},
	hideStatus: {
		type: Boolean,
		default: true
	},
	status: {
		type: String,
		default: ''
	},
	widthSeparator: {
		type: Boolean,
		default: true
	},
	marginTop: {
		type: Boolean,
		default: true
	}
});

watch(
	() => props.status,
	() => {
		realStatus.value = getApplicationStatus(props.status as APP_STATUS);
	}
);

const realStatus = ref(getApplicationStatus(props.status as APP_STATUS));
const deviceStore = useDeviceStore();
</script>

<style scoped lang="scss">
.application-item-root {
	width: 100%;
	height: auto;

	.application-item {
		height: 56px;
		min-height: 56px;
		padding: 0;

		.application-logo {
			width: 32px;
			height: 32px;
			border-radius: 8px;
		}
		.status-icon {
			position: absolute;
			right: 0px;
			bottom: 0px;
			width: 8px;
			height: 8px;
			// padding: 2px;
			border-radius: 4px;
			background-color: $background-1;

			.status-content {
				width: 6px;
				height: 6px;
				border-radius: 3px;
			}
		}

		.application-name {
			color: $ink-1;
			margin-left: 8px;
		}

		.status-circle {
			width: 12px;
			height: 12px;
			margin-right: 12px;
			border-radius: 50%;
			background-color: var(--status-color);
		}

		.application-status {
			text-align: right;
			color: $ink-2;
			text-transform: capitalize;
			margin-right: 4px;
		}
	}
}
</style>
