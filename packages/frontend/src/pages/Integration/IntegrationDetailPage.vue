<template>
	<page-title-component :show-back="true" :title="t('account_settings')">
	</page-title-component>
	<bt-scroll-area class="nav-height-scroll-area-conf">
		<div v-if="accountData" class="q-list-class">
			<account-item
				:border="false"
				:title="accountData.name"
				:available="accountData.available"
				:clickable="false"
				:side="false"
				:detail="`Authorized time: ${formattedDate(
					accountData.create_at
				)}`"
			>
				<template v-slot:avatar>
					<q-img
						width="40px"
						height="40px"
						:noSpinner="true"
						:src="getAccountIcon(accountData)"
					/>
				</template>
			</account-item>
			<q-separator
				class="separator-background"
				v-if="detailInfo?.scopes.length > 0"
			/>
			<div
				class="text-subtitle1 text-ink-1 q-mt-md"
				v-if="detailInfo?.title"
			>
				{{ detailInfo.title }}
			</div>
			<div
				class="text-body2 text-ink-2 q-mt-sm"
				v-if="detailInfo?.scopes.length > 0"
			>
				<div
					v-for="(item, index) in detailInfo?.scopes"
					:key="index"
					class="row"
					:class="index > 0 ? 'q-mt-sm' : ''"
				>
					<q-icon :name="item.icon" size="20px" />
					<div class="q-ml-sm" style="max-width: calc(100% - 30px)">
						{{ item.introduce }}
					</div>
				</div>
			</div>
		</div>
		<div class="row justify-end q-mt-md" v-if="accountData">
			<q-btn
				dense
				flat
				class="cancle-btn q-px-md"
				:label="t('delete')"
				@click="deleteAction"
			/>
		</div>
	</bt-scroll-area>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import PageTitleComponent from '../../components/PageTitleComponent.vue';
import { useI18n } from 'vue-i18n';
import { onMounted, ref } from 'vue';
import { useIntegrationStore } from '../../stores/integration';
import {
	AccountType,
	IntegrationAccountMiniData,
	IntegrationPermissions
} from '../../services/abstractions/integration/integrationService';
import AccountItem from '../../components/account/AccountItem.vue';
import { date, useQuasar } from 'quasar';
import { getRequireImage } from '../../utils/helper';
import integraionService from '../../services/integration/index';
import ReminderDialogComponent from '../../components/ReminderDialogComponent.vue';
const { t } = useI18n();

const route = useRoute();

const router = useRouter();

const $q = useQuasar();

const integrationStore = useIntegrationStore();

const type = route.params.type as AccountType;
const name = route.params.name as string;
const accountData = ref<IntegrationAccountMiniData | undefined>();

const detailInfo = ref<IntegrationPermissions | undefined>();

onMounted(async () => {
	try {
		const data = await integrationStore.getAccountByTypeAndName(type, name);
		if (data && data.length > 0) {
			accountData.value = data[0];
			detailInfo.value = await integraionService
				.getInstanceByType(accountData.value!.type)
				?.permissions();
		}
	} catch (error) {
		console.log(error);
	}
});

const formattedDate = (datetime: number) => {
	if (datetime == 0) {
		return '--';
	}
	return date.formatDate(datetime, 'YYYY-MM-DD HH:mm:ss');
};

const getAccountIcon = (data: IntegrationAccountMiniData) => {
	const account = integrationStore.getAccountByType(data);
	if (!account) {
		return '';
	}
	return getRequireImage(`integration/${account.detail.icon}`);
};

const deleteAction = async () => {
	$q.dialog({
		component: ReminderDialogComponent,
		componentProps: {
			title: t('delete_item', {
				item: t('account')
			}),
			message: t('are_you_sure_you_want_to_delete_item', {
				item: name
			}),
			useCancel: true
		}
	}).onOk(async () => {
		await integrationStore.deleteAccount(accountData.value);
		router.back();
	});
};
</script>

<style scoped lang="scss"></style>
