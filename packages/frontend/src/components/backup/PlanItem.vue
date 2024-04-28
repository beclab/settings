<template>
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
			<!-- value="Terminus Space"
				icon="terminus_icon.svg" -->
			<bt-grid-item :label="t('location')">
				<template v-slot:value>
					<div class="row items-center">
						<q-img
							src="../../assets/cloud/login/icon.svg"
							class="plan-item-type-img"
						/>
						<div>
							{{ t('terminus_space') }}
						</div>
					</div>
				</template>
			</bt-grid-item>
			<bt-grid-item :label="t('last_snapshot')" value="-" />
			<bt-grid-item :label="t('total_size')" :value="size" />
			<bt-grid-item :label="t('status')">
				<template v-slot:value>
					<div class="row items-center">
						<div class="bg-positive backup-status"></div>
						<div>
							{{ t('completed') }}
						</div>
					</div>
				</template>
			</bt-grid-item>
			<bt-grid-item :label="t('next_snapshot')" value="-" />
			<bt-grid-item
				:label="t('frequency')"
				:value="
					plan?.backupPolicies.snapshotFrequency?.replace('@', '')
				"
			/>
		</template>
	</bt-grid>
</template>

<script lang="ts" setup>
import { computed, PropType } from 'vue';
import { BackupPlanItem } from '@bytetrade/core';
import { format } from 'quasar';
import { useRouter } from 'vue-router';
import BtGridItem from '../base/BtGridItem.vue';
import BtGrid from '../base/BtGrid.vue';
import humanStorageSize = format.humanStorageSize;
import { useI18n } from 'vue-i18n';

const router = useRouter();

const props = defineProps({
	plan: {
		type: Object as PropType<BackupPlanItem>,
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
	color: $text1;
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
