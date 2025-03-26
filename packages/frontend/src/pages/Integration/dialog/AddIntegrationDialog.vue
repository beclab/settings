<template>
	<bt-custom-dialog
		ref="CustomRef"
		:title="t('add_account')"
		:skip="false"
		:ok="t('confirm')"
		size="medium"
		:platform="deviceStore.platform"
		:cancel="t('cancel')"
		@onSubmit="accountCreate"
	>
		<IntegrationAddList @itemClick="setItem" />
	</bt-custom-dialog>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';

import { useI18n } from 'vue-i18n';
import integraionService from '../../../services/integration/index';
import { IntegrationAccountInfo } from '../../../services/abstractions/integration/integrationService';
import IntegrationAddList from '../components/IntegrationAddList.vue';
import { ref } from 'vue';
import { useDeviceStore } from '../../../stores/device';
import ReminderDialogComponent from '../../../components/ReminderDialogComponent.vue';

const { t } = useI18n();

const $q = useQuasar();

const CustomRef = ref();
const deviceStore = useDeviceStore();
const cItem = ref<IntegrationAccountInfo | undefined>(undefined);
const accountCreate = async () => {
	if (!cItem.value) {
		return;
	}

	const webSupport = await integraionService.webSupport(cItem.value.type);
	if (!webSupport.status) {
		$q.dialog({
			component: ReminderDialogComponent,
			componentProps: {
				title: t('add_account'),
				message: webSupport.message,
				useCancel: false,
				confirmText: t('confirm')
			}
		});
		return;
	}

	CustomRef.value.onDialogCancel();
	integraionService.getInstanceByType(cItem.value.type)?.signIn({
		quasar: $q
	});
};

const setItem = (item: IntegrationAccountInfo) => {
	cItem.value = item;
};
</script>

<style scoped lang="scss">
.cpu-core {
	text-align: right;
}
</style>
