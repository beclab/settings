<template>
	<adaptive-layout>
		<template v-slot:pc>
			<bt-grid>
				{{ plan?.name }}
				<template v-slot:title>
					<div
						class="text-subtitle1 plan-item-title row justify-between items-center clickable-view"
						@click="gotoBackup"
					>
						<div>{{ plan?.name }}</div>
						<q-icon name="sym_r_chevron_right" size="20px" />
					</div>
				</template>
				<template v-slot:grid>
					<bt-grid-item :label="t('location')">
						<template v-slot:value>
							<div class="row items-center">
								<q-img
									src="../../assets/cloud/login/icon.svg"
									class="plan-item-type-img"
								/>
								<div>
									{{ t('olares_space') }}
								</div>
							</div>
						</template>
					</bt-grid-item>
					<bt-grid-item
						:label="t('last_snapshot')"
						:value="lastSnapShot"
					/>
					<bt-grid-item :label="t('total_size')" :value="size" />
					<bt-grid-item :label="t('status')">
						<template v-slot:value>
							<div class="row items-center">
								<div class="bg-positive backup-status"></div>
								<div>
									{{ plan.phase ? plan.phase : '-' }}
								</div>
							</div>
						</template>
					</bt-grid-item>
					<bt-grid-item
						:label="t('next_snapshot')"
						:value="nextSnapShot"
					/>
					<bt-grid-item
						:label="t('frequency')"
						:value="
							plan?.backupPolicies.snapshotFrequency?.replace(
								'@',
								''
							)
						"
					/>
				</template>
			</bt-grid>
		</template>
		<template v-slot:mobile>
			<bt-grid
				:class="deviceStore.isMobile ? 'mobile-items-list' : ''"
				:repeat-count="2"
			>
				{{ plan?.name }}
				<template v-slot:title>
					<div
						class="text-subtitle1 plan-item-title row justify-between items-center clickable-view"
						@click="gotoBackup"
					>
						<div>{{ plan?.name }}</div>
						<q-icon name="sym_r_chevron_right" size="20px" />
					</div>
				</template>
				<template v-slot:grid>
					<bt-grid-item :label="t('location')">
						<template v-slot:value>
							<div class="row items-center">
								<q-img
									src="../../assets/cloud/login/icon.svg"
									class="plan-item-type-img"
								/>
								<div>
									{{ t('olares_space') }}
								</div>
							</div>
						</template>
					</bt-grid-item>
					<bt-grid-item :label="t('status')">
						<template v-slot:value>
							<div class="row items-center">
								<div class="bg-positive backup-status"></div>
								<div>
									{{ plan.phase ? plan.phase : '-' }}
								</div>
							</div>
						</template>
					</bt-grid-item>
					<bt-grid-item
						:label="t('last_snapshot')"
						:value="lastSnapShot"
					/>
					<bt-grid-item :label="t('total_size')" :value="size" />

					<bt-grid-item
						:label="t('next_snapshot')"
						:value="nextSnapShot"
					/>
					<bt-grid-item
						:label="t('frequency')"
						:value="
							plan?.backupPolicies.snapshotFrequency?.replace(
								'@',
								''
							)
						"
					/>
				</template>
			</bt-grid>
		</template>
	</adaptive-layout>
</template>

<script lang="ts" setup>
import { computed, PropType } from 'vue';
import { date, format } from 'quasar';
import { useRouter } from 'vue-router';
import BtGridItem from '../base/BtGridItem.vue';
import BtGrid from '../base/BtGrid.vue';
import humanStorageSize = format.humanStorageSize;
import { useI18n } from 'vue-i18n';
import { BackupPlanItem2 } from '../../stores/backup2';
import AdaptiveLayout from '../AdaptiveLayout.vue';
import { useDeviceStore } from '../../stores/device';

const router = useRouter();
const deviceStore = useDeviceStore();

const props = defineProps({
	plan: {
		type: Object as PropType<BackupPlanItem2>,
		require: true
	}
});

const { t } = useI18n();

const size = computed(() => {
	if (props.plan && props.plan.size) {
		return humanStorageSize(props.plan.size);
	} else {
		return '-';
	}
});

const lastSnapShot = computed(() => {
	if (props.plan && props.plan.creationTimestamp) {
		return date.formatDate(
			props.plan.creationTimestamp * 1000,
			'YYYY-MM-DD HH:mm'
		);
	}
	return '-';
});

const nextSnapShot = computed(() => {
	if (props.plan && props.plan.nextBackupTimestamp) {
		return date.formatDate(
			props.plan.nextBackupTimestamp * 1000,
			'YYYY-MM-DD HH:mm'
		);
	}
	return '-';
});

async function gotoBackup() {
	if (props.plan && props.plan.name) {
		router.push('/backup/' + props.plan.name);
	}
}
</script>

<style scoped lang="scss">
.plan-item-title {
	width: 100%;
	height: 24px;
	margin-bottom: 8px;
	color: $ink-1;
}

.plan-item-type-img {
	width: 16px;
	height: 16px;
	margin-right: 4px;
}

.backup-status {
	width: 8px;
	height: 8px;
	border-radius: 4px;
	margin-right: 4px;
}
</style>
