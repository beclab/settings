<template>
	<page-title-component :show-back="false" :title="t('home_menus.account')" />
	<bt-scroll-area class="nav-height-scroll-area-conf">
		<q-list
			:class="deviceStore.isMobile ? 'mobile-items-list' : 'q-list-class'"
			v-show="accountStore.accounts.length > 0"
		>
			<template
				v-for="(account, index) in accountStore.accounts"
				:key="account.uid"
			>
				<user-item
					:account="account"
					:margin-top="index !== 0"
					:width-separator="
						index !== accountStore.accounts.length - 1
					"
					@click="pushToUserInfo(account)"
				/>
			</template>
		</q-list>
		<list-bottom-func-btn
			@funcClick="createUser"
			:title="t('create_account')"
			style="margin-top: 12px"
		/>
	</bt-scroll-area>
</template>

<script setup lang="ts">
import { useUserStore } from 'src/stores/User';
import ListBottomFuncBtn from '../../components/ListBottomFuncBtn.vue';
import { useQuasar } from 'quasar';
import CreateUserDialog from './dialog/CreateUserDialog.vue';
import { useRouter } from 'vue-router';
import { AccountInfo } from 'src/global';
import { onMounted } from 'vue';
import PageTitleComponent from '../../components/PageTitleComponent.vue';
import UserItem from '../../components/user/UserItem.vue';
import { useI18n } from 'vue-i18n';
import { useDeviceStore } from '../../stores/device';

const accountStore = useUserStore();
const quasar = useQuasar();
const $router = useRouter();
const { t } = useI18n();
const deviceStore = useDeviceStore();

const pushToUserInfo = (account: AccountInfo) => {
	$router.push(`account/info/${account.name}`);
};

const createUser = () => {
	quasar
		.dialog({
			component: CreateUserDialog
		})
		.onOk(() => {
			accountStore.get_accounts();
		});
};

onMounted(() => {
	accountStore.get_accounts();
});
</script>

<style scoped lang="scss"></style>
