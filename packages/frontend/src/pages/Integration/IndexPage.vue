<template>
	<page-title-component
		:show-back="false"
		:title="t('home_menus.integration')"
	/>
	<bt-scroll-area class="nav-height-scroll-area-conf">
		<q-item
			class="q-list-class"
			clickable
			v-if="!accountStore.space_account"
		>
			<q-item-section>
				<div class="row items-center" @click="clickCloud('space')">
					<img
						class="application-logo"
						src="../../assets/cloud/login/icon.svg"
						style="border-radius: 10px"
					/>
					<div
						class="column justify-start"
						style="margin-left: 8px; width: calc(100% - 48px)"
					>
						<div class="row">
							<div class="text-subtitle2 application-name">
								{{ t('terminus_space') }}
							</div>
							<setting-connect-status
								:connected="!!accountStore.space_account"
							/>
						</div>
						<div class="text-body3 application-label">
							{{
								t(
									'check_resource_usage_you_can_check_the_binding_message'
								)
							}}
						</div>
					</div>
				</div>
			</q-item-section>
			<q-item-section side>
				<q-icon name="sym_r_chevron_right" color="ink-1" size="20px" />
			</q-item-section>
		</q-item>
		<account-item
			v-else
			:title="adminStore.user.name"
			:detail="'@' + adminStore.terminus.terminusName.split('@')[1]"
			@account-click="clickCloud('space')"
		>
			<template v-slot:avatar>
				<setting-avatar :size="40" style="margin-left: 8px" />
			</template>
		</account-item>

		<div class="mode-title-class q-mt-md">
			{{ t('third_party_account') }}
		</div>
		<account-item
			v-for="(item, index) in ThirdPartyAccountList"
			:key="index"
			:title="item.name"
			:img-name="item.name"
			@click="featuresToast"
		/>
	</bt-scroll-area>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAccountStore } from '../../stores/Account';
import PageTitleComponent from 'components/PageTitleComponent.vue';
import SettingConnectStatus from 'components/base/SettingConnectStatus.vue';
import AccountItem from '../../components/account/AccountItem.vue';
import { ThirdPartyAccountList } from '../../utils/constants';
import { useI18n } from 'vue-i18n';
import { notifySuccess } from '../../utils/btNotify';
import { useAdminStore } from '../../stores/Admin';
import SettingAvatar from '../../components/base/SettingAvatar.vue';
const { t } = useI18n();

const router = useRouter();

const accountStore = useAccountStore();

const adminStore = useAdminStore();

function clickCloud(account_type: string) {
	if (accountStore.space_account) {
		router.push({ path: '/integration/detail/space' });
	} else {
		router.push({ path: '/integration/login/' + account_type });
	}
}

const featuresToast = () => {
	notifySuccess(t('features_under_development'));
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
</style>
