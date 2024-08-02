<template>
	<div class="form-item-root column justify-start">
		<q-item
			:clickable="chevronRight || clickable"
			class="form-item"
			:style="{ '--height': `${itemHeight}px` }"
		>
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
		<q-separator class="separator-background" v-if="widthSeparator" />
	</div>
</template>

<script lang="ts" setup>
import { useDeviceStore } from '../../stores/device';

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
	},
	itemHeight: {
		type: Number,
		default: 56
	},
	clickable: {
		type: Boolean,
		default: false,
		required: false
	}
});
const deviceStore = useDeviceStore();
</script>

<style scoped lang="scss">
.form-item-root {
	width: 100%;
	height: auto;
	min-height: 40px;

	.form-item {
		height: var(--height, 32px);
		min-height: var(--height, 32px);
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
