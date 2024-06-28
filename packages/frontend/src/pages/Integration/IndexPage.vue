<template>
	<page-title-component
		:show-back="false"
		:title="t('home_menus.integration')"
	>
		<template v-slot:end>
			<div
				class="add-btn row justify-center items-center"
				@click="addAccount()"
			>
				<q-icon size="20px" name="sym_r_add" color="ink-1" />
				<div class="text-body3 add-title">{{ t('add_account') }}</div>
			</div>
		</template>
	</page-title-component>
	<bt-scroll-area class="nav-height-scroll-area-conf">
		<div
			v-if="integrationStore.accounts.length === 0"
			class="empty-parent column items-center"
		>
			<q-img src="default_empty.svg" class="empty-image" />
			<div class="text-body2 empty-text">
				{{
					t('no_item_available', {
						item: t('account')
					})
				}}
			</div>
		</div>
		<account-item
			v-for="item in integrationStore.accounts"
			:key="`${item.type}_${item.name}`"
			:title="item.name"
			:available="item.available"
			:detail="`Authorized time:${formattedDate(item.create_at)}`"
			@account-click="clickCloud(item)"
		>
			<template v-slot:avatar>
				<!-- <setting-avatar :size="40" style="margin-left: 8px" /> -->
				<q-img
					width="40px"
					height="40px"
					:noSpinner="true"
					:src="getAccountIcon(item)"
				/>
			</template>
		</account-item>
	</bt-scroll-area>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import PageTitleComponent from '../../components/PageTitleComponent.vue';
import AccountItem from '../../components/account/AccountItem.vue';
import { useI18n } from 'vue-i18n';
import { onMounted } from 'vue';
import { useIntegrationStore } from '../../stores/integration';
import { date, useQuasar } from 'quasar';
import { IntegrationAccountMiniData } from '../../services/abstractions/integration/integrationService';
import { getRequireImage } from '../../utils/helper';
import AddIntegrationDialog from './dialog/AddIntegrationDialog.vue';
import integraionService from '../../services/integration/index';
const { t } = useI18n();

const router = useRouter();

const $q = useQuasar();

const integrationStore = useIntegrationStore();

function clickCloud(account: IntegrationAccountMiniData) {
	const path = integraionService
		.getInstanceByType(account.type)
		?.detailPath(account);
	if (path) {
		router.push({ path });
	}
}
const formattedDate = (datetime: number) => {
	if (datetime <= 0) {
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

onMounted(() => {
	integrationStore.getAccount('all');
});

const addAccount = () => {
	$q.dialog({
		component: AddIntegrationDialog
	}).onOk(() => {});
};
</script>

<style scoped lang="scss">
.application-logo {
	width: 40px;
	height: 40px;
}

.application-name {
	color: $ink-1;
}

.application-label {
	color: $ink-2;
}

.add-btn {
	border-radius: 8px;
	padding: 6px 12px;
	border: 1px solid $separator;
	cursor: pointer;
	text-decoration: none;

	.add-title {
		color: $ink-2;
	}
}
.add-btn:hover {
	background-color: $background-3;
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
		color: $ink-2;
	}
}
</style>
