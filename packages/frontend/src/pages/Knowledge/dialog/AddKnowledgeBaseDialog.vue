<template>
	<q-dialog ref="dialogRef" @hide="onDialogHide">
		<div class="common-dialog" style="border-radius: 16px">
			<DialogHeader
				:title="title"
				@close-action="dialogRef?.hide()"
			></DialogHeader>
			<div class="dialog-content-root">
				<terminus-edit
					v-model="name"
					:label="t('name')"
					:show-password-img="false"
					style="width: 100%"
				/>
				<div class="text-overline text-grey-5 q-mt-xs">
					{{ t('knowldege_base_name') }}
				</div>

				<terminus-edit
					v-model="paths"
					:label="t('paths')"
					:show-password-img="false"
					:is-textarea="true"
					style="width: 100%"
					class="q-mt-lg"
				/>
				<div class="text-overline text-grey-5 q-mt-xs">
					{{ t('separate_different_paths_with_a_comma') }}
				</div>

				<dialog-footer
					:confirm-disable="!enableCreate"
					:confirm-text="t('confirm')"
					@cancel-action="onDialogCancel"
					@confirm-action="createUserName"
				/>
			</div>
		</div>
	</q-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useDialogPluginComponent } from 'quasar';
import DialogHeader from '../../../components/DialogHeader.vue';
import DialogFooter from '../../../components/DialogFooter.vue';
import TerminusEdit from '../../../components/base/TerminusEdit.vue';
import { useI18n } from 'vue-i18n';
import { useFilesStore } from '../../../stores/Files';

const props = defineProps({
	datasetID: {
		required: false,
		type: String,
		default: ''
	}
});

const { dialogRef, onDialogHide, onDialogCancel } = useDialogPluginComponent();
const { t } = useI18n();

const title = ref(t('add_new_knowledge_base'));

const name = ref('');
const paths = ref('');

const fileStore = useFilesStore();

if (props.datasetID) {
	const dataset = fileStore.datasets.find(
		(e) => e.datasetID == props.datasetID
	);
	if (dataset) {
		name.value = dataset.datasetName;
		paths.value = dataset.paths.join(',');
		title.value = t('save_knowledge_base', {
			base: `'${dataset.datasetName}'`
		});
	}
}

const enableCreate = computed(() => {
	return name.value.length > 0 && paths.value.length > 0;
});
</script>

<style scoped lang="scss">
.cpu-core {
	text-align: right;
}
</style>
