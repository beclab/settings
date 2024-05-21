<template>
	<page-title-component :show-back="false" :title="t('knowledge_bases')">
		<template v-slot:end>
			<div
				class="add-btn row justify-center items-center"
				@click="addOrEditSearchFolderPath()"
			>
				<q-icon size="16px" name="sym_r_add" color="grey-8" />
				<div class="text-body3 add-title">
					{{ t('create_new') }}
				</div>
			</div>
		</template>
	</page-title-component>
	<bt-scroll-area class="nav-height-scroll-area-conf">
		<div
			v-if="fileStore.datasets.length === 0"
			class="empty-parent column items-center"
		>
			<q-img src="default_empty.svg" class="empty-image" />
			<div class="text-body2 empty-text">
				{{ t('no_knowledge_bases_available') }}
			</div>
		</div>
		<div
			class="q-list-class"
			v-for="folder in fileStore.datasets"
			:key="folder.datasetID"
		>
			<div class="text-subtitle1 text-grey-10 q-mb-md">
				{{ folder.datasetName }}
			</div>
			<q-separator class="separator-background" />
			<div class="row items-center justify-between folder-content">
				<div class="row path_content">
					<q-img
						class="directory-image q-mr-sm"
						src="folder_documents.svg"
						noSpinner
					/>
					<div class="text-body2 text-grey-10 path">
						{{ folder.paths != null ? folder.paths.join(',') : '' }}
					</div>
				</div>
				<q-btn dense flat icon="sym_r_more_horiz">
					<q-menu :offset="[90, 5]">
						<q-list dense class="popup-list">
							<q-item
								class="row items-center justify-start popup-item text-grey-8"
								style="padding: 8px; border-radius: 4px"
								clickable
								v-close-popup
								@click="addOrEditSearchFolderPath(folder)"
							>
								<q-icon
									name="sym_r_edit_square"
									size="20px"
									class="q-mr-sm"
								/>
								<q-item-section
									class="text-body3 text-grey-8"
									>{{ t('edit') }}</q-item-section
								>
							</q-item>
							<q-item
								class="row items-center justify-start popup-item text-grey-8"
								style="padding: 8px; border-radius: 4px"
								clickable
								:disable="folder.default"
								v-close-popup
								@click="showRemoveDialog(folder)"
							>
								<q-icon
									name="sym_r_delete"
									size="20px"
									class="q-mr-sm"
								/>
								<q-item-section
									class="text-body3 text-grey-8"
									>{{ t('remove') }}</q-item-section
								>
							</q-item>
						</q-list>
					</q-menu>
				</q-btn>
			</div>
			<div class="row items-center text-grey-5 text-body3">
				<div class="row items-center">
					<q-icon
						name="sym_r_description"
						size="16px"
						class="q-mr-xs"
					/>
					<div>{{ (folder.indexDocNum || 0) + ' ' + t('docs') }}</div>
				</div>
				<div class="row items-center q-ml-lg">
					<q-icon name="sym_r_robot_2" size="16px" class="q-mr-xs" />
					<div>
						{{
							t('number_linked_agent', {
								number: folder.linkedAgentNum || 0
							})
						}}
					</div>
				</div>
			</div>
		</div>
	</bt-scroll-area>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useFilesStore, DatasetFolder } from '../../stores/Files';
import AddKnowledgeBaseDialog from './dialog/AddKnowledgeBaseDialog.vue';
import PageTitleComponent from '../../components/PageTitleComponent.vue';
import { useI18n } from 'vue-i18n';
import ReminderDialogComponent from '../../components/ReminderDialogComponent.vue';
const { t } = useI18n();

const $q = useQuasar();
const fileStore = useFilesStore();

onMounted(() => {
	fileStore.GetDatasetFolderStatus();
	// fileStore.UpdateDatasetFolderPaths('258d7bf5-e3e0-4f67-acfb-5dbcfd28b201', [
	// 	'/data/Home/Documents'
	// ]);
});

const addOrEditSearchFolderPath = (folder?: DatasetFolder) => {
	$q.dialog({
		component: AddKnowledgeBaseDialog,
		componentProps: {
			datasetID: folder ? folder.datasetID : ''
		}
	}).onOk(async (data: { name: string; paths: string[] }) => {
		// if (folder) {

		// }
		fileStore.UpdateDatasetFolderPaths(
			folder ? folder.datasetID : undefined,
			folder ? undefined : data.name,
			data.paths,
			folder ? 0 : 1
		);
	});
};

const showRemoveDialog = (folder: DatasetFolder) => {
	$q.dialog({
		component: ReminderDialogComponent,
		componentProps: {
			title: t('remove_knowledge_base', {
				base: folder.datasetName
			}),
			message: t('remove_knowledge_base_message', {
				base: `'${folder.datasetName}'`
			}),
			useCancel: true,
			isReminder: true,
			confirmText: t('remove')
		}
	}).onOk(() => {
		fileStore.UpdateDatasetFolderPaths(
			folder.datasetID,
			undefined,
			undefined,
			-1
		);
	});
};
</script>

<style scoped lang="scss">
.directory-tips {
	margin-top: 12px;
	margin-bottom: 12px;
	color: $grey-5;
}

.add-btn {
	border-radius: 8px;
	padding: 6px 12px;
	border: 1px solid $grey-2;
	cursor: pointer;
	text-decoration: none;

	.add-title {
		color: $text2;
	}
}
.add-btn:hover {
	background-color: $grey-1;
}
.directory-image {
	width: 24px;
	height: 24px;
}

.folder-content {
	width: 100%;
	// height: 56px;
	// background-color: red;
	padding-top: 12px;

	.path_content {
		width: calc(100% - 40px);
		word-wrap: word-break;
		word-break: break-all;

		.path {
			width: calc(100% - 40px);
			margin-top: 2px;
			margin-bottom: 10px;
			// background: green;
		}
	}
}

.popup-list {
	width: 120px;
	padding: 8px;
	border-radius: 8px;
	opacity: 0px;
	box-shadow: 0px 4px 10px 0px #00000033;
}
.empty-image {
	margin-top: 144px;
	width: 160px;
	height: 160px;
}
</style>
