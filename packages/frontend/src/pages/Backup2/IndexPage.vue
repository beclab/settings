<template>
	<page-title-component :show-back="false" :title="t('backup')">
		<template v-slot:end v-if="accountStore.space_account">
			<div
				class="add-btn row justify-center items-center"
				@click="newBackup()"
			>
				<q-icon size="20px" name="sym_r_add" color="grey-8" />
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
						class="text-subtitle1 text-grey-10 row items-center justify-center terminus-space-backup-title"
					>
						{{
							t(
								'please_log_in_to_Terminus_Space_before_using_the_backup_service'
							)
						}}
					</div>
				</template>
			</QRCodeLogin>
		</div>
		<div
			v-else-if="backupStore.plans.length === 0"
			class="empty-parent column items-center"
		>
			<q-img src="default_empty.svg" class="empty-image" />
			<div class="text-body2 empty-text">
				{{ t('no_backup_available') }}
			</div>
		</div>
		<div v-else>
			<template v-for="(plan, index) of backupStore.plans" :key="index">
				<plan-item :plan="plan" />
			</template>
		</div>
	</bt-scroll-area>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useBackup2Store } from 'src/stores/backup2';
import { useRouter } from 'vue-router';
import PageTitleComponent from 'src/components/PageTitleComponent.vue';
import PlanItem from '../../components/backup/PlanItem.vue';
import { useI18n } from 'vue-i18n';
import QRCodeLogin from '../../components/QRCodeLogin.vue';
import { useAccountStore } from '../../stores/Account';

const { t } = useI18n();

const router = useRouter();
const backupStore = useBackup2Store();
const accountStore = useAccountStore();

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
	padding: 6px 8px;
	border: 1px solid $grey-2;
	cursor: pointer;
	text-decoration: none;

	.add-title {
		color: $text2;
	}
}

.empty-parent {
	width: 100%;
	height: calc(100% - 56px);

	.empty-image {
		margin-top: 144px;
		width: 160px;
		height: 160px;
	}

	.empty-text {
		text-align: center;
		color: $text2;
	}
}
.terminus-space-backup-title {
	text-align: center;
	width: 336px;
}
</style>
