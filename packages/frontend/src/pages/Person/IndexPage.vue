<template>
	<page-title-component :show-back="false" :title="t('olares_ID')" />
	<bt-scroll-area class="nav-height-scroll-area-conf">
		<div class="avatar-layout column items-center justify-center">
			<setting-avatar :size="72" />
			<div class="text-h4 text-ink-1 admin-name">
				{{ adminStore.user.name }}
			</div>
			<div class="text-ink-3 text-body1 admin-name">
				{{ '@' + adminStore.terminus.terminusName.split('@')[1] }}
			</div>
		</div>

		<module-title v-if="adminStore.isAdmin || !isDemo" class="q-mt-md">
			{{ t('device') }}
		</module-title>

		<div
			v-if="adminStore.isAdmin || !isDemo"
			:class="deviceStore.isMobile ? 'mobile-items-list' : ''"
			:style="deviceStore.isMobile ? 'margin-top: 12px' : ''"
		>
			<template
				v-for="(device, index) in adminStore.devices"
				:key="'device' + index"
			>
				<device-item
					:device="device"
					:is-latest="index + 1 == adminStore.devices.length"
					:is-first="index == 0"
				/>
			</template>
		</div>

		<module-title
			v-if="adminStore.isAdmin || !isDemo"
			class="q-mt-xl"
			:class="{
				'q-mt-xl': deviceStore.isMobile,
				'q-mt-lg': !deviceStore.isMobile
			}"
		>
			{{ t('security') }}
		</module-title>

		<BtList v-if="adminStore.isAdmin || !isDemo">
			<bt-form-item
				:title="t('change_password')"
				@click="updatePassword"
				:margin-top="false"
				:chevron-right="true"
			/>
			<bt-form-item :title="t('forcing_vpn_access_to_private_network')">
				<bt-switch
					truthy-track-color="blue-default"
					:model-value="headScaleStore.headScaleStatus"
					@update:model-value="setHeadScaleToggle"
				/>
			</bt-form-item>
			<bt-form-item :title="t('allow_ssh_via_vpn')">
				<bt-switch
					truthy-track-color="blue-default"
					:model-value="aclStore.allow_ssh"
					:disable="aclStore.state === ActionType.APPLYING"
					@update:model-value="setAclToggle"
				/>
			</bt-form-item>
			<bt-form-item
				:title="t('check_network_authority_policy')"
				@click="gotoPage('/authority')"
				:chevron-right="true"
				:width-separator="false"
			/>
		</BtList>
		<BtList>
			<bt-form-item
				@click="gotoPage('/active_session')"
				:title="t('view_the_active_session_of_the_vault')"
				:chevron-right="true"
			/>

			<bt-form-item
				:title="t('view_the_headScale_connection_status')"
				@click="gotoPage('/active_headscale')"
				:chevron-right="true"
			/>

			<bt-form-item
				:title="t('view_the_list_of_sso_authorization_tokens')"
				@click="gotoPage('/sso_token')"
				:width-separator="userInfo && userInfo?.wizard_complete"
				:chevron-right="true"
			/>

			<bt-form-item
				v-if="userInfo?.wizard_complete"
				:title="t('view_login_history')"
				:width-separator="false"
				:chevron-right="true"
				@click="goLoginHistory"
			/>
		</BtList>
	</bt-scroll-area>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAdminStore } from '../../stores/admin';
import UpdateUserPassworDialog from '../Account/dialog/UpdateUserPassworDialog.vue';
import { useQuasar } from 'quasar';
import { useUserStore } from 'src/stores/user';
import { useHeadScaleStore } from 'src/stores/headscale';
import PageTitleComponent from '../../components/PageTitleComponent.vue';
import BtFormItem from '../../components/base/BtFormItem.vue';
import SettingAvatar from 'components/base/SettingAvatar.vue';
// import SettingConnectStatus from 'components/base/SettingConnectStatus.vue';
import DeviceItem from '../../components/person/DeviceItem.vue';
import { AccountInfo } from 'src/global';
import { useI18n } from 'vue-i18n';
import { useDeviceStore } from '../../stores/device';
import BtList from '../../components/base/BtList.vue';
import ModuleTitle from '../../components/ModuleTitle.vue';
import { ActionType, useAclStore } from '../../stores/acl';

const { t } = useI18n();
const adminStore = useAdminStore();
const quasar = useQuasar();
const userStore = useUserStore();
const headScaleStore = useHeadScaleStore();
const aclStore = useAclStore();
const router = useRouter();
const deviceStore = useDeviceStore();
const userInfo = ref<AccountInfo | undefined>();
const isDemo = computed(() => {
	return !!process.env.DEMO;
});

onMounted(async () => {
	await userStore.get_accounts();

	userInfo.value = await userStore.get_account_info(adminStore.user.name);

	await headScaleStore.getDevices();
	await headScaleStore.getHeadScaleStatus();
	await aclStore.getAclStatus();
});

function gotoPage(path: string) {
	router.push({ path });
}

const updatePassword = async () => {
	quasar.dialog({
		component: UpdateUserPassworDialog,
		componentProps: {
			name: adminStore.user.name
		}
	});
};

const goLoginHistory = () => {
	router.push({
		name: 'loginHistory',
		params: {
			name: userInfo.value?.name
		}
	});
};

const setHeadScaleToggle = async () => {
	if (!headScaleStore.headScaleStatus) {
		let total = 0;
		for (const device of headScaleStore.devices) {
			if (device.online) {
				total += 1;
			}
		}
		if (total < 3) {
			quasar.notify({
				message: t(
					'you_need_at_least_3_devices_online_to_activate_headScale'
				),
				type: 'negative',
				position: 'bottom',
				timeout: 2000
			});
			return;
		}
	}
	await headScaleStore.toggleHeadScaleStatus();
	await headScaleStore.getHeadScaleStatus();
};

const setAclToggle = async () => {
	await aclStore.toggleAclStatus(!aclStore.allow_ssh);
	await aclStore.getAclStatus();
};
</script>

<style scoped lang="scss">
.avatar-layout {
	margin-top: 12px;
}

.admin-name {
	text-align: center;
	margin-top: 8px;
}
</style>
