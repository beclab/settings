<template>
	<div class="row items-center">
		<div
			class="status-circle"
			:class="{
				'bg-green-default': running,
				'bg-red-default': !running
			}"
		></div>
		<div class="text-body2 application-status">
			{{ realStatus }}
		</div>
	</div>
</template>

<script setup lang="ts">
defineProps({
	running: {
		type: Boolean,
		required: false,
		default: false
	},

	realStatus: {
		type: String,
		required: false,
		default: ''
	}
});
</script>

<style scoped lang="scss">
.application-status {
	text-align: right;
	color: $ink-2;
	text-transform: capitalize;
	margin-right: 4px;
}
.status-circle {
	width: 12px;
	height: 12px;
	margin-right: 6px;
	border-radius: 50%;
}
</style>
