<template>
	<q-dialog ref="dialogRef" @hide="onDialogCancel">
		<div class="common-dialog" style="border-radius: 16px">
			<DialogHeader
				:title="t('mount_network_drive')"
				@close-action="onDialogCancel"
			></DialogHeader>
			<div class="dialog-content-root">
				<div v-if="step == 1">
					<!-- <terminus-edit
						v-model="accessKeyID"
						:label="t('access_key_id')"
						:show-password-img="false"
						style="width: 100%"
					/>
					<terminus-edit
						v-model="accessKeySecret"
						class="q-mt-md"
						:label="t('access_key_secret')"
						:show-password-img="false"
						style="width: 100%"
					/>
					<terminus-edit
						v-model="endpoint"
						class="q-mt-md"
						:label="t('endpoint')"
						:show-password-img="false"
						style="width: 100%"
					/>
					<terminus-edit
						v-model="bucket"
						class="q-mt-md"
						:label="t('bucket')"
						:show-password-img="false"
						:hint-text="t('optional')"
						style="width: 100%"
					/> -->
					<IntegrationAddInputs
						ref="integrationAddInputs"
						:account-type="accountType"
						v-model:button-status="enableCreate"
					/>

					<dialog-footer
						:confirm-text="t('next')"
						:cancelText="t('previous')"
						:confirm-disable="!enableCreate"
						@cancel-action="previousAction"
						@confirm-action="createAccount"
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
									getRequireImage(
										`integration/${accountInfo.icon}`
									)
								"
								width="32px"
								height="32px"
							/>
							<div class="text-subtitle2 text-ink-1 q-ml-sm">
								{{ accountInfo.name }}
							</div>
						</div>
					</div>
					<dialog-footer
						:confirm-text="t('confirm')"
						:hasCancel="false"
						@cancel-action="previousAction"
						@confirm-action="onDialogOK"
					/>
				</div>
			</div>
		</div>
	</q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent, useQuasar } from 'quasar';
import { PropType, ref } from 'vue';
import DialogHeader from '../../../components/DialogHeader.vue';
import DialogFooter from '../../../components/DialogFooter.vue';
import { useI18n } from 'vue-i18n';
import AddIntegrationDialog from './AddIntegrationDialog.vue';
import integrationService from '../../../services/integration/index';
import { getRequireImage } from '../../../utils/helper';
import { useIntegrationStore } from '../../../stores/integration';
import { AccountType } from '@bytetrade/core';

import IntegrationAddInputs from '../components/IntegrationAddInputs.vue';
import { notifyFailed } from '../../../utils/btNotify';

const props = defineProps({
	accountType: {
		type: Object as PropType<AccountType>
	}
});

const { t } = useI18n();

const $q = useQuasar();

const { dialogRef, onDialogCancel, onDialogOK } = useDialogPluginComponent();

const step = ref(1);

const integrationStore = useIntegrationStore();

const integrationAddInputs = ref();

const accountInfo = ref(
	integrationService.supportAuthList.find((e) => e.type == props.accountType)!
		.detail
);

const previousAction = () => {
	onDialogCancel();
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
</script>

<style scoped lang="scss">
.cpu-core {
	text-align: right;
}

.dialog-content-root {
	.item-content {
		height: 56px;
		width: 100%;
		border: 1px solid $separator;
		border-radius: 12px;
	}
}
</style>
