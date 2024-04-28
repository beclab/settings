<template>
	<div class="page-title-root row justify-between items-center">
		<div class="row items-center" style="height: 100%">
			<div
				v-if="showBack"
				class="back-btn row items-center justify-center"
				@click="backToPrePage"
			>
				<q-icon name="bi-chevron-left" size="16px" />
			</div>
			<div class="text-h5 text-text1">
				{{ title }}
			</div>
		</div>

		<slot name="end" />
	</div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const props = withDefaults(
	defineProps<{
		title: string;
		showBack: boolean;
		customBack: boolean;
	}>(),
	{
		title: '',
		showBack: false,
		customBack: false
	}
);

const emit = defineEmits(['onBackClick']);
const router = useRouter();

const backToPrePage = () => {
	if (props.customBack) {
		emit('onBackClick');
	} else {
		router.back();
	}
};
</script>

<style scoped lang="scss">
.page-title-root {
	height: 56px;
	padding-left: 16px;
	padding-right: 16px;
	width: 100%;

	.back-btn {
		width: 32px;
		height: 32px;
		border-radius: 8px;
		margin-right: 2px;

		&:hover {
			background-color: $grey-1;
		}
	}
}
</style>
