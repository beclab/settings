<template>
	<adaptive-layout auto>
		<template v-slot:mobile>
			<div
				class="mobile-status-circle row items-center justify-center"
				:style="{
					'--top': size - 6 + 'px',
					'--left': size - 6 + 'px'
				}"
			>
				<div class="mobile-status-content" :class="backgroundClass" />
			</div>
		</template>
		<template v-slot:pc>
			<div class="row items-center">
				<div class="pc-status-circle" :class="backgroundClass" />
				<div class="text-body2 pc-application-status">
					{{ appStatusText }}
				</div>
			</div>
		</template>
	</adaptive-layout>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
	APP_STATUS,
	ENTRANCE_STATUS,
	getApplicationStatus,
	getEntranceStatus
} from '../../utils/constants';
import AdaptiveLayout from '../AdaptiveLayout.vue';

const props = defineProps({
	status: {
		type: String,
		required: true,
		default: ''
	},
	text: {
		type: String,
		required: false,
		default: ''
	},
	size: {
		type: Number,
		required: false,
		default: 32
	}
});

const backgroundClass = computed(() => {
	switch (props.status) {
		case APP_STATUS.installed:
		case APP_STATUS.running:
		case ENTRANCE_STATUS.running:
			return 'bg-green-default';
		case APP_STATUS.preflightFailed:
		case APP_STATUS.uninstalling:
		case APP_STATUS.uninstalled:
		case APP_STATUS.suspend:
		case APP_STATUS.installable:
		case ENTRANCE_STATUS.crash:
		case ENTRANCE_STATUS.suspend:
			return 'bg-red-default';
		case APP_STATUS.pending:
		case APP_STATUS.installing:
		case APP_STATUS.downloading:
		case APP_STATUS.initializing:
		case APP_STATUS.resuming:
		case APP_STATUS.waiting:
		case APP_STATUS.upgrading:
			return 'bg-yellow-default';
		default:
			return 'bg-red-default';
	}
});

const appStatusText = computed(() => {
	if (props.text) {
		return props.text;
	}
	let status = getApplicationStatus(props.status as APP_STATUS);
	if (!status) {
		status = getEntranceStatus(props.status as ENTRANCE_STATUS);
	}
	return status;
});
</script>

<style scoped lang="scss">
.pc-status-circle {
	width: 12px;
	height: 12px;
	margin-right: 6px;
	border-radius: 50%;
}
.pc-application-status {
	text-align: right;
	color: $ink-2;
	text-transform: capitalize;
	margin-right: 4px;
}

.mobile-status-circle {
	position: absolute;
	left: var(--left);
	top: var(--top);
	width: 8px;
	height: 8px;
	// padding: 2px;
	border-radius: 4px;
	background-color: $background-1;

	.mobile-status-content {
		width: 6px;
		height: 6px;
		border-radius: 3px;
	}
}
</style>
