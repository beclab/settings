<template>
	<q-dialog ref="dialogRef">
		<bt-dialog
			:title="t('update_secret')"
			:confirm-click-able="value !== ''"
			@onCancel="onDialogCancel"
			@onConfirm="onOKClick"
		>
			<terminus-edit
				:is-error="value === ''"
				label="Secret"
				:error-message="t('errors.secret_is_required')"
				v-model="value"
			/>
		</bt-dialog>
	</q-dialog>
</template>

<script lang="ts" setup>
import { useDialogPluginComponent } from 'quasar';
import { ref } from 'vue';
import TerminusEdit from '../../../base/TerminusEdit.vue';
import BtDialog from '../../../base/BtDialog.vue';
import { useI18n } from 'vue-i18n';
const { dialogRef, onDialogCancel, onDialogOK } = useDialogPluginComponent();

const value = ref('');

function onOKClick() {
	onDialogOK({
		value: value.value
	});
}

const { t } = useI18n();
</script>
<style lang="scss"></style>
