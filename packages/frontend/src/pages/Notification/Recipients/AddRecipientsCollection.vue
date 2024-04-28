<template>
	<q-dialog ref="dialogRef" @hide="onDialogHide">
		<q-card class="q-dialog-plugin q-pa-lg" style="min-height: 200px">
			<q-select
				:label="t('template')"
				class="q-py-sm"
				v-model="templateId"
				:options="recipientTemplates"
				:option-value="
					(opt) =>
						Object(opt) === opt && 'name' in opt ? opt.name : null
				"
				:option-label="
					(opt) =>
						Object(opt) === opt && 'name' in opt
							? opt.name
							: '- Null -'
				"
				emit-value
				map-options
			/>
			<q-input class="q-pt-sm" filled v-model="name" :label="t('name')" />

			<q-card-actions align="right" class="q-pt-md">
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
import { useNotificationStore } from '../../../stores/Notification';
import { useDialogPluginComponent, Loading } from 'quasar';
import { ref } from 'vue';
import { recipientTemplates } from '../../../utils/notification';
import { useI18n } from 'vue-i18n';

defineProps({
	recipients: {
		type: String,
		required: true
	}
});

defineEmits([...useDialogPluginComponent.emits]);

const { t } = useI18n();

const applicationStore = useNotificationStore();

const name = ref('');
const templateId = ref(recipientTemplates[0].name);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
	useDialogPluginComponent();
async function onOKClick() {
	Loading.show();

	const template = recipientTemplates.find((f) => f.name == templateId.value);
	try {
		await applicationStore.createRecipients({
			name: name.value,
			type: template.type,
			isEditable: true,
			status: 'Active',
			user: ''
		});
		Loading.hide();
		onDialogOK({});
	} catch (e) {
		console.log(e);
		Loading.hide();
	}
}
</script>
