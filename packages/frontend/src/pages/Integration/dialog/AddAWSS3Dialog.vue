<template>
	<q-dialog ref="dialogRef" @hide="onDialogHide">
		<div class="common-dialog" style="border-radius: 16px">
			<DialogHeader
				:title="t('mount_network_drive')"
				@close-action="dialogRef?.hide()"
			></DialogHeader>
			<div class="dialog-content-root">
				<div v-if="step == 1">
					<terminus-edit
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
					/>
					<dialog-footer
						:confirm-text="t('next')"
						:cancelText="t('previous')"
						:confirm-disable="!enableCreate"
						@cancel-action="previousAction"
						@confirm-action="createAWSS3"
					/>
				</div>
				<div v-else-if="step == 2">
					<div class="text-body3 text-ink-2">
						Congratulations, you have successfully mounted the
						object storage service!
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
								:src="
									getRequireImage(
										`integration/${awss3Info.icon}`
									)
								"
								width="32px"
								height="32px"
							/>
							<div class="text-subtitle2 text-ink-1 q-ml-sm">
								{{ awss3Info.name }}
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
import { computed, ref } from 'vue';
import DialogHeader from '../../../components/DialogHeader.vue';
import DialogFooter from '../../../components/DialogFooter.vue';
import { useI18n } from 'vue-i18n';
// import integraionService from '../../../services/integration/index';
// import { getRequireImage } from '../../../utils/helper';
// import { IntegrationAccountInfo } from '../../../services/abstractions/integration/integrationService';
// import ReminderDialogComponent from '../../../components/ReminderDialogComponent.vue';
import TerminusEdit from '../../../components/base/TerminusEdit.vue';
import AddIntegrationDialog from './AddIntegrationDialog.vue';
import integrationService from '../../../services/integration/index';
import {
	AWSS3IntegrationAccount,
	AccountType
} from '../../../services/abstractions/integration/integrationService';
import { getRequireImage } from '../../../utils/helper';
import { useIntegrationStore } from '../../../stores/integration';

const { t } = useI18n();

const $q = useQuasar();

const { dialogRef, onDialogHide, onDialogCancel, onDialogOK } =
	useDialogPluginComponent();

const accessKeyID = ref('');

const accessKeySecret = ref('');

const endpoint = ref('');

const bucket = ref('');

const step = ref(1);

const integrationStore = useIntegrationStore();

const awss3Info = ref(
	integrationService.supportAuthList.find((e) => e.type == AccountType.AWSS3)!
		.detail
);

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

const previousAction = () => {
	onDialogCancel();
	$q.dialog({
		component: AddIntegrationDialog
	}).onOk(() => {});
};

const enableCreate = computed(() => {
	return (
		accessKeyIDRule(accessKeyID.value).length == 0 &&
		accessKeySecretRule(accessKeySecret.value).length == 0 &&
		endpointRule(endpoint.value).length == 0
	);
});

const createAWSS3 = async () => {
	console.log('createAWSS3');

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
		step.value = 2;
	} catch (error) {
		console.log('error ===>');

		console.log(error);
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
