<template>
	<div class="dialog-common bg-grey-1">
		<div class="row justify-between items-center q-pl-md">
			<span class="text-text1 text-subtitle3 title"> {{ title }}</span>
			<q-btn flat @click="close" style="">
				<q-icon name="close" size="16px" />
			</q-btn>
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

const close = () => {
	emit('closeAction');
};

const emit = defineEmits(['closeAction']);
</script>

<style scoped lang="scss">
.dialog-common {
	width: 100%;
	padding: 0;

	.title {
		height: 100%;
	}
}
</style>
