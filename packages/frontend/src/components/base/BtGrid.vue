<template>
	<div
		class="bt-grid-root"
		:class="deviceStore.isMobile ? '' : 'bt-grid-border'"
		:style="{
			'--padding-y': paddingY + 'px'
		}"
	>
		<slot name="title" />
		<bt-separator />
		<div
			class="row bt-grid-grid"
			:class="deviceStore.isMobile ? 'q-mt-lg' : 'q-mt-md'"
			:style="{
				'--repeat_count': repeatCount
			}"
		>
			<slot name="grid" />
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useDeviceStore } from '../../stores/device';
import BtSeparator from '../base/BtSeparator.vue';

defineProps({
	repeatCount: {
		type: Number,
		required: false,
		default: 3
	},
	paddingY: {
		typpe: Number,
		required: false,
		default: 16
	}
});
const deviceStore = useDeviceStore();
</script>

<style scoped lang="scss">
.bt-grid-root {
	width: 100%;
	height: auto;
	border-radius: 12px;
	margin-top: 12px;
	padding: var(--padding-y) 20px;

	.bt-grid-grid {
		width: 100%;
		display: grid;
		grid-column-gap: 12px;
		grid-row-gap: 20px;
		grid-template-columns: repeat(var(--repeat_count), minmax(0, 1fr));
	}
}

.bt-grid-border {
	border: 1px solid $separator;
}
</style>
