<template>
	<bt-custom-dialog
		ref="CustomRef"
		:title="t('mount_network_drive')"
		:skip="false"
		:ok="step == 1 ? t('next') : t('confirm')"
		size="medium"
		:cancel="step == 1 ? t('previous') : false"
		:okDisabled="!enableCreate"
		:platform="deviceStore.platform"
		@onSubmit="step == 1 ? createAccount() : onDialogOK()"
		@onCancel="previousAction"
	>
		<div v-if="step == 1">
			<IntegrationAddInputs
				ref="integrationAddInputs"
				:account-type="accountType"
				v-model:button-status="enableCreate"
			/>
		</div>
		<div v-else-if="step == 2">
			<div class="text-body3 text-ink-2">
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
					{{ t('Object Storage') }}
				</div>
				<div class="row items-center justify-end">
					<q-img
						:src="
							getRequireImage(`integration/${accountInfo.icon}`)
						"
						width="32px"
						height="32px"
					/>
					<div class="text-subtitle2 text-ink-1 q-ml-sm">
						{{ accountInfo.name }}
					</div>
				</div>
			</div>
		</div>
	</bt-custom-dialog>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { PropType, ref } from 'vue';

import { useI18n } from 'vue-i18n';
import AddIntegrationDialog from './AddIntegrationDialog.vue';
import integrationService from '../../../services/integration/index';
import { getRequireImage } from '../../../utils/helper';
import { useIntegrationStore } from '../../../stores/integration';
import { AccountType } from '@bytetrade/core';

import IntegrationAddInputs from '../components/IntegrationAddInputs.vue';
import { notifyFailed } from '../../../utils/btNotify';
import { useDeviceStore } from '../../../stores/device';

const props = defineProps({
	accountType: {
		type: Object as PropType<AccountType>
	}
});

const { t } = useI18n();

const $q = useQuasar();

const step = ref(1);

const integrationStore = useIntegrationStore();

const integrationAddInputs = ref();

const CustomRef = ref();

const deviceStore = useDeviceStore();

const accountInfo = ref(
	integrationService.supportAuthList.find((e) => e.type == props.accountType)!
		.detail
);

const previousAction = () => {
	$q.dialog({
		component: AddIntegrationDialog
	}).onOk(() => {});
};

const enableCreate = ref(false);
const createAccount = async () => {
	const inputs = integrationAddInputs.value.allAccountValues();
	try {
		await integrationStore.createAccount(inputs);
		step.value = 2;
	} catch (error) {
		console.log(error);
		notifyFailed(error.message);
	}
};

const onDialogOK = () => {
	CustomRef.value.onDialogOK();
};
</script>

<style scoped lang="scss">
.cpu-core {
	text-align: right;
}

.item-content {
	height: 56px;
	width: 100%;
	border: 1px solid $separator;
	border-radius: 12px;
}
</style>
