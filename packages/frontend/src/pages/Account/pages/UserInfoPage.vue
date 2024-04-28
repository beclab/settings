<template>
	<page-title-component :show-back="true" :title="t('account_info')" />
	<bt-scroll-area class="nav-height-scroll-area-conf" v-if="userInfo">
		<div v-show="usage" class="text-subtitle1 text-text1 resource-title">
			{{ t('resource_usage') }}
		</div>
		<div
			class="row justify-between"
			style="
				grid-column-gap: 20px;
				display: grid;
				grid-template-columns: repeat(2, minmax(0, 1fr));
			"
		>
			<resource-limit
				:total="usage?.user_cpu_total"
				:usage="usage?.user_cpu_usage"
				:label="t('cpu_core')"
				unit-key="cpu"
			/>
			<resource-limit
				:total="usage?.user_memory_total"
				:usage="usage?.user_memory_usage"
				:label="t('memory_gi')"
				unit-key="memory"
			/>
		</div>

		<div class="text-subtitle1 text-text1 resource-title">
			{{ t('info') }}
		</div>

		<q-list class="q-list-class">
			<bt-form-item title="Profile Avatar" :margin-top="false">
				<q-avatar :size="`40px`">
					<TerminusAvatar
						:info="{
							terminusName: userInfo?.terminusName,
							avatar: userInfo?.avatar
						}"
						:size="40"
					/>
				</q-avatar>
			</bt-form-item>
			<bt-form-item
				:title="t('terminus_name')"
				:data="userInfo ? userInfo.terminusName : ''"
			/>
			<bt-form-item
				:title="t('email')"
				:data="userInfo ? userInfo.email : ''"
			/>
			<bt-form-item
				:title="t('state')"
				:data="
					userInfo?.wizard_complete
						? userInfo.state
						: t('waiting_onBoard')
				"
			/>
			<bt-form-item
				:title="t('last_login_time')"
				:data="
					userInfo.last_login_time
						? getLocalTime(userInfo.last_login_time * 1000).format(
								'YYYY-MM-DD HH:mm'
						  )
						: '--'
				"
			/>
			<bt-form-item
				:title="t('create_time')"
				:data="
					getLocalTime(userInfo.creation_timestamp * 1000).format(
						'YYYY-MM-DD HH:mm'
					)
				"
			/>
			<bt-form-item
				:title="t('roles')"
				:width-separator="false"
				:data="
					userInfo
						? userInfo.roles.length
							? getRoleName(userInfo.roles.join('/'))
							: ''
						: ''
				"
			/>
		</q-list>

		<q-list
			v-if="
				!userInfo?.wizard_complete &&
				adminStore.isAdmin &&
				accountIsNotMe
			"
			class="q-list-class"
		>
			<bt-form-item
				:title="t('reset_password')"
				:chevronRight="true"
				:margin-top="false"
				:width-separator="false"
				@click="resetPassword"
			/>
		</q-list>

		<q-list v-if="!userInfo?.wizard_complete" class="q-list-class">
			<bt-form-item
				:title="t('wizard_url')"
				:data="`https://wizard-${userInfo?.name}.${url_domain}`"
				:width-separator="false"
			/>
		</q-list>

		<q-list v-if="userInfo?.wizard_complete" class="q-list-class">
			<div v-if="adminStore.isAdmin">
				<div v-if="accountIsNotMe">
					<bt-form-item
						:title="t('reset_password')"
						:margin-top="false"
						:width-separator="false"
						:chevron-right="true"
						@click="resetPassword"
					/>
				</div>
				<div v-else>
					<bt-form-item
						:title="t('change_password')"
						:margin-top="false"
						:width-separator="false"
						:chevron-right="true"
						@click="updatePassword"
					/>
				</div>
			</div>
			<div v-else>
				<bt-form-item
					:title="t('change_password')"
					:margin-top="false"
					:width-separator="false"
					:chevron-right="true"
					@click="updatePassword"
				/>
			</div>
		</q-list>

		<div class="row justify-end" style="margin-top: 24px">
			<ListBottomFuncBtn
				v-if="adminStore.isAdmin && accountIsNotMe"
				@funcClick="deleteUser"
				:title="t('delete_user')"
				style="margin-right: 20px"
			/>

			<ListBottomFuncBtn
				v-if="adminStore.isAdmin && accountIsNotMe"
				@funcClick="changeQuota"
				:title="t('modify_limits')"
				style="margin-right: 20px"
			/>
		</div>
	</bt-scroll-area>
</template>

<script setup lang="ts">
import { useUserStore, UserUsage } from 'src/stores/User';
import { useTokenStore } from 'src/stores/token';
import { onUnmounted, ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ListBottomFuncBtn from '../../../components/ListBottomFuncBtn.vue';
import { getLocalTime } from 'src/utils';
import ReminderDialogComponent from '../../../components/ReminderDialogComponent.vue';
import UpdateUserQutoaDialog from './dialog/UpdateUserQutoaDialog.vue';
import { useQuasar, Loading } from 'quasar';
import UpdateUserPassworDialog from '../dialog/UpdateUserPassworDialog.vue';
import { AccountInfo, AccountModifyStatus, AccountStatus } from 'src/global';
import PageTitleComponent from 'components/PageTitleComponent.vue';
import ResourceLimit from 'components/user/ResourceLimit.vue';
import BtFormItem from 'components/base/BtFormItem.vue';
import { getRoleName } from 'src/utils/constants';
import { useAdminStore } from 'src/stores/Admin';
import { generatePasword } from '../utils';
import { useI18n } from 'vue-i18n';

const userStore = useUserStore();
const tokenStore = useTokenStore();
const adminStore = useAdminStore();
const { t } = useI18n();

const url_domain = computed(() => {
	let url = tokenStore.url?.split('.').slice(1).join('.');
	if (url?.startsWith('local.')) {
		url = url.substring(6);
	}
	return url;
});

const quasar = useQuasar();
const Route = useRoute();
const router = useRouter();

const userInfo = ref<AccountInfo | undefined>(
	userStore.getUserByName(Route.params.name as string)
);
const usage = ref<UserUsage | undefined>(undefined);

async function changeQuota() {
	quasar
		.dialog({
			component: UpdateUserQutoaDialog,
			componentProps: {
				cpu: userInfo.value?.cpu_limit,
				memory: Number(
					userInfo.value?.memory_limit.slice(
						0,
						userInfo.value?.memory_limit.length - 1
					)
				)
			}
		})
		.onOk(async (data) => {
			if (!userInfo.value) {
				return;
			}
			try {
				await userStore.update_account_quoto(userInfo.value.name, {
					memory_limit: data.memoryLimit + 'G',
					cpu_limit: data.cpuLimit
				});
				userStore
					.get_account_info(Route.params.name as string)
					.then((data) => {
						userInfo.value = data;
					});
			} catch (e: any) {
				/* empty */
			}
		});
}

const accountIsNotMe = computed(() => {
	if (userInfo.value && userInfo.value.name != adminStore.user.name) {
		return true;
	}

	return false;
});

let checkAccountDeleteProgress: any = null;

const deleteUser = () => {
	if (!userInfo.value) {
		return;
	}

	quasar
		.dialog({
			component: ReminderDialogComponent,
			componentProps: {
				title: t('delete_item', {
					item: userInfo.value.name
				}),
				message: t('delete_user_message', {
					account: userInfo.value.name
				}),
				useCancel: true
			}
		})
		.onOk(() => {
			deleteUserSureAction();
		});
};

const deleteUserSureAction = async () => {
	if (!userInfo.value) {
		return;
	}
	const userName = userInfo.value.name;
	Loading.show();
	try {
		await userStore.delete_account(userName);
		checkAccountDeleteProgress = setInterval(async () => {
			checkAccountDelete(userName);
		}, 4 * 1000);
	} catch (error: any) {
		console.log(error);
		Loading.hide();
	}
};

async function checkAccountDelete(username: string) {
	try {
		const data: AccountModifyStatus = await userStore.get_account_status(
			username
		);
		if (data.status == AccountStatus.Deleted) {
			if (checkAccountDeleteProgress) {
				clearInterval(checkAccountDeleteProgress);
			}
			userStore.removeLocalAccount(username);
			setTimeout(() => {
				Loading.hide();
				router.replace('/account');
			}, 4 * 1000);
		}
	} catch (e) {
		/* empty */
	}
}

const updatePassword = () => {
	quasar.dialog({
		component: UpdateUserPassworDialog,
		componentProps: Route.params
	});
};

const resetPassword = async () => {
	if (!userInfo.value) {
		return;
	}
	const password = generatePasword();
	try {
		await userStore.reset_account_password({
			password: password,
			current_password: '',
			username: userInfo.value?.name
		});
		quasar.dialog({
			component: ReminderDialogComponent,
			componentProps: {
				title: t('reset_password_successfully'),
				message: t('new_password_is', {
					password
				}),
				useCancel: false
			}
		});
	} catch (error: any) {
		if (error) {
			quasar.notify(error.message);
		}
	}
};

async function updateUserInfo(username: string) {
	try {
		userInfo.value = userStore.getUserByName(Route.params.name as string);
		userStore.update_account_info(username);

		if (userInfo.value?.roles.find((r) => r === 'platform-admin')) {
			userStore.get_admin_account_useage().then((res) => {
				usage.value = res;
			});
		} else {
			userStore.get_account_useage(username).then((res) => {
				usage.value = res;
			});
		}
	} catch (e) {
		console.log(e);
	}
}

watch(
	() => Route.params.name,
	async (val) => {
		const username = val as string;
		await updateUserInfo(username);
	}
);

onMounted(() => {
	const username = Route.params.name as string;
	updateUserInfo(username);
});

onUnmounted(() => {
	if (checkAccountDeleteProgress) {
		clearInterval(checkAccountDeleteProgress);
		checkAccountDeleteProgress = null;
	}
});
</script>

<style scoped lang="scss">
.resource-title {
	margin-top: 12px;
	margin-bottom: 8px;
}
</style>
