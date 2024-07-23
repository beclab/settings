<template>
	<div class="func-btn-bg row items-center justify-end clickable-view">
		<div class="func-btn" @click="funcOnClick">
			<div class="text-body3 title row items-center">
				{{ title }}
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
defineProps({
	title: {
		type: String,
		required: false,
		default: ''
	}
});

const emit = defineEmits(['funcClick']);

const funcOnClick = () => {
	emit('funcClick');
};
</script>

<style scoped lang="scss">
.func-btn-bg {
	.func-btn {
		height: 32px;
		border-radius: 8px;
		border: 1px solid $btn-stroke;
		width: auto;
		padding: 4px 12px;

		.title {
			height: 100%;
			text-align: center;
			color: $ink-2;
		}
	}

	.func-btn:hover {
		background-color: $btn-stroke;
	}
}
</style>
