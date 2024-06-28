<template>
	<q-dialog ref="dialogRef" @hide="onDialogHide">
		<div class="common-dialog" style="border-radius: 16px">
			<DialogHeader
				:title="t('add_account')"
				@close-action="dialogRef?.hide()"
			></DialogHeader>
			<div class="dialog-content-root">
				<q-item
					v-for="item in items"
					:key="item.type"
					clickable
					class="q-list-class item-content"
					@click="accountCreate(item)"
				>
					<q-item-section>
						<div class="row items-center">
							<q-img
								width="32px"
								height="32px"
								:noSpinner="true"
								:src="
									getRequireImage(
										`inegration/${item.detail.icon}`
									)
								"
							/>
							<div
								class="column justify-start justify-center q-ml-md"
							>
								<div class="row">
									<div class="text-subtitle2 account-title">
										{{ item.detail.name }}
									</div>
								</div>
							</div>
						</div>
					</q-item-section>
				</q-item>
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
import { ref } from 'vue';
import DialogHeader from '../../../components/DialogHeader.vue';
import DialogFooter from '../../../components/DialogFooter.vue';
import { useI18n } from 'vue-i18n';
import integraionService from '../../../services/integration/index';
import { getRequireImage } from '../../../utils/helper';
import { IntegrationAccountInfo } from '../../../services/abstractions/integration/integrationService';
import ReminderDialogComponent from '../../../components/ReminderDialogComponent.vue';
const { t } = useI18n();

const $q = useQuasar();

const { dialogRef, onDialogHide, onDialogCancel } = useDialogPluginComponent();

const items = ref(integraionService.supportAuthList);

const accountCreate = async (item: IntegrationAccountInfo) => {
	const webSupport = await integraionService.webSupport(item.type);
	if (!webSupport.status) {
		onDialogCancel();
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

.dialog-content-root {
	.item-content {
		height: 56px;
		// background-color: red;
	}
}
</style>
