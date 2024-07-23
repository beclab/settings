<template>
	<page-title-component
		:show-back="false"
		:title="t('home_menus.integration')"
	>
		<template v-slot:end>
			<div
				class="row justify-center items-center"
				:class="deviceStore.isMobile ? '' : 'add-btn'"
				@click="addAccount()"
			>
				<q-icon
					name="sym_r_add"
					color="ink-1"
					:size="deviceStore.isMobile ? '32px' : '20px'"
				/>
				<div class="text-body3 add-title" v-if="!deviceStore.isMobile">
					{{ t('add_account') }}
				</div>
			</div>
		</template>
	</page-title-component>
	<bt-scroll-area class="nav-height-scroll-area-conf">
		<empty-component
			v-if="integrationStore.accounts.length === 0"
			:empty-item="t('account')"
		/>
		<account-item
			v-for="item in integrationStore.accounts"
			:key="`${item.type}_${item.name}`"
			:title="item.name"
			:available="item.available"
			:detail="`Authorized time:${formattedDate(item.create_at)}`"
			@account-click="clickCloud(item)"
			:style="deviceStore.isMobile ? 'height: 64px' : ''"
			:side="
				deviceStore.isMobile && item.type == AccountType.Space
					? false
					: true
			"
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
import {
	IntegrationAccountMiniData,
	AccountType
} from '../../services/abstractions/integration/integrationService';
import { getRequireImage } from '../../utils/helper';
import AddIntegrationDialog from './dialog/AddIntegrationDialog.vue';
import integraionService from '../../services/integration/index';
import EmptyComponent from '../../components/EmptyComponent.vue';
import { useDeviceStore } from '../../stores/device';
const { t } = useI18n();

const router = useRouter();
const deviceStore = useDeviceStore();

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
	if (deviceStore.isMobile) {
		router.push('/integration/add');
	} else {
		$q.dialog({
			component: AddIntegrationDialog
		}).onOk(() => {});
	}
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
</style>
