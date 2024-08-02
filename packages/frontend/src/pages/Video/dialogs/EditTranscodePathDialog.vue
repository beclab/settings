<template>
	<q-dialog ref="dialogRef" @hide="onDialogCancel">
		<div class="common-dialog" style="border-radius: 16px">
			<DialogHeader
				:title="t('Transcode path')"
				@close-action="onDialogCancel"
			></DialogHeader>
			<div class="dialog-content-root">
				<div class="text-body3 text-ink-2">
					{{
						t(
							'Browse or enter the path to use for transcode files. The folder must be writeable.'
						)
					}}
				</div>

				<terminus-edit
					class="q-mt-lg"
					v-model="folderRef"
					:label="t('Folder')"
					style="width: 100%"
				/>

				<dialog-footer
					:confirm-text="t('confirm')"
					:confirm-disable="!enableEdit"
					@cancel-action="onDialogCancel"
					@confirm-action="confirmAction"
				/>
			</div>
		</div>
	</q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar';
import DialogHeader from '../../../components/DialogHeader.vue';
import DialogFooter from '../../../components/DialogFooter.vue';

import TerminusEdit from '../../../components/base/TerminusEdit.vue';
import { useI18n } from 'vue-i18n';
import { computed, ref } from 'vue';

const props = defineProps({
	folder: {
		type: String,
		required: false,
		default: ''
	}
});

const { t } = useI18n();

const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const folderRef = ref(props.folder);

const enableEdit = computed(() => {
	return folderRef.value.length > 0 && folderRef.value != props.folder;
});

const confirmAction = () => {
	onDialogOK(folderRef.value);
};
</script>

<style scoped lang="scss">
.cpu-core {
	text-align: right;
}
</style>
