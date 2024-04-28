<template>
	<page-title-component :show-back="true" :title="t('snapshot_details')" />

	<bt-scroll-area class="nav-height-scroll-area-conf">
		<q-list class="q-list-class">
			<bt-form-item
				:title="t('size')"
				:data="humanStorageSize(snap?.size || 0)"
			/>
			<bt-form-item :title="t('backup_type')" :data="snap?.backupType" />
			<bt-form-item
				:title="t('message')"
				:width-separator="false"
				v-if="snap?.failedMessage"
			>
				<div class="text-body1 faild-message faild-message-width">
					{{ snap?.failedMessage }}
				</div>
				<q-popup-proxy class="error_banner">
					<div class="banner_message" v-html="snap?.failedMessage" />
				</q-popup-proxy>
			</bt-form-item>
			<bt-form-item
				:title="t('message')"
				:width-separator="false"
				:data="snap?.phase"
				v-else
			/>

			<error-message-tip
				:is-error="snap?.failedMessage"
				:error-message="t('naming_is_not_compliant')"
				:with-popup="true"
				:width-separator="false"
				:popup-message="t('backup_detail_snpshot_popup_info')"
			>
			</error-message-tip>
		</q-list>
	</bt-scroll-area>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useBackup2Store } from 'src/stores/backup2';
import { BackupSnapshotDetail } from '@bytetrade/core';
import PageTitleComponent from 'src/components/PageTitleComponent.vue';
import BtFormItem from 'src/components/base/BtFormItem.vue';
import ErrorMessageTip from 'src/components/base/ErrorMessageTip.vue';
import { format } from 'quasar';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const { humanStorageSize } = format;

export interface BackupSnapshotLog {
	type: string;
	occurred: number;
	message: string;
}

const backupStore = useBackup2Store();
const route = useRoute();
const snap = ref<BackupSnapshotDetail | null>(null);
onMounted(async () => {
	const backup_name: string = route.params.backup_name as string;
	const snapshot_name: string = route.params.snapshot_name as string;

	snap.value = await backupStore.getSnapShotDetail(
		backup_name,
		snapshot_name
	);
});
</script>
<style lang="scss" scoped>
.faild-message {
	text-align: right;
	color: $red;
}

.faild-message-width {
	width: 280px;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
</style>
