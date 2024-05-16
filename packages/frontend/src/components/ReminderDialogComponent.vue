<template>
	<q-dialog ref="dialogRef">
		<div class="common-dialog" style="border-radius: 16px">
			<DialogHeader
				:title="title"
				@close-action="dialogRef?.hide()"
			></DialogHeader>
			<div class="content-root">
				<div
					class="row items-center justify-between"
					v-if="message.length > 0"
				>
					<div
						class="text-body3 text-grey-8"
						:class="hasBorder ? 'message-content' : ''"
						v-html="message"
					/>
				</div>

				<dialog-footer
					:confirm-text="confirmText"
					:has-cancel="useCancel"
					:is-reminder="isReminder"
					@cancel-action="onDialogCancel"
					@confirm-action="sureAction"
				/>
			</div>
		</div>
	</q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar';
import DialogHeader from './DialogHeader.vue';
import DialogFooter from './DialogFooter.vue';
import { i18n } from '../boot/i18n';

withDefaults(
	defineProps<{
		title: string;
		message: string;
		useCancel: boolean;
		confirmText: string;
		hasBorder: boolean;
		isReminder: boolean;
	}>(),
	{
		title: '',
		message: '',
		useCancel: true,
		confirmText: i18n.global.t('ok'),
		hasBorder: false,
		isReminder: false
	}
);

const sureAction = () => {
	onDialogOK();
	dialogRef.value?.hide();
};

const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent();
</script>

<style scoped lang="scss">
.content-root {
	padding: 16px 16px 0;
}

.userName {
	line-height: 32px;
	height: 32px;
}

.message-content {
	width: 100%;
	border: 1px solid $grey-2;
	padding: 8px 12px;
	border-radius: 8px;
}
</style>
