<template>
	<q-item
		v-for="item in items"
		:key="item.type"
		clickable
		class="item-content text-background-1"
		:class="deviceStore.isMobile ? 'mobile-items-list' : 'q-list-class'"
		@click="selectItem(item)"
	>
		<q-item-section>
			<div class="row items-center">
				<q-img
					width="32px"
					height="32px"
					:noSpinner="true"
					:src="getRequireImage(`integration/${item.detail.icon}`)"
				/>
				<div
					class="column justify-start justify-center q-ml-md text-ink-1"
				>
					<div class="row">
						<div class="text-subtitle2 account-title">
							{{ item.detail.name }}
						</div>
					</div>
				</div>
			</div>
		</q-item-section>
		<q-item-section side v-if="selectEnable">
			<bt-check-box-component :model-value="select.type === item.type" />
		</q-item-section>
	</q-item>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import integraionService from '../../../services/integration/index';
import { IntegrationAccountInfo } from '../../../services/abstractions/integration/integrationService';
import { getRequireImage } from '../../../utils/helper';
import { useQuasar } from 'quasar';
import ReminderDialogComponent from '../../../components/ReminderDialogComponent.vue';
import { useI18n } from 'vue-i18n';
import { useDeviceStore } from '../../../stores/device';

import BtCheckBoxComponent from '../../../components/base/BtCheckBoxComponent.vue';

const props = defineProps({
	selectEnable: {
		type: Boolean,
		default: true,
		required: false
	}
});

const items = ref(integraionService.supportAuthList);
const $q = useQuasar();
const { t } = useI18n();
const deviceStore = useDeviceStore();
const selectItem = async (item: IntegrationAccountInfo) => {
	if (props.selectEnable) {
		select.value = item;
		emit('itemClick', select.value);
		return;
	}
	const webSupport = await integraionService.webSupport(item.type);
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
	emit('itemClick', item);
};

const select = ref(items.value[0]);

const emit = defineEmits(['itemClick']);
</script>

<style scoped lang="scss">
.item-content {
	height: 64px;
	// background-color: red;
}
.item-content:hover {
	background-color: $background-hover;
}
</style>
