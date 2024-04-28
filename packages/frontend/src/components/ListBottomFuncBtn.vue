<template>
	<div class="func-btn-bg row items-center justify-end clickable-view">
		<div class="func-btn" @click="funcOnClick">
			<div class="text-body3 title">
				{{ title }}
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
withDefaults(
	defineProps<{
		title: string;
	}>(),
	{
		title: ''
	}
);

const emit = defineEmits(['funcClick']);

const funcOnClick = () => {
	emit('funcClick');
};
</script>

<style scoped lang="scss">
.func-btn-bg {
	.func-btn {
		height: 24px;
		background: #fff;
		border-radius: 8px;
		border: 1px solid $grey-2;
		width: auto;
		padding: 4px 12px;

		.title {
			text-align: center;
			color: $text2;
		}
	}

	.func-btn:hover {
		background-color: $grey-1;
	}
}
</style>
