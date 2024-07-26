<template>
	<q-dialog ref="dialogRef" @hide="onDialogCancel">
		<div class="common-dialog" style="border-radius: 16px">
			<DialogHeader
				:title="t('add_account')"
				@close-action="onDialogCancel"
			></DialogHeader>
			<div class="dialog-content-root">
				<IntegrationAddList @itemClick="accountCreate" />
				<dialog-footer
					confirm-text="Save"
					:has-confirm="false"
					@cancel-action="onDialogCancel"
				/>
			</div>
		</div>
	</q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent, useQuasar } from 'quasar';
import DialogHeader from '../../../components/DialogHeader.vue';
import DialogFooter from '../../../components/DialogFooter.vue';
import { useI18n } from 'vue-i18n';
import integraionService from '../../../services/integration/index';
import { IntegrationAccountInfo } from '../../../services/abstractions/integration/integrationService';
import IntegrationAddList from '../components/IntegrationAddList.vue';
const { t } = useI18n();

const $q = useQuasar();

const { dialogRef, onDialogCancel } = useDialogPluginComponent();

const accountCreate = async (item: IntegrationAccountInfo) => {
	onDialogCancel();
	integraionService.getInstanceByType(item.type)?.signIn({
		quasar: $q
	});
};
</script>

<style scoped lang="scss">
.cpu-core {
	text-align: right;
}
</style>
