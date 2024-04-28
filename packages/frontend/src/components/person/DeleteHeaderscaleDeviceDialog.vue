<template>
	<q-dialog ref="dialogRef">
		<bt-dialog
			:title="t('delete_device')"
			@onCancel="onDialogCancel"
			@onConfirm="onDialogOK({})"
		>
			<q-label class="q-pt-sm"
				>{{ t('delete_device') }} {{ deviceName }}</q-label
			>
		</bt-dialog>
	</q-dialog>
</template>

<script lang="ts" setup>
import { useDialogPluginComponent } from 'quasar';
import BtDialog from '../base/BtDialog.vue';
import { useI18n } from 'vue-i18n';

defineProps({
	deviceName: {
		type: String,
		required: true
	}
});

const { dialogRef, onDialogCancel, onDialogOK } = useDialogPluginComponent();
const { t } = useI18n();
</script>
