<template>
	<div class="form-item-root column justify-start">
		<q-item :clickable="chevronRight" class="form-item">
			<q-item-section
				class="form-item-title"
				:class="
					deviceStore.isMobile ? 'text-subtitle3-m' : 'text-body2'
				"
				v-if="title"
			>
				{{ title }}
			</q-item-section>
			<q-item-section
				v-else
				class="form-item-title"
				:class="
					deviceStore.isMobile ? 'text-subtitle3-m' : 'text-body2'
				"
			>
				<slot name="title" />
			</q-item-section>
			<q-item-section side>
				<div
					class="form-item-data"
					v-if="data"
					:class="
						deviceStore.isMobile ? 'text-body3-m' : 'text-body2'
					"
				>
					{{ data }}
				</div>
				<q-icon
					v-else-if="chevronRight"
					name="sym_r_chevron_right"
					size="20px"
				/>
				<slot v-else />
			</q-item-section>
		</q-item>
		<bt-separator v-if="widthSeparator" />
	</div>
</template>

<script lang="ts" setup>
import { useDeviceStore } from '../../stores/device';
import BtSeparator from '../base/BtSeparator.vue';

defineProps({
	title: {
		type: String,
		required: false,
		default: ''
	},
	data: {
		type: String,
		require: false
	},
	chevronRight: {
		type: Boolean,
		default: false
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
const deviceStore = useDeviceStore();
</script>

<style scoped lang="scss">
.form-item-root {
	width: 100%;
	height: auto;

	.form-item {
		height: 56px;
		min-height: 56px;
		padding: 0;

		.form-item-title {
			color: $ink-1;
		}

		.form-item-data {
			text-align: right;
			color: $ink-2;
		}
	}
}
</style>
