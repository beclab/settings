<template>
	<page-title-component :show-back="true" :title="t('add_backup')" />
	<bt-scroll-area class="nav-height-scroll-area-conf">
		<bt-form v-model:can-submit="canSubmit">
			<q-list
				:class="
					deviceStore.isMobile ? 'mobile-items-list' : 'q-list-class'
				"
			>
				<error-message-tip
					:is-error="
						location === BackupLocation.TerminusCloud &&
						!accountStore.space_account
					"
					:error-message="
						t(
							'errors.you_are_not_logged_in_olares_space_yet_click_here_to'
						)
					"
					:link-message="t('login.title')"
					@on-link-click="gotoTerminusSpaceLogin"
				>
					<bt-form-item
						title="Backup Location"
						:margin-top="false"
						:width-separator="false"
					>
						<bt-select
							v-model="location"
							:options="locationOptions"
						/>
					</bt-form-item>
				</error-message-tip>
				<error-message-tip
					:is-error="!nameRule"
					:error-message="t('errors.naming_is_not_compliant')"
					:with-popup="true"
				>
					<bt-form-item
						:title="t('backup_name')"
						:width-separator="false"
					>
						<bt-edit-view
							style="width: 200px"
							v-model="name"
							:right="true"
							:placeholder="t('please_input_the_backup_name')"
						/>
					</bt-form-item>
				</error-message-tip>
				<div v-if="location === BackupLocation.S3">
					<bt-form-item :title="t('region')">
						<error-message-tip
							:is-error="s3_region.length === 0"
							:error-message="t('errors.please_type_something')"
						>
							<bt-edit-view
								style="width: 200px"
								v-model="s3_region"
								:right="true"
								:placeholder="t('please_enter_a_uri')"
							/>
						</error-message-tip>
					</bt-form-item>

					<bt-form-item :title="t('backup_name')">
						<error-message-tip
							:is-error="s3_bucket.length === 0"
							:error-message="t('errors.please_type_something')"
						>
							<bt-edit-view
								style="width: 200px"
								v-model="s3_bucket"
								:right="true"
								:placeholder="t('please_enter_a_uri')"
							/>
						</error-message-tip>
					</bt-form-item>

					<bt-form-item :title="t('s3_url')">
						<error-message-tip
							:is-error="s3_url.length === 0"
							:error-message="t('errors.please_type_something')"
						>
							<bt-edit-view
								style="width: 200px"
								v-model="s3_url"
								:right="true"
								:placeholder="t('please_enter_a_uri')"
							/>
						</error-message-tip>
					</bt-form-item>

					<bt-form-item :title="t('s3_prefix')">
						<error-message-tip
							:is-error="s3_prefix.length === 0"
							:error-message="t('errors.please_type_something')"
						>
							<bt-edit-view
								style="width: 200px"
								v-model="s3_prefix"
								:right="true"
								:placeholder="t('please_enter_a_uri')"
							/>
						</error-message-tip>
					</bt-form-item>

					<bt-form-item :title="t('s3_accessKey')">
						<error-message-tip
							:is-error="s3_accessKey.length === 0"
							:error-message="t('errors.please_type_something')"
						>
							<bt-edit-view
								style="width: 200px"
								v-model="s3_accessKey"
								:right="true"
								:placeholder="t('please_enter_a_uri')"
							/>
						</error-message-tip>
					</bt-form-item>

					<bt-form-item :title="t('s3_secretKey')">
						<error-message-tip
							:is-error="s3_secretKey.length === 0"
							:error-message="t('errors.please_type_something')"
						>
							<bt-edit-view
								style="width: 200px"
								v-model="s3_secretKey"
								:right="true"
								:placeholder="t('please_enter_a_uri')"
							/>
						</error-message-tip>
					</bt-form-item>
				</div>

				<bt-form-item :title="t('snapshot_frequency')">
					<bt-select
						v-model="frequency"
						:options="frequencyOptions"
					/>
				</bt-form-item>

				<bt-form-item :title="t('run_backup_at')">
					<div class="row items-center justify-end">
						<bt-select
							v-model="weekDay"
							:options="weekOption"
							v-if="frequency == BackupFrequency.Weekly"
						/>

						<div class="text-body2 text-ink-1 q-ml-md">
							{{ time }}
						</div>

						<q-icon
							size="20px"
							name="sym_r_access_time"
							color="ink-1"
							class="time-clock"
						>
							<q-popup-proxy
								transition-show="jump-down"
								transition-hide="jump-up"
							>
								<q-time v-model="time">
									<div class="row items-center justify-end">
										<q-btn
											v-close-popup
											:label="t('close')"
											color="primary"
											flat
										/>
									</div>
								</q-time>
							</q-popup-proxy>
						</q-icon>
					</div>
				</bt-form-item>
				<error-message-tip :is-error="password.length < 4">
					<bt-form-item :width-separator="false">
						<template v-slot:title>
							<div class="column">
								<div>{{ t('backup_password') }}</div>
								<div class="row" v-if="!deviceStore.isMobile">
									<div
										style="width: 16px; height: 16px"
										class="row items-center justify-center"
									>
										<q-icon
											:name="
												password.length >= 4
													? 'sym_r_check'
													: 'sym_r_clear'
											"
											class="text-ink-3"
											size="16px"
										/>
									</div>
									<div class="text-body3 text-ink-3">
										{{
											t('must_have_at_least_4_characters')
										}}
									</div>
								</div>
							</div>
						</template>

						<bt-edit-view
							v-model="password"
							:is-password="true"
							style="width: 200px"
							:right="true"
							:placeholder="t('please_enter_a_password')"
						/>
					</bt-form-item>
					<template v-slot:reminder v-if="deviceStore.isMobile">
						<div
							class="row bg-background-3 items-center q-mb-sm q-px-xs"
							style="
								width: 100%;
								height: 24px;
								border-radius: 4px;
							"
						>
							<div
								style="width: 16px; height: 16px"
								class="row items-center justify-center"
							>
								<q-icon
									:name="
										password.length >= 4
											? 'sym_r_check'
											: 'sym_r_clear'
									"
									class="text-ink-3"
									size="16px"
								/>
							</div>
							<div class="q-ml-sm text-overline-m text-ink-3">
								{{ t('must_have_at_least_4_characters') }}
							</div>
						</div>
					</template>
				</error-message-tip>
				<error-message-tip
					:is-error="password2.length === 0 || password !== password2"
					:error-message="t('errors.passwords_are_inconsistent')"
					:width-separator="false"
					:with-popup="true"
				>
					<bt-form-item
						:title="t('confirm_password')"
						:width-separator="false"
					>
						<bt-edit-view
							v-model="password2"
							:is-password="true"
							style="width: 200px"
							:right="true"
							:placeholder="t('please_confirm_a_password')"
						/>
					</bt-form-item>
				</error-message-tip>
			</q-list>
		</bt-form>
		<div class="row justify-end">
			<q-btn
				dense
				class="submit-btn"
				:disable="!canSubmit"
				:label="t('submit')"
				@click="onSubmit"
				color="primary"
			/>
		</div>
	</bt-scroll-area>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useBackup2Store } from '../../../stores/backup2';
import {
	BackupLocation,
	BackupFrequency,
	BackupCreateReq
} from '@bytetrade/core';
import { useAccountStore } from '../../../stores/account';
import {
	frequencyOptions,
	locationOptions,
	weekOption
} from '../../../utils/constants';
import PageTitleComponent from '../../../components/PageTitleComponent.vue';
import ErrorMessageTip from '../../../components/base/ErrorMessageTip.vue';
import BtForm from '../../../components/base/BtForm.vue';
import BtSelect from '../../../components/base/BtSelect.vue';
import BtFormItem from '../../../components/base/BtFormItem.vue';
import BtEditView from '../../../components/base/BtEditView.vue';
import { timeToTimeStemp } from './FormatBackupTime';
import { useI18n } from 'vue-i18n';
import { notifyFailed } from '../../../utils/btNotify';
import { useDeviceStore } from '../../../stores/device';

const { t } = useI18n();

const $q = useQuasar();
const backupStore = useBackup2Store();
const accountStore = useAccountStore();
const router = useRouter();
const deviceStore = useDeviceStore();

const location = ref(BackupLocation.TerminusCloud);
const name = ref('');
// const startPattern = new RegExp('^[a-z]');
// const contentPattern = new RegExp('^[a-z0-9-]*$');
// const endPattern = new RegExp('[a-z0-9]$');
const nameRule = computed(() => {
	return (
		// startPattern.test(name.value) &&
		// contentPattern.test(name.value) &&
		// endPattern.test(name.value) &&
		name.value.length > 0
	);
});
const frequency = ref(BackupFrequency.Daily);
const weekDay = ref(0);

const time = ref('03:00');
const password = ref('');
const password2 = ref('');

const s3_region = ref('');
const s3_bucket = ref('');
const s3_url = ref('');
const s3_prefix = ref('');
const s3_accessKey = ref('');
const s3_secretKey = ref('');
const canSubmit = ref(false);

function gotoTerminusSpaceLogin() {
	router.push({ path: '/integration/login/space' });
}

async function onSubmit() {
	if (
		location.value == BackupLocation.TerminusCloud &&
		!accountStore.space_account
	) {
		$q.dialog({
			title: t('login_teminus_space'),
			message: `<div>${t(
				'you_are_not_logged_in_olares_space_yet'
			)}</div>`,
			html: true,
			cancel: true,
			persistent: true
		}).onOk(async () => {
			try {
				router.push({ path: '/integration/login/space' });
			} catch (e) {
				console.log(e);
			}
		});

		return;
	}

	if (password.value != password2.value) {
		notifyFailed(t('errors.the_two_passwords_entered_are_inconsistent'));
		return;
	}
	const realTime = timeToTimeStemp(time.value);

	const req: BackupCreateReq = {
		name: name.value,
		location: location.value,
		backupPolicies: {
			name: name.value,
			snapshotFrequency: frequency.value,
			timesOfDay: `${realTime}`,
			enabled: true,
			dayOfWeek: weekDay.value
		},
		password: '',
		confirmPassword: ''
	};

	if (location.value == BackupLocation.S3) {
		req.config = {
			region: s3_region.value,
			bucket: s3_bucket.value,
			s3Url: s3_url.value,
			prefix: s3_prefix.value,
			accessKey: s3_accessKey.value,
			secretKey: s3_secretKey.value
		};
	}
	$q.loading.show();
	try {
		await backupStore.SetPlanPassword(name.value, password.value);
		await backupStore.createPlan(req);
		await backupStore.getPlans();
		router.back();
	} catch (error) {
		console.log(error);
	} finally {
		$q.loading.hide();
	}
}
</script>
