<template>
	<q-dialog ref="dialogRef" @hide="onDialogHide">
		<q-card class="q-dialog-plugin" style="min-height: 200px">
			<q-input v-model="path" :label="t('please_input_path')" />

			<q-card-actions align="right" class="q-pa-lg">
				<q-btn color="primary" :label="t('ok')" @click="onOKClick" />
				<q-btn
					color="primary"
					:label="t('cancel')"
					@click="onDialogCancel"
				/>
			</q-card-actions>
		</q-card>
	</q-dialog>
</template>

<script setup>
import { useDialogPluginComponent } from 'quasar';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

defineEmits([...useDialogPluginComponent.emits]);

const path = ref('');

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
	useDialogPluginComponent();

function onOKClick() {
	onDialogOK({ path: path.value });
}
</script>
