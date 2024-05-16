<template>
	<div class="row justify-end q-mt-md q-pb-lg confirm-bg">
		<q-btn
			v-if="hasCancel"
			dense
			flat
			class="cancle-btn q-px-md"
			:label="cancelText"
			@click="cancelAction"
		/>
		<q-btn
			dense
			flat
			:class="isReminder ? 'reminder-btn q-px-md' : 'confirm-btn q-px-md'"
			style="height: 24px; margin-top: 20px"
			:label="confirmText"
			@click="confirmAction"
			:disable="confirmDisable"
		/>
	</div>
</template>

<script lang="ts" setup>
import { i18n } from 'src/boot/i18n';
withDefaults(
	defineProps<{
		cancelText: string;
		confirmText: string;
		confirmDisable: boolean;
		hasCancel: boolean;
		isReminder: boolean;
	}>(),
	{
		cancelText: i18n.global.t('cancel'),
		confirmText: i18n.global.t('ok'),
		confirmDisable: false,
		hasCancel: true,
		isReminder: false
	}
);

const cancelAction = () => {
	emit('cancelAction');
};
const confirmAction = () => {
	emit('confirmAction');
};

const emit = defineEmits(['cancelAction', 'confirmAction']);
</script>

<style scoped lang="scss">
.confirm-bg {
	margin-top: 16px;

	.confirm-btn {
		height: 24px;
		background: $blue;
		border-radius: 4px;
		width: auto;
	}

	.cancle-btn {
		height: 24px;
		margin-top: 20px;
		margin-right: 8px;
	}

	.confirm-btn:hover {
		background-color: $blue-8;
	}

	.reminder-btn:hover {
		background-color: $red-8;
	}
}
</style>
