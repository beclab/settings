<template>
	<page-title-component :show-back="false" :title="t('backup')">
		<template
			v-slot:end
			v-if="accountStore.space_account && !deviceStore.isMobile"
		>
			<div
				class="add-btn row justify-center items-center"
				@click="newBackup()"
			>
				<q-icon size="20px" name="sym_r_add" color="ink-1" />
				<div class="text-body3 add-title">{{ t('add_backup') }}</div>
			</div>
		</template>
	</page-title-component>
	<bt-scroll-area class="nav-height-scroll-area-conf">
		<!-- v-if="!accountStore.space_account" -->
		<div
			class="terminus-cloud-page column items-center"
			v-if="!accountStore.space_account"
		>
			<QRCodeLogin>
				<template v-slot:mode>
					<div
						class="text-subtitle1 text-ink-1 row items-center justify-center terminus-space-backup-title"
					>
						{{
							t(
								'please_log_in_to_Olares_Space_before_using_the_backup_service'
							)
						}}
					</div>
				</template>
			</QRCodeLogin>
		</div>
		<div v-else-if="backupStore.plans.length === 0">
			<EmptyComponent :info="t('no_backup_available')">
				<template v-slot:more v-if="deviceStore.isMobile">
					<div
						class="add-btn add-btn-padding-mobile row justify-center items-center q-mt-xl"
						@click="newBackup()"
					>
						<q-icon size="20px" name="sym_r_add" color="ink-1" />
						<div
							class="add-title"
							:class="
								deviceStore.isMobile
									? 'text-body2-m'
									: 'text-body3'
							"
						>
							{{ t('add_backup') }}
						</div>
					</div>
				</template>
			</EmptyComponent>
		</div>

		<div v-else>
			<template v-for="(plan, index) of backupStore.plans" :key="index">
				<plan-item :plan="plan" />
			</template>
			<div
				v-if="deviceStore.isMobile"
				class="row items-center justify-end"
			>
				<div
					class="add-btn add-btn-padding-mobile row justify-center items-center q-mt-md"
					@click="newBackup()"
				>
					<q-icon size="20px" name="sym_r_add" color="ink-1" />
					<div
						class="add-title"
						:class="
							deviceStore.isMobile ? 'text-body2-m' : 'text-body3'
						"
					>
						{{ t('add_backup') }}
					</div>
				</div>
			</div>
		</div>
	</bt-scroll-area>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useBackup2Store } from '../../stores/backup2';
import { useRouter } from 'vue-router';
import PageTitleComponent from '../../components/PageTitleComponent.vue';
import PlanItem from '../../components/backup/PlanItem.vue';
import { useI18n } from 'vue-i18n';
import QRCodeLogin from '../../components/QRCodeLogin.vue';
import { useAccountStore } from '../../stores/Account';
import EmptyComponent from '../../components/EmptyComponent.vue';
import { useDeviceStore } from '../../stores/device';

const { t } = useI18n();

const router = useRouter();
const backupStore = useBackup2Store();
const accountStore = useAccountStore();
const deviceStore = useDeviceStore();

onMounted(async () => {
	await backupStore.getPlans();
});

function newBackup() {
	router.push('/create_backup');
}
</script>

<style scoped lang="scss">
.add-btn {
	border-radius: 8px;
	border: 1px solid $separator;
	cursor: pointer;
	padding: 5px 8px;
	text-decoration: none;

	.add-title {
		color: $ink-2;
	}
}

.add-btn-padding-mobile {
	padding: 8px 10px;
}

.add-btn:hover {
	background-color: $background-3;
}

.terminus-space-backup-title {
	text-align: center;
	width: 336px;
}
</style>
