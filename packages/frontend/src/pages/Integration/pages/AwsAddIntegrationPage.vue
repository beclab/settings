<template>
	<PageTitleComponent :title="titleMap[step]" />
	<bt-scroll-area class="nav-height-scroll-area-conf">
		<div v-if="step == AwsAddStep.start" class="q-mt-lg">
			<terminus-edit
				v-model="accessKeyID"
				:label="t('access_key_id')"
				:show-password-img="false"
				style="width: 100%"
			/>
			<terminus-edit
				v-model="accessKeySecret"
				class="q-mt-lg"
				:label="t('access_key_secret')"
				:show-password-img="false"
				style="width: 100%"
			/>
			<terminus-edit
				v-model="endpoint"
				class="q-mt-lg"
				:label="t('endpoint')"
				:show-password-img="false"
				style="width: 100%"
			/>
			<terminus-edit
				v-model="bucket"
				class="q-mt-lg"
				:label="t('bucket')"
				:show-password-img="false"
				:hint-text="t('optional')"
				style="width: 100%"
			/>
		</div>
		<div v-else-if="step == AwsAddStep.display">
			<div
				class="text-body3 text-ink-2 q-mt-lg"
				:class="{
					'text-body3': !deviceStore.isMobile,
					'text-body3-m': deviceStore.isMobile
				}"
			>
				{{
					t(
						'Congratulations, you have successfully mounted the object storage service!'
					)
				}}
			</div>
			<div
				class="row item-center justify-between item-content q-px-md q-mt-md"
			>
				<div
					class="text-subtitle2 text-ink-2 row items-center"
					style="height: 100%"
				>
					Object Storage
				</div>
				<div class="row items-center justify-end">
					<q-img
						:src="getRequireImage(`integration/${awss3Info.icon}`)"
						width="32px"
						height="32px"
					/>
					<div class="text-subtitle2 text-ink-1 q-ml-sm">
						{{ awss3Info.name }}
					</div>
				</div>
			</div>
		</div>
		<div class="bottom-buttons">
			<confirm-button
				:btn-title="stepMap[step]"
				bgClasses="bg-blue-default"
				bgDisabledClasses="bg-blue-2"
				textClasses="text-white"
				:btn-status="btnStatusRef"
				@onConfirm="onConfirm"
			/>
		</div>
	</bt-scroll-area>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import PageTitleComponent from '../../../components/PageTitleComponent.vue';

import { useI18n } from 'vue-i18n';
import TerminusEdit from '../../../components/base/TerminusEdit.vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import integrationService from '../../../services/integration/index';
import {
	AWSS3IntegrationAccount,
	AccountType
} from '../../../services/abstractions/integration/integrationService';
import { useIntegrationStore } from '../../../stores/integration';
import { notifyFailed } from '../../../utils/btNotify';
import ConfirmButton from '../../../components/ConfirmButton.vue';
import { ConfirmButtonStatus } from '../../../utils/constants';
import { getRequireImage } from '../../../utils/helper';
import { useDeviceStore } from '../../../stores/device';

const { t } = useI18n();

const deviceStore = useDeviceStore();

enum AwsAddStep {
	start = 1,
	display
}

const stepMap: Record<AwsAddStep, string> = {
	[AwsAddStep.start]: t('next'),
	[AwsAddStep.display]: t('confirm')
};

const titleMap: Record<AwsAddStep, string> = {
	[AwsAddStep.start]: t('mount_network_drive'),
	[AwsAddStep.display]: t('add_account')
};

const awss3Info = ref(
	integrationService.supportAuthList.find((e) => e.type == AccountType.AWSS3)!
		.detail
);

const accessKeyID = ref('');

const accessKeySecret = ref('');

const endpoint = ref('');

const $q = useQuasar();

const bucket = ref('');
const integrationStore = useIntegrationStore();
const router = useRouter();

const accessKeyIDRule = (val: string) => {
	if (val.length === 0) {
		return t('errors.item_is_empty', {
			item: t('access_key_id')
		});
	}
	return '';
};

const accessKeySecretRule = (val: string) => {
	if (val.length === 0) {
		return t('errors.item_is_empty', {
			item: t('access_key_secret')
		});
	}
	return '';
};

const endpointRule = (val: string) => {
	if (val.length === 0) {
		return t('errors.item_is_empty', {
			item: t('endpoint')
		});
	}
	return '';
};

const btnStatusRef = computed(() => {
	return step.value == AwsAddStep.start
		? accessKeyIDRule(accessKeyID.value).length == 0 &&
		  accessKeySecretRule(accessKeySecret.value).length == 0 &&
		  endpointRule(endpoint.value).length == 0
			? ConfirmButtonStatus.normal
			: ConfirmButtonStatus.disable
		: ConfirmButtonStatus.normal;
});

const onConfirm = async () => {
	if (step.value == AwsAddStep.start) {
		$q.loading.show();
		try {
			const awss3Object: AWSS3IntegrationAccount = {
				name: accessKeyID.value,
				type: AccountType.AWSS3,
				raw_data: {
					endpoint: endpoint.value,
					bucket: bucket.value,
					refresh_token: accessKeySecret.value,
					access_token: accessKeySecret.value,
					expires_in: 0,
					expires_at: 0
				}
			};
			await integrationStore.createAccount(awss3Object);
			$q.loading.hide();
			step.value = AwsAddStep.display;
		} catch (error) {
			$q.loading.hide();
			notifyFailed(error.message);
		}
	} else {
		router.go(-2);
	}
};

const step = ref(AwsAddStep.start);
</script>

<style scoped lang="scss">
.bottom-buttons {
	position: absolute;
	left: 20px;
	bottom: 30px;
	width: calc(100% - 40px);
	// height: 40px;
}

.item-content {
	height: 56px;
	width: 100%;
	border: 1px solid $separator;
	border-radius: 12px;
}
</style>
