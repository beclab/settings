<template>
	<page-title-component :show-back="true" :title="t('manage_backup')" />
	<bt-scroll-area class="nav-height-scroll-area-conf">
		<bt-form v-model:can-submit="canSubmit">
			<q-list class="q-list-class">
				<bt-form-item :title="t('backup_name')">
					<div class="text-body2 text-ink-2">{{ name }}</div>
				</bt-form-item>

				<bt-form-item :title="t('snapshot_frequency')">
					<bt-select
						v-model="frequency"
						:options="frequencyOptions"
					/>
				</bt-form-item>

				<bt-form-item
					:title="t('run_backup_at')"
					:width-separator="false"
				>
					<div class="row items-center justify-end">
						<bt-select
							v-model="weekDay"
							:options="weekOption"
							v-if="frequency == BackupFrequency.Weekly"
						/>
						<div class="text-body2 text-ink-1 q-ml-md">
							{{ time }}
						</div>

						<q-icon
							size="20px"
							name="sym_r_access_time"
							color="ink-1"
							class="time-clock"
						>
							<q-popup-proxy
								transition-show="jump-down"
								transition-hide="jump-up"
							>
								<q-time v-model="time">
									<div class="row items-center justify-end">
										<q-btn
											v-close-popup
											:label="t('close')"
											color="primary"
											flat
										/>
									</div>
								</q-time>
							</q-popup-proxy>
						</q-icon>
					</div>
				</bt-form-item>
			</q-list>
		</bt-form>
		<div class="row justify-end">
			<q-btn
				dense
				flat
				class="cancle-btn q-px-md"
				style="height: 24px; margin-top: 20px; margin-right: 8px"
				:label="t('delete')"
				@click="onDelete"
			/>

			<!-- <q-btn dense class="submit-btn" :disable="disableSave" label="Save" @click="onSubmit" color="primary" /> -->
			<q-btn
				dense
				flat
				class="confirm-btn q-px-md"
				:disable="disableSave"
				style="height: 24px; margin-top: 20px"
				:label="t('save')"
				@click="onSubmit"
			/>
		</div>

		<div class="text-subtitle1 resource-title">{{ t('size') }}</div>

		<q-list class="q-list-class">
			<bt-form-item
				:title="t('backup_size')"
				:data="humanStorageSize(backupSize)"
				:width-separator="false"
			/>
		</q-list>

		<div class="text-subtitle1 resource-title" style="margin-top: 20px">
			{{ t('snapshots') }}
		</div>

		<div class="q-list-class" v-if="snapshots.length > 0">
			<q-table
				tableHeaderStyle="height: 32px;"
				table-header-class="text-body3 text-ink-2"
				flat
				:bordered="false"
				:rows="snapshots"
				:columns="columns"
				row-key="id"
				v-model:pagination="pagination"
				hide-pagination
				hide-selected-banner
				hide-bottom
			>
				<template v-slot:body-cell-action="props">
					<q-td :props="props">
						<div class="row items-center justify-end">
							<div
								class="backup-arrow-bg row items-center justify-center"
								@click="gotoSnapshot(props.row.name)"
							>
								<q-icon
									name="sym_r_chevron_right"
									size="16px"
									color="ink-1"
								/>
							</div>
						</div>
					</q-td>
				</template>

				<template v-slot:body-cell-status="props">
					<q-td :props="props">
						<div class="row items-center">
							<div
								class="status-bg q-mr-xs row items-center justify-center"
							>
								<div
									class="status-node"
									:style="`background:${
										BackupSnapshotPhaseColorRecord[
											props.row.phase
										]
									}`"
								></div>
							</div>
							<div>
								{{ props.row.phase }}
							</div>
						</div>
					</q-td>
				</template>
			</q-table>
			<div class="row justify-center q-mt-md">
				<q-pagination
					v-model="pagination.page"
					:max="pagesNumber"
					input
					icon-first="keyboard_double_arrow_left"
					icon-last="keyboard_double_arrow_right"
					color="gary05"
				/>
			</div>
		</div>
		<div v-else class="empty-parent column items-center">
			<q-img src="default_empty.svg" class="empty-image" />
			<div class="empty-text">{{ t('no_snapshots') }}</div>
		</div>
	</bt-scroll-area>
</template>

<script setup lang="ts">
import { date, format } from 'quasar';
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useBackup2Store } from 'src/stores/backup2';
import {
	BackupPlanItem,
	BackupSnapshot,
	BackupFrequency
} from '@bytetrade/core';
import PageTitleComponent from 'components/PageTitleComponent.vue';
import BtForm from 'components/base/BtForm.vue';
import {
	frequencyOptions,
	BackupSnapshotPhaseColorRecord,
	weekOption
} from '../../../utils/constants';
import BtSelect from '../../../components/base/BtSelect.vue';
import BtFormItem from '../../../components/base/BtFormItem.vue';
// import BtEditView from '../../../components/base/BtEditView.vue';
import { useRouter } from 'vue-router';
import { toZeroZoneTime, timestempToTime } from './FormatBackupTime';

import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const { humanStorageSize } = format;

const backupStore = useBackup2Store();
const route = useRoute();
const name = ref('');
const router = useRouter();

const backupSize = ref(0);

const frequency = ref();
const time = ref();
const canSubmit = ref(false);
const weekDay = ref(0);

const snapshots = ref<BackupSnapshot[]>([]);

const backup = ref<BackupPlanItem | null>(null);
onMounted(async () => {
	const backup_name: string = route.params.backup_name as string;

	await configDefaultValue();

	snapshots.value = await backupStore.getSnapshots(backup_name);

	backupSize.value =
		snapshots.value.find((e) => e.phase == 'Succeed')?.size || 0;
});

async function onSubmit() {
	if (backup.value) {
		const realTime = toZeroZoneTime(time.value);
		backup.value.backupPolicies.dayOfWeek = weekDay.value;
		backup.value.backupPolicies.timesOfDay = realTime;
		backup.value.backupPolicies.name = name.value;
		backup.value.backupPolicies.snapshotFrequency = frequency.value;

		await backupStore.updatePlan(backup.value.name, {
			backupPolicies: backup.value.backupPolicies,
			password: '',
			confirmPassword: ''
		});

		await configDefaultValue();
	}
}

async function configDefaultValue() {
	const backup_name: string = route.params.backup_name as string;

	backup.value = await backupStore.getPlan(backup_name);
	if (backup.value) {
		name.value = backup.value.name;
		frequency.value = backup.value.backupPolicies.snapshotFrequency;
		if (
			backup.value.backupPolicies &&
			backup.value.backupPolicies.timesOfDay
		) {
			const realTime = timestempToTime(
				Number(backup.value.backupPolicies.timesOfDay)
			);
			backup.value.backupPolicies.timesOfDay = realTime;
			time.value = backup.value.backupPolicies.timesOfDay;
		}

		if (backup.value.backupPolicies) {
			weekDay.value = backup.value.backupPolicies.dayOfWeek;
		}
	}
}

async function onDelete() {
	if (backup.value) {
		await backupStore.deletePlan(backup.value.name);
		router.back();
	}
}

async function gotoSnapshot(name: string) {
	if (backup.value) {
		router.push('/backup/' + backup.value.name + '/' + name);
	}
}
const disableSave = computed(() => {
	return (
		!backup.value ||
		(name.value == backup.value?.backupPolicies.name &&
			time.value == backup.value?.backupPolicies.timesOfDay &&
			frequency.value == backup.value?.backupPolicies.snapshotFrequency &&
			(backup.value?.backupPolicies.snapshotFrequency ==
			BackupFrequency.Weekly
				? weekDay.value == backup.value?.backupPolicies.dayOfWeek
				: true))
	);
});

const columns = [
	{
		name: 'createTime',
		align: 'left',
		label: t('create_time'),
		field: 'creationTimestamp',
		format: (val: any) => {
			return date.formatDate(val * 1000, 'YYYY-MM-DD HH:mm');
		},
		sortable: false
	},
	{
		name: 'size',
		align: 'left',
		label: t('size'),
		field: 'size',
		format: (val: any) => {
			return humanStorageSize(val || 0);
		},
		sortable: false
	},
	{
		name: 'status',
		align: 'left',
		label: t('status'),
		field: 'phase',
		sortable: false
	},
	{
		name: 'action',
		align: 'right',
		label: t('action'),
		field: 'Action',
		sortable: false
	}
];

const pagesNumber = computed(() =>
	Math.ceil(snapshots.value.length / pagination.value.rowsPerPage)
);

const pagination = ref({
	sortBy: 'desc',
	descending: false,
	page: 1,
	rowsPerPage: 6
});
</script>

<style lang="scss" scoped>
.resource-title {
	color: $ink-1;
	margin-top: 12px;
	margin-bottom: 8px;
}

.backup-arrow-bg {
	width: 24px;
	height: 24px;
	border-radius: 8px;
	background: $background-3;
	text-align: right;
}

.status-bg {
	width: 20px;
	height: 20px;

	.status-node {
		width: 8px;
		height: 8px;
		border-radius: 4px;
	}
}

.empty-parent {
	width: 100%;
	height: 400px;
	.empty-image {
		margin-top: 40px;
		width: 160px;
		height: 160px;
	}
}
</style>
