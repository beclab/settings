<template>
	<q-dialog ref="dialogRef" @hide="onDialogCancel">
		<div class="common-dialog" style="border-radius: 16px">
			<DialogHeader
				:title="t('create_account')"
				@close-action="onDialogCancel"
			/>
			<div class="dialog-content-root">
				<terminus-edit
					v-model="userName"
					:label="t('olares_ID')"
					:show-password-img="false"
					style="width: 100%"
					class=""
					:is-error="
						userName.length > 0 && usernameRule(userName).length > 0
					"
					:error-message="usernameRule(userName)"
				/>

				<terminus-edit
					v-model="cpuLimit"
					label="CPU"
					:show-password-img="false"
					class="q-mt-md"
					:is-error="
						cpuLimit.length > 0 && cpuLimitRule(cpuLimit).length > 0
					"
					:error-message="cpuLimitRule(cpuLimit)"
				>
					<template v-slot:right>
						<edit-number-right-slot
							v-model="cpuLimit"
							label="core"
						/>
					</template>
				</terminus-edit>

				<terminus-edit
					v-model="memoryLimit"
					label="Memory"
					:show-password-img="false"
					class="q-mt-md"
					:is-error="
						memoryLimit.length > 0 &&
						memoryLimitRule(memoryLimit).length > 0
					"
					:error-message="memoryLimitRule(memoryLimit)"
				>
					<template v-slot:right>
						<edit-number-right-slot
							v-model="memoryLimit"
							label="GB"
						/>
					</template>
				</terminus-edit>

				<dialog-footer
					:confirm-text="t('save')"
					:confirm-disable="!enableCreate"
					@cancel-action="onDialogCancel"
					@confirm-action="createUserName"
				/>
			</div>
		</div>
	</q-dialog>
</template>

<script setup lang="ts">
import {
	useDialogPluginComponent,
	useQuasar,
	Loading,
	copyToClipboard
} from 'quasar';
import { ref, onUnmounted, computed } from 'vue';
import DialogHeader from '../../../components/DialogHeader.vue';
import DialogFooter from '../../../components/DialogFooter.vue';
import ReminderDialogComponent from '../../../components/ReminderDialogComponent.vue';
import { useUserStore } from '../../../stores/User';
import { AccountModifyStatus, AccountStatus } from '../../../global';
import { useDIDStore } from '../../../stores/did';
import { useAdminStore } from '../../../stores/Admin';
import { generatePasword } from '../utils';
import TerminusEdit from '../../../components/base/TerminusEdit.vue';
import EditNumberRightSlot from '../../../components/EditNumberRightSlot.vue';
import { useI18n } from 'vue-i18n';
import { notifyFailed, notifySuccess } from '../../../utils/btNotify';

const { t } = useI18n();

const PASSWORD_RULE = {
	LENGTH_RULE: '^.{8,32}$',
	LOWERCASE_RULE: '^(?=.*[a-z])',
	UPPERCASE_RULE: '^(?=.*[A-Z])',
	DIGIT_RULE: '^(?=.*[0-9])',
	SYMBOL_RULE: '^(?=.*[@$!%*?&_.])',
	ALL_RULE:
		'^(.*[a-z].*[A-Z].*[0-9].*)$|^(.*[a-z].*[0-9].*[A-Z].*)$|^(.*[A-Z].*[a-z].*[0-9].*)$|^(.*[A-Z].*[0-9].*[a-z].*)$|^(.*[0-9].*[a-z].*[A-Z].*)$|^(.*[0-9].*[A-Z].*[a-z].*)$|^(\$2[ayb]\$.{56})$'
};
const allRule = new RegExp(PASSWORD_RULE.ALL_RULE);

const userName = ref('');
// const email = ref('');

const cpuLimit = ref('1');
const memoryLimit = ref('4');

const accountStore = useUserStore();
const didStore = useDIDStore();
const adminStore = useAdminStore();

const quasar = useQuasar();

let password = '';

const role = 'workspaces-manager';

let checkAccountCreateProgress: any = null;

const createUserName = async () => {
	if (userName.value.length === 0) {
		return;
	}

	password = generatePasword();

	while (!allRule.test(password)) {
		password = generatePasword();
	}
	Loading.show();
	const data = await didStore.resolve_name(adminStore.terminus.terminusName);
	if (!data) {
		notifyFailed(t('olares_id_not_exists_on_blockchain'));
		Loading.hide();
		return;
	}

	try {
		await accountStore.create_account({
			name: userName.value,
			description: '',
			email: '',
			display_name: '',
			owner_role: role,
			password: password,
			cpu_limit: '' + cpuLimit.value,
			memory_limit: '' + memoryLimit.value + 'G'
		});

		checkAccountCreateProgress = setInterval(async () => {
			checkAccountCreate(userName.value);
		}, 4 * 1000);
	} catch (error: any) {
		Loading.hide();
	}
};
/**
 * check wait creat account state
 * @param username
 */
async function checkAccountCreate(username: string) {
	try {
		const data: AccountModifyStatus = await accountStore.get_account_status(
			username
		);

		if (data.status == AccountStatus.Created) {
			Loading.hide();
			if (checkAccountCreateProgress) {
				clearInterval(checkAccountCreateProgress);
				checkAccountCreateProgress = null;
			}

			const message =
				t('olares_ID') +
				':' +
				userName.value +
				'<br>' +
				t('original_password') +
				':' +
				password +
				'<br>' +
				t('wizard_url') +
				':' +
				'https://' +
				data.address.wizard;

			quasar
				.dialog({
					component: ReminderDialogComponent,
					componentProps: {
						title: t('user_had_been_created', {
							username
						}),
						message,
						useCancel: false,
						confirmText: t('copy'),
						hasBorder: true
					}
				})
				.onOk(() => {
					onDialogOK();
					copyToClipboard(message.replace(/<br>/g, '\r\n')).then(
						() => {
							notifySuccess(t('copy_successfully'));
						}
					);
					dialogRef.value?.hide();
				});
		}
	} catch (e: any) {
		Loading.hide();
		if (checkAccountCreateProgress) {
			clearInterval(checkAccountCreateProgress);
			checkAccountCreateProgress = null;
		}
	}
}

const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const usernameRule = (val: string) => {
	if (val.length === 0) {
		return t('errors.username_is_empty');
	}
	let u = accountStore.accounts.find((item) => item.name == val);
	if (u) {
		return t('errors.username_already_registered');
	} else {
		return '';
	}
};

// const emailRule = (val: string) => {
// 	if (val.length === 0) {
// 		return t('errors.email_is_empty');
// 	}
// 	let a = accountStore.accounts.find((item) => item.email == val);
// 	if (a) {
// 		return t('errors.email_already_registered');
// 	}
// 	return '';
// };

const cpuLimitRule = (val: string) => {
	if (val.length === 0) {
		return t('errors.cpu_limit_is_empty');
	}
	let rule = /^[+-]?(\d+\.?\d*|\.\d+)$/;
	if (!rule.test(val)) {
		return t('errors.only_valid_numbers_can_be_entered');
	}
	return '';
};

const memoryLimitRule = (val: string) => {
	if (val.length === 0) {
		return t('errors.memory_limit_is_empty');
	}
	let rule = /^[+-]?(\d+\.?\d*|\.\d+)$/;
	if (!rule.test(val)) {
		return t('errors.only_valid_numbers_can_be_entered');
	}
	return '';
};

const enableCreate = computed(() => {
	return (
		usernameRule(userName.value).length == 0 &&
		// emailRule(email.value).length == 0 &&
		cpuLimitRule(cpuLimit.value).length == 0 &&
		memoryLimitRule(memoryLimit.value).length == 0
	);
});

onUnmounted(() => {
	if (checkAccountCreateProgress) {
		clearInterval(checkAccountCreateProgress);
		checkAccountCreateProgress = null;
	}
});
</script>

<style scoped lang="scss">
.cpu-core {
	text-align: right;
}
</style>
