<template>
	<q-dialog ref="dialogRef">
		<bt-dialog
			:title="isParty ? t('third_party_domain') : t('third_level_domain')"
			@onCancel="onDialogCancel"
			@onConfirm="onDialogOK(data)"
		>
			<terminus-edit
				:label="
					isParty ? t('third_party_domain') : t('third_level_domain')
				"
				v-model="data"
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

defineProps({
	isParty: {
		type: Boolean,
		require: true
	}
});

const { dialogRef, onDialogCancel, onDialogOK } = useDialogPluginComponent();
const data = ref('');
const { t } = useI18n();
</script>
