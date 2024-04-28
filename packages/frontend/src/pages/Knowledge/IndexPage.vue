<template>
	<page-title-component :show-back="false" :title="t('knowledge')" />
	<bt-scroll-area class="nav-height-scroll-area-conf">
		<div class="text-subtitle1 directory-title">
			{{ t('set_directories_for_file_search_monitoring') }}
		</div>
		<q-list class="q-list-class">
			<path-location>
				<template v-slot:start>
					<div>{{ t('path') }}</div>
				</template>
				<template v-slot:midden>
					<div>{{ t('status') }}</div>
				</template>
				<template v-slot:end>
					<div>{{ t('update_time') }}</div>
				</template>
			</path-location>
			<q-separator class="separator-background" />
			<template
				v-for="(folder, index) of fileStore.folder.p"
				:key="'f' + index"
			>
				<directory-item
					:path="folder"
					:status="fileStore.folder.status"
					:time="fileStore.folder.last_update_time"
				/>
			</template>
		</q-list>
		<div class="text-body2 directory-tips">
			{{ t('knowledge_reminder_info') }}
		</div>
		<list-bottom-func-btn
			@funcClick="AddSearchFolderPath"
			:title="t('add_directory')"
			style="margin-top: 12px"
		/>
	</bt-scroll-area>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useFilesStore } from 'src/stores/Files';
import AddSearchFolderDialog from './dialog/AddSearchFolderDialog.vue';
import PathLocation from 'src/components/PathLocation.vue';
import DirectoryItem from 'src/components/DirectoryItem.vue';
import PageTitleComponent from 'src/components/PageTitleComponent.vue';
import ListBottomFuncBtn from 'src/components/ListBottomFuncBtn.vue';
import { useI18n } from 'vue-i18n';
import { notifyFailed } from '../../utils/btNotify';
const { t } = useI18n();

const $q = useQuasar();
const fileStore = useFilesStore();

onMounted(() => {
	fileStore.GetSearchFolderStatus();
});

async function AddSearchFolderPath() {
	$q.dialog({
		component: AddSearchFolderDialog,
		componentProps: {}
	}).onOk(async (data) => {
		let p = [...fileStore.folder.p];
		p.push(data.path);
		try {
			await fileStore.UpdateSearchFolderPaths(p);
			await fileStore.GetSearchFolderStatus();
		} catch (e: any) {
			notifyFailed(
				e.message || t('errors.something_wrong_please_try_again')
			);
		}
	});
}
</script>

<style scoped lang="scss">
.directory-title {
	margin-top: 12px;
	margin-bottom: 12px;
	color: $text1;
}

.directory-tips {
	margin-top: 12px;
	margin-bottom: 12px;
	color: $grey-5;
}
</style>
