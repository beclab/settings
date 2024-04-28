<template>
	<q-dialog ref="dialogRef">
		<bt-dialog
			:title="t('add_secret')"
			:confirm-click-able="canSubmit"
			@onCancel="onDialogCancel"
			@onConfirm="onOKClick"
		>
			<terminus-edit
				:is-error="key === ''"
				:label="t('name')"
				:error-message="t(errors.name_is_required)"
				v-model="key"
			/>

			<terminus-edit
				:is-error="value === ''"
				:label="t('secret')"
				:error-message="t('errors.secret_is_required')"
				v-model="value"
			/>
		</bt-dialog>
	</q-dialog>
</template>

<script lang="ts" setup>
import { useDialogPluginComponent } from 'quasar';
import { computed, ref } from 'vue';
import TerminusEdit from '../../../base/TerminusEdit.vue';
import BtDialog from '../../../base/BtDialog.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const { dialogRef, onDialogCancel, onDialogOK } = useDialogPluginComponent();

const key = ref('');
const value = ref('');

const canSubmit = computed(() => {
	return key.value !== '' && value.value !== '';
});

function onOKClick() {
	onDialogOK({
		key: key.value,
		value: value.value
	});
}
</script>
