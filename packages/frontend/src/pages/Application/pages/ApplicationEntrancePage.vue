<template>
	<page-title-component :show-back="true" :title="application?.title" />

	<bt-scroll-area class="nav-height-scroll-area-conf">
		<bt-list>
			<bt-form-item
				:title="t('domain_setup')"
				:margin-top="false"
				:chevron-right="true"
				@click="gotoDomainSetup"
				:width-separator="false"
			/>
		</bt-list>

		<ModuleTitle
			class="q-mb-sm"
			:class="{
				'q-mt-xl ': deviceStore.isMobile,
				'q-mt-md': !deviceStore.isMobile
			}"
		>
			{{ t('setup_access_policies') }}
		</ModuleTitle>

		<bt-list v-if="adminStore.isAdmin || !isDemo">
			<bt-form-item :title="t('auth_level')">
				<bt-select
					v-model="authorizationLevel"
					:options="authLevelOptions()"
				/>
			</bt-form-item>
			<bt-form-item
				:title="t('second_factor_model')"
				:margin-top="false"
				:width-separator="factorMode === FACTOR_MODEL.Two"
			>
				<bt-select
					v-model="factorMode"
					:options="factorModelOptions()"
				/>
			</bt-form-item>

			<bt-form-item
				v-if="factorMode === FACTOR_MODEL.Two"
				:title="t('one_time')"
			>
				<bt-switch
					truthy-track-color="blue-default"
					v-model="oneTimeMode"
				/>
			</bt-form-item>

			<error-message-tip
				:is-error="validDuration < 0 || validDuration > 100"
				:error-message="t('errors.please_enter_a_valid_number')"
				:width-separator="false"
			>
				<bt-form-item
					v-if="factorMode === FACTOR_MODEL.Two"
					:title="t('valid_duration')"
					:width-separator="false"
				>
					<bt-time-picker
						v-model="validDuration"
						unit=" s"
						:input-disabled="true"
					/>
				</bt-form-item>
			</error-message-tip>
		</bt-list>

		<bt-list>
			<policies-card v-model:policies="sub_policies" />
		</bt-list>

		<div class="row justify-end">
			<q-btn
				dense
				class="confirm-btn submit-btn-margin q-px-md"
				:disable="isLoading || resultCode === 3"
				:label="t('submit')"
				@click="onSubmit"
			/>
		</div>
	</bt-scroll-area>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useApplicationStore } from '../../../stores/application';
import PageTitleComponent from '../../../components/PageTitleComponent.vue';
import BtFormItem from '../../../components/base/BtFormItem.vue';
import BtSelect from '../../../components/base/BtSelect.vue';
import {
	AUTH_LEVEL,
	authLevelOptions,
	EntrancePolicy,
	FACTOR_MODEL,
	factorModelOptions
} from '../../../utils/constants';
import PoliciesCard from '../../../components/application/PoliciesCard.vue';
import BtTimePicker from '../../../components/base/BtTimePicker.vue';
import ErrorMessageTip from '../../../components/base/ErrorMessageTip.vue';
import { notifyFailed, notifyWarning } from '../../../utils/btNotify';
import { useI18n } from 'vue-i18n';
// import { useDeviceStore } from '../../../stores/device';
import BtList from '../../../components/base/BtList.vue';
import _ from 'lodash';
import { useDeviceStore } from '../../../stores/device';
import ModuleTitle from '../../../components/ModuleTitle.vue';

import { useAdminStore } from '../../../stores/admin';

const adminStore = useAdminStore();
const isDemo = computed(() => {
	return !!process.env.DEMO;
});

const { t } = useI18n();

const applicationStore = useApplicationStore();
const Route = useRoute();
const router = useRouter();
// const deviceStore = useDeviceStore();

const application = ref(
	applicationStore.getApplicationById(Route.params.name as string)
);

const application_name = ref(Route.params.name as string);
const entrance_name = Route.params.entrance as string;

const authorizationLevel = ref();
const factorMode = ref();
const oneTimeMode = ref(true);
const validDuration = ref(0);
const sub_policies = ref<EntrancePolicy[]>([]);

const oldAuthorizationLevel = ref();
const oldFactorMode = ref();
const oldOnTimeMode = ref(false);
const oldValidDuration = ref(0);
const oldSubPolicies = ref<EntrancePolicy[]>([]);
const isLoading = ref(true);
const deviceStore = useDeviceStore();

const gotoDomainSetup = () => {
	router.push(
		'/application/domain/' + application.value?.name + '/' + entrance_name
	);
};

onMounted(async () => {
	if (!(application_name.value in applicationStore.entrances)) {
		await applicationStore.getEntrances(application_name.value);
	}

	await updateFactorModel();
	await updateAuthLevel();
	isLoading.value = false;
});

async function onSubmitFactorModel() {
	const params = {
		default_policy: factorMode.value,
		one_time: oneTimeMode.value,
		valid_duration: validDuration.value,
		sub_policies: sub_policies.value.length <= 0 ? null : sub_policies.value
	};
	let findEmptyIndex = sub_policies.value.findIndex((item) => !item.uri);
	if (findEmptyIndex > -1) {
		notifyWarning(
			t('the_item_index_is_empty', {
				index: findEmptyIndex + 1
			})
		);
		return;
	}

	await applicationStore.set_appFa2(
		params,
		application.value?.name,
		entrance_name
	);

	await updateFactorModel();
}

async function updateFactorModel() {
	const res = await applicationStore.getPolicy(
		application.value?.name,
		entrance_name
	);
	factorMode.value = res.default_policy;
	oneTimeMode.value = res.one_time;
	validDuration.value = res.valid_duration;
	sub_policies.value = res.sub_policies || [];

	oldFactorMode.value = res.default_policy;
	oldOnTimeMode.value = res.one_time;
	oldValidDuration.value = res.valid_duration;
	oldSubPolicies.value = _.cloneDeep(res.sub_policies || []);
}

async function onSubmitAuthLevel() {
	if (
		!authorizationLevel.value ||
		authLevelOptions().find((e) => e.value == authorizationLevel.value) ==
			undefined
	) {
		notifyWarning(
			t('auth_level_is_error_error', {
				error: authorizationLevel.value
			})
		);
		return;
	}

	await applicationStore.setupAuthLevel(
		application.value?.name,
		entrance_name,
		{
			authorization_level: authorizationLevel.value
		}
	);

	await updateAuthLevel();
}

async function updateAuthLevel() {
	const res =
		applicationStore.entrances[application_name.value][entrance_name];

	authorizationLevel.value = res.authLevel || AUTH_LEVEL.Public;
	oldAuthorizationLevel.value = res.authLevel || AUTH_LEVEL.Public;
}

const resultCode = computed(() => {
	const condition1 = oldAuthorizationLevel.value == authorizationLevel.value;

	const condition2 =
		oldOnTimeMode.value == oneTimeMode.value &&
		oldFactorMode.value == factorMode.value &&
		oldValidDuration.value == validDuration.value &&
		JSON.stringify(oldSubPolicies.value) ===
			JSON.stringify(sub_policies.value);

	console.log(oldSubPolicies.value);
	console.log(sub_policies.value);

	const result = (condition1 ? 2 : 0) | (condition2 ? 1 : 0);
	console.log(result);
	return result;
});

async function onSubmit() {
	isLoading.value = true;
	try {
		switch (resultCode.value) {
			case 0:
				await onSubmitAuthLevel();
				await onSubmitFactorModel();
				return;
			case 1:
				await onSubmitAuthLevel();
				return;
			case 2:
				await onSubmitFactorModel();
				return;
		}
	} catch (e: any) {
		notifyFailed(e.message);
	} finally {
		isLoading.value = false;
	}
}
</script>

<style scoped lang="scss">
.submit-btn-margin {
	margin-top: 20px;
}
</style>
