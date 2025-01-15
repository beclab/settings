<template>
	<application-item
		:icon="app.icon"
		:title="app.title"
		:status="app.state"
		:hide-status="true"
		:width-separator="false"
		:end-icon="false"
		:margin-top="false"
	>
		<template v-slot>
			<bt-switch
				v-if="(adminStore.isAdmin || !isDemo) && !app.isSysApp"
				truthy-track-color="blue-default"
				:disable="
					app?.state !== APP_STATUS.suspend &&
					app?.state !== APP_STATUS.running
				"
				v-model="isRunning"
				@click="toggle"
			/>
		</template>
	</application-item>
</template>

<script lang="ts" setup>
import { TerminusApp } from '@bytetrade/core';
import { computed, PropType, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useApplicationStore } from '../../stores/application';
import { useAdminStore } from '../../stores/admin';
import { APP_STATUS, ENTRANCE_STATUS } from '../../utils/constants';
import { notifyFailed } from '../../utils/btNotify';
import { useI18n } from 'vue-i18n';
import ApplicationItem from './ApplicationItem.vue';

const $q = useQuasar();
const applicationStore = useApplicationStore();
const adminStore = useAdminStore();
const { t } = useI18n();
const isDemo = computed(() => {
	return !!process.env.DEMO;
});

const props = defineProps({
	app: {
		type: Object as PropType<TerminusApp>,
		required: true
	}
});

const isRunning = ref(props.app && props.app.state == APP_STATUS.running);

async function toggle() {
	if (
		props.app?.state !== APP_STATUS.suspend &&
		props.app?.state !== ENTRANCE_STATUS.crash &&
		props.app?.state !== APP_STATUS.running
	) {
		notifyFailed(t('app_operation_not_allowed'));
		return;
	}
	$q.loading.show();
	try {
		if (props.app?.state == APP_STATUS.suspend) {
			await applicationStore.resume(props.app.name);
		} else if (props.app?.state == APP_STATUS.running) {
			await applicationStore.suspend(props.app.name);
		}
		await applicationStore.status(props.app.name);
	} catch (e) {
		/* empty */
	} finally {
		$q.loading.hide();
	}
}
</script>

<style scoped lang="scss">
.application-detail-item {
	// height: 32px;
	// min-height: 32px;
	padding: 0;
	// background-color: red;
	height: 56px;

	.application-logo {
		width: 32px;
		height: 32px;
		border-radius: 8px;
	}

	.application-name {
		text-transform: capitalize;
		color: $ink-1;
		margin-left: 8px;
	}
	.application-status {
		text-align: right;
		color: $ink-2;
		text-transform: capitalize;
		margin-left: 4px;
	}
}
</style>
