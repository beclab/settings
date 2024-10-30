<template>
	<q-dialog ref="dialogRef">
		<div class="common-dialog" style="border-radius: 16px">
			<DialogHeader
				:title="title"
				@close-action="onDialogCancel"
			></DialogHeader>
			<div class="dialog-content-root">
				<div
					class="row items-center justify-between"
					v-if="message.length > 0"
				>
					<div
						class="text-ink-2"
						:class="{
							'message-content': hasBorder,
							'text-body3': !deviceStore.isMobile,
							'text-body3-m': deviceStore.isMobile
						}"
						v-html="message"
						:style="
							deviceStore.isMobile ? 'text-align: center' : ''
						"
					/>
				</div>

				<dialog-footer
					:confirm-text="confirmText"
					:cancel-Text="cancelText"
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
import { useDeviceStore } from '../stores/device';

defineProps({
	title: {
		type: String,
		required: false,
		default: ''
	},
	message: {
		type: String,
		required: false,
		default: ''
	},
	useCancel: {
		type: Boolean,
		required: false,
		default: true
	},
	confirmText: {
		type: String,
		required: false,
		default: i18n.global.t('ok')
	},
	cancelText: {
		type: String,
		required: false,
		default: i18n.global.t('cancel')
	},
	hasBorder: {
		type: Boolean,
		required: false,
		default: false
	},
	isReminder: {
		type: Boolean,
		required: false,
		default: false
	}
});

const sureAction = () => {
	onDialogOK();
	dialogRef.value?.hide();
};

const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const deviceStore = useDeviceStore();
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
	border: 1px solid $separator;
	padding: 8px 12px;
	border-radius: 8px;
}
</style>
