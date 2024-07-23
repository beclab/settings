<template>
	<AdaptiveLayout>
		<template v-slot:pc>
			<div class="dialog-common">
				<div class="row justify-between items-center q-pl-md">
					<span class="text-ink-1 text-subtitle3 title">
						{{ title }}</span
					>
					<q-btn flat @click="close" style="">
						<q-icon name="close" size="16px" />
					</q-btn>
				</div>
			</div>
		</template>
		<template v-slot:mobile>
			<div
				class="dialog-common-mobile row items-end justify-center text-subtitle2-m text-ink-1"
			>
				{{ title }}
			</div>
		</template>
	</AdaptiveLayout>
</template>

<script setup lang="ts">
import AdaptiveLayout from './AdaptiveLayout.vue';
defineProps({
	title: {
		type: String,
		required: false,
		default: ''
	}
});
const close = () => {
	emit('closeAction');
};

const emit = defineEmits(['closeAction']);
</script>

<style scoped lang="scss">
.dialog-common {
	width: 100%;
	padding: 0;
	background-color: $background-3;

	.title {
		height: 100%;
	}
}

.dialog-common-mobile {
	height: 44px;
}
</style>
