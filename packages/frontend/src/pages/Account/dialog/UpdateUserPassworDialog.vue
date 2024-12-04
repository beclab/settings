<template>
	<q-dialog ref="dialogRef">
		<div class="common-dialog" style="border-radius: 16px">
			<DialogHeader
				:title="t('change_password')"
				@close-action="onDialogCancel"
			></DialogHeader>
			<div class="dialog-content-root">
				<terminus-edit
					v-model="oldPassword"
					:label="t('old_password')"
					style="width: 100%"
					:show-password-img="true"
					:is-error="
						oldPassword.length > 0 &&
						oldPasswordRule(oldPassword).length > 0
					"
					:error-message="oldPasswordRule(oldPassword)"
				/>

				<terminus-edit
					v-model="newPassword"
					:label="t('new_password')"
					style="width: 100%"
					class="q-mt-lg"
					:show-password-img="true"
					:is-error="
						newPassword.length > 0 &&
						passwordRule(newPassword).length > 0
					"
					:error-message="passwordRule(newPassword)"
				/>

				<terminus-edit
					v-model="repeatPassword"
					:label="t('repeat_password')"
					style="width: 100%"
					class="q-mt-lg"
					:show-password-img="true"
					:is-error="
						repeatPassword.length > 0 &&
						repasswordRule(repeatPassword).length > 0
					"
					:error-message="repasswordRule(repeatPassword)"
				/>

				<dialog-footer
					:confirm-text="t('ok')"
					:confirm-disable="!enableSave"
					@cancel-action="onDialogCancel"
					@confirm-action="updatePassword"
				/>
			</div>
		</div>
	</q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent, useQuasar } from 'quasar';
import { computed, ref } from 'vue';
import DialogHeader from '../../../components/DialogHeader.vue';
import DialogFooter from '../../../components/DialogFooter.vue';
import { useUserStore } from '../../../stores/user';
import TerminusEdit from '../../../components/base/TerminusEdit.vue';
import { useI18n } from 'vue-i18n';

const oldPassword = ref('');
const newPassword = ref('');
const repeatPassword = ref('');

const accountStore = useUserStore();
const quasar = useQuasar();
const { t } = useI18n();

const props = defineProps({
	name: {
		type: String,
		required: false,
		default: ''
	}
});

const enableSave = computed(() => {
	return (
		oldPasswordRule(oldPassword.value).length == 0 &&
		passwordRule(newPassword.value).length == 0 &&
		repasswordRule(repeatPassword.value).length == 0
	);
});

const oldPasswordRule = (val: string) => {
	if (val.length == 0) {
		return t('errors.old_password_is_empty');
	}
	return '';
};

const passwordRule = (val: string) => {
	if (val.length < 8) return t('errors.at_least_8_digits_long');
	let rule = /^(?=.*[A-Z])(?=.*[a-z])[A-Za-z0-9@$!%*?&_.]{8,}$/;
	if (!rule.test(val)) {
		return t('errors.at_least_one_uppercase_and_lowercase_letter');
	}
	return '';
};
const repasswordRule = (val: string) => {
	if (newPassword.value.length === 0) {
		return passwordRule(val);
	}
	if (newPassword.value !== val) {
		return t('errors.repassword_do_not_match_password');
	}
	return '';
};

const updatePassword = async () => {
	if (
		oldPassword.value.length === 0 ||
		newPassword.value.length === 0 ||
		repeatPassword.value.length === 0
	) {
		return;
	}
	if (newPassword.value !== repeatPassword.value) {
		return;
	}
	try {
		await accountStore.reset_account_password({
			password: newPassword.value,
			current_password: oldPassword.value,
			username: props.name
		});
		quasar.notify(t('password_update_success'));
		dialogRef.value?.hide();
	} catch (error: any) {
		/* empty */
	}
};

const { dialogRef, onDialogCancel } = useDialogPluginComponent();
</script>
