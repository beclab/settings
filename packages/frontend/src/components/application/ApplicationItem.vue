<template>
	<div class="application-item-root column justify-start">
		<q-item clickable class="application-item">
			<q-item-section>
				<div class="row items-center">
					<q-img
						class="application-logo"
						no-spinner
						:src="icon"
						style="border-radius: 10px"
					/>
					<div class="text-body2 application-name">
						{{ title }}
					</div>
				</div>
			</q-item-section>
			<q-item-section side>
				<div class="row justify-end items-center">
					<div
						v-if="!hideStatus"
						class="status-circle"
						:style="{
							'--status-color':
								status == 'running' ? '#29CC5F' : '#FEBE01'
						}"
					></div>
					<div
						v-if="!hideStatus"
						class="text-subtitle3 application-status"
					>
						{{ realStatus }}
					</div>
					<q-icon
						name="sym_r_chevron_right"
						color="ink-1"
						size="20px"
					/>
				</div>
			</q-item-section>
		</q-item>
		<bt-separator v-if="widthSeparator" />
	</div>
</template>

<script lang="ts" setup>
import { watch, ref } from 'vue';
import { APP_STATUS, getApplicationStatus } from '../../utils/constants';
import BtSeparator from '../base/BtSeparator.vue';
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
