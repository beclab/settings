<template>
	<page-title-component :show-back="false" :title="t('home_menus.account')" />
	<bt-scroll-area class="nav-height-scroll-area-conf">
		<bt-list v-show="accountStore.accounts.length > 0">
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
		</bt-list>
		<list-bottom-func-btn
			@funcClick="createUser"
			:title="t('create_account')"
			style="margin-top: 12px"
		/>
	</bt-scroll-area>
</template>

<script setup lang="ts">
import PageTitleComponent from '../../components/PageTitleComponent.vue';
import ListBottomFuncBtn from '../../components/ListBottomFuncBtn.vue';
import CreateUserDialog from './dialog/CreateUserDialog.vue';
import UserItem from '../../components/user/UserItem.vue';
import BtList from '../../components/base/BtList.vue';
import { useUserStore } from '../../stores/user';
import { AccountInfo } from '../../global';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { onMounted } from 'vue';

const accountStore = useUserStore();
const quasar = useQuasar();
const $router = useRouter();
const { t } = useI18n();

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
