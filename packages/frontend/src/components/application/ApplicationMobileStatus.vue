<template>
	<div
		class="status-icon row items-center justify-center"
		:style="{
			'--top': size - 6 + 'px',
			'--left': size - 6 + 'px'
		}"
	>
		<div
			class="status-content"
			:class="{
				'bg-green-default': running,
				'bg-red-default': !running
			}"
		></div>
	</div>
</template>

<script setup lang="ts">
defineProps({
	running: {
		type: Boolean,
		required: false,
		default: false
	},
	size: {
		type: Number,
		required: false,
		default: 32
	}
});
</script>

<style scoped lang="scss">
.status-icon {
	position: absolute;
	left: var(--left);
	top: var(--top);
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
</style>
