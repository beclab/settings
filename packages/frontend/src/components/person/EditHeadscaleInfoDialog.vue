<template>
	<q-dialog ref="dialogRef">
		<bt-dialog
			:title="title"
			@onCancel="onDialogCancel"
			@onConfirm="onDialogOK(data)"
		>
			<terminus-edit :label="editTitle" v-model="data" />
		</bt-dialog>
	</q-dialog>
</template>

<script lang="ts" setup>
import { useDialogPluginComponent } from 'quasar';
import { defineProps, ref } from 'vue';
import TerminusEdit from '../base/TerminusEdit.vue';
import BtDialog from '../base/BtDialog.vue';

const { dialogRef, onDialogCancel, onDialogOK } = useDialogPluginComponent();

const props = defineProps({
	oldValue: {
		type: String,
		required: false,
		default: ''
	},
	title: {
		type: String,
		required: false,
		default: ''
	},
	editTitle: {
		type: String,
		required: false,
		default: ''
	}
});

const data = ref(props.oldValue);
</script>
