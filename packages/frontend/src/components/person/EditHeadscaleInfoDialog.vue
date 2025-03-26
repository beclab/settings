<template>
	<bt-custom-dialog
		ref="CustomRef"
		:title="title"
		:skip="false"
		:ok="t('confirm')"
		size="medium"
		:cancel="t('cancel')"
		:platform="deviceStore.platform"
		@onSubmit="onOKClick"
	>
		<terminus-edit :label="editTitle" v-model="data" />
	</bt-custom-dialog>
</template>

<script lang="ts" setup>
import { defineProps, ref } from 'vue';
import TerminusEdit from '../base/TerminusEdit.vue';
import { useI18n } from 'vue-i18n';
import { useDeviceStore } from '../../stores/device';

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

const { t } = useI18n();
const deviceStore = useDeviceStore();
const CustomRef = ref();
function onOKClick() {
	CustomRef.value.onDialogOK(data.value);
}
</script>
