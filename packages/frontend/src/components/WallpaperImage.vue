<template>
	<div
		class="background-select-bg column justify-start"
		:style="{
			width: `${width + 2 * padding + 2}px`
		}"
	>
		<div
			:style="{
				'--padding': `${padding}px`,
				'--borderWidth': `${borderWidth}px`,
				'--borderRadius': `${borderRadius}px`
			}"
			:class="
				selected
					? 'background-mode-item-select'
					: 'background-mode-item-normal'
			"
			class="row justify-center item-center"
		>
			<q-img
				:src="src"
				height="auto"
				:width="`${width}px`"
				:fit="imgContentModeRef"
				:noSpinner="true"
				:ratio="deviceStore.isMobile ? 6 / 11 : 16 / 9"
				style="border-radius: 4px"
			/>
		</div>
		<div class="row items-center justify-center">
			<slot name="legend" />
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { imgContentModes } from '../constant';
import { useDeviceStore } from '../stores/device';
const deviceStore = useDeviceStore();

defineProps({
	width: Number,
	src: String,
	padding: {
		type: Number,
		default: 4
	},
	selected: {
		type: Boolean,
		default: false
	},
	borderWidth: {
		type: Number,
		required: false,
		default: 2
	},
	borderRadius: {
		type: Number,
		required: false,
		default: 4
	}
});

const imgContentModeRef = ref(imgContentModes[0]);
</script>

<style scoped lang="scss">
.background-select-bg {
	height: auto;
	cursor: pointer;
	text-decoration: none;

	.background-mode-item-normal {
		border-radius: var(--borderRadius);
		padding: var(--padding);
		border: var(--borderWidth) solid transparent;
	}

	.background-mode-item-select {
		border-radius: var(--borderRadius);
		padding: var(--padding);
		border: var(--borderWidth) solid $blue;
	}
}
</style>
